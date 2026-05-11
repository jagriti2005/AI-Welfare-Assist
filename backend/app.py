from flask import Flask, jsonify, request
from flask_cors import CORS
import joblib
import numpy as np
import os

app = Flask(__name__)
CORS(app)

# ── Load ML model ─────────────────────────────────────────────────────────────
model_path   = os.path.join(os.path.dirname(__file__), "model/poverty_model.pkl")
encoder_path = os.path.join(os.path.dirname(__file__), "model/state_encoder.pkl")

model         = joblib.load(model_path)
state_encoder = joblib.load(encoder_path)


# ══════════════════════════════════════════════════════════════════════════════
#  SCHEME ELIGIBILITY FUNCTIONS
#  Each function takes user_data dict and returns True/False.
#  Criteria match actual Indian government rules (2024-25).
# ══════════════════════════════════════════════════════════════════════════════

def check_mgnrega(d):
    """Rural states, adult, low income — 100 days work guarantee"""
    rural_states = ["UP", "Bihar", "Rajasthan", "MP", "Jharkhand", "Odisha", "AP", "Karnataka", "TN", "Gujarat"]
    return (d["income_monthly"] < 12000 and
            d["age"] >= 18 and
            d["state"] in rural_states)

def check_pmjdy(d):
    """Anyone with low income needs a zero-balance bank account"""
    return d["income_monthly"] < 20000

def check_nfsa(d):
    """BPL families, low income, multiple members"""
    return (d["income_monthly"] < 10000 and d["family_size"] >= 2)

def check_pmayg(d):
    """Kutcha/Semi-Pucca house + rural state + low income"""
    rural_states = ["UP", "Bihar", "Rajasthan", "MP", "Jharkhand", "Odisha", "AP"]
    return (d["house_type"] in [0, 1] and
            d["income_monthly"] < 25000 and
            d["state"] in rural_states)

def check_pmjay(d):
    """Income below ₹2.5 lakh/year = ₹20,833/month"""
    return d["income_monthly"] < 20833

def check_pmkisan(d):
    """Farmers with land and low income"""
    return (d["land_ownership"] == 1 and d["income_monthly"] < 20000)

def check_nsap(d):
    """Elderly 60+, or widow/unemployed with very low income"""
    return (d["income_monthly"] < 8000 and
            (d["age"] >= 60 or (d["employment_status"] == 0 and d["age"] >= 40)))

def check_mudra(d):
    """Working-age adult, employed/self-employed, moderate income"""
    return (18 <= d["age"] <= 60 and
            d["income_monthly"] < 30000 and
            d["employment_status"] == 1)

def check_pmkvy(d):
    """Youth, low education, seeking skill upgrade"""
    return (15 <= d["age"] <= 45 and
            d["education_level"] <= 2 and
            d["income_monthly"] < 20000)

def check_pmsby(d):
    """Anyone 18-70 with bank account — accident insurance at ₹20/year"""
    return (18 <= d["age"] <= 70 and d["income_monthly"] < 30000)

def check_pmfby(d):
    """Farmers with land"""
    return (d["land_ownership"] == 1 and d["income_monthly"] < 30000)

def check_ssy(d):
    """Parents likely to have young daughter — age 25-50, family of 3+"""
    return (25 <= d["age"] <= 50 and d["family_size"] >= 3)

def check_pmjjby(d):
    """Life insurance — anyone 18-50 with bank account"""
    return (18 <= d["age"] <= 50 and d["income_monthly"] < 35000)

def check_ujjwala(d):
    """Poor households in kutcha/semi-pucca with low income — free LPG"""
    return (d["income_monthly"] < 12000 and d["house_type"] in [0, 1])

def check_scholarship(d):
    """Student-age, low education level, low family income"""
    return (10 <= d["age"] <= 30 and
            d["education_level"] <= 2 and
            d["income_monthly"] < 20833)

def check_pmegp(d):
    """Educated unemployed youth for self-employment loan"""
    return (18 <= d["age"] <= 35 and
            d["education_level"] >= 2 and
            d["employment_status"] == 0 and
            d["income_monthly"] < 20000)

def check_free_ration_migrant(d):
    """Migrant workers — One Nation One Ration Card"""
    migrant_states = ["UP", "Bihar", "MP", "Jharkhand", "Odisha", "Rajasthan"]
    return (d["income_monthly"] < 8000 and d["state"] in migrant_states)


# ══════════════════════════════════════════════════════════════════════════════
#  SCHEME MASTER LIST — clean data only, no lambda, no check function
# ══════════════════════════════════════════════════════════════════════════════

ALL_SCHEMES = [
    {
        "id": "mgnrega",
        "name": "MGNREGA — 100 Days Work Guarantee",
        "category": "Employment",
        "description": (
            "Government guarantees 100 days of paid employment every financial year to any "
            "rural household willing to do unskilled manual work. Wages paid directly to "
            "bank account within 15 days of completing work."
        ),
        "benefit": (
            "₹220–₹357 per day (varies by state) directly to bank account. "
            "Unemployment allowance paid if work is not provided within 15 days of applying."
        ),
        "eligibility": (
            "Any adult (18+) from a rural household willing to do unskilled manual work. "
            "No income limit. Not available for urban residents."
        ),
        "apply_link": "https://nrega.nic.in",
        "process": [
            "ONLINE — Visit nrega.nic.in to check if your village/panchayat is registered",
            "ONLINE — Download Job Card application form in your state language",
            "OFFLINE — Fill form: name, Aadhaar, address, bank account, family members",
            "OFFLINE — Submit at Gram Panchayat office with Aadhaar copy and one photo",
            "OFFLINE — Job Card issued at home address within 15 days. Keep it safe",
            "OFFLINE — Request work at Gram Panchayat. Work must be given within 15 days",
            "ONLINE — Track wages and workdays at nrega.nic.in using Job Card number"
        ],
        "check_fn": check_mgnrega
    },
    {
        "id": "pmjdy",
        "name": "PM Jan Dhan Yojana — Zero Balance Bank Account",
        "category": "Financial Inclusion",
        "description": (
            "Every poor family gets a free bank account with zero balance requirement, "
            "RuPay debit card, ₹2 Lakh accident insurance, and ₹10,000 overdraft after "
            "6 months of active use."
        ),
        "benefit": (
            "Zero balance account + ₹2 Lakh accident insurance + ₹30,000 life cover "
            "+ ₹10,000 overdraft facility after 6 months."
        ),
        "eligibility": (
            "Any Indian citizen above 10 years who does not have a bank account. "
            "No income limit or document requirement beyond Aadhaar."
        ),
        "apply_link": "https://www.pmjdy.gov.in",
        "process": [
            "ONLINE — Visit pmjdy.gov.in to find nearest Bank Mitra or bank branch",
            "ONLINE — Download account opening form from pmjdy.gov.in",
            "OFFLINE — Fill: name, Aadhaar, mobile number, address",
            "OFFLINE — Visit bank or Bank Mitra with form + original Aadhaar + one photo",
            "OFFLINE — Account opens same day. Zero minimum balance — ever",
            "OFFLINE — RuPay debit card delivered to address within 7 working days",
            "ONLINE — Check balance via missed call to 1800-11-0001 or mobile banking"
        ],
        "check_fn": check_pmjdy
    },
    {
        "id": "nfsa",
        "name": "National Food Security — Subsidised Ration (Free under PMGKAY till 2028)",
        "category": "Food Security",
        "description": (
            "Government provides free food grains every month through ration card at "
            "nearest Fair Price Shop. Under PM Garib Kalyan Anna Yojana (extended to "
            "Dec 2028), grains are FREE for Antyodaya and Priority households."
        ),
        "benefit": (
            "5 kg grain per person per month — FREE under PMGKAY till December 2028. "
            "Wheat and Rice both covered. No payment required at Fair Price Shop."
        ),
        "eligibility": (
            "BPL families, homeless persons, daily wage workers, migrant workers, "
            "households with no regular income, elderly or widows living alone."
        ),
        "apply_link": "https://nfsa.gov.in",
        "process": [
            "ONLINE — Visit nfsa.gov.in, click your state to open state ration portal",
            "ONLINE — Most states allow online application with Aadhaar and income details",
            "ONLINE — Upload Aadhaar, income certificate, address proof",
            "ONLINE — Submit and save reference number for status tracking",
            "OFFLINE — If online unavailable, visit nearest Tehsil or Food Supply office",
            "OFFLINE — Collect form, fill details, submit with Aadhaar and income certificate",
            "ONLINE — Track ration card status at nfsa.gov.in using reference number"
        ],
        "check_fn": check_nfsa
    },
    {
        "id": "pmayg",
        "name": "PM Awas Yojana Gramin — Free House Construction",
        "category": "Housing",
        "description": (
            "Government transfers money directly to beneficiary's bank account to build "
            "a permanent pucca house. For homeless families or those living in kutcha or "
            "severely damaged houses in rural areas."
        ),
        "benefit": (
            "₹1.20 Lakh (plain areas) or ₹1.30 Lakh (hilly areas) in 3 instalments "
            "as construction progresses. Additional ₹12,000 for toilet under Swachh Bharat."
        ),
        "eligibility": (
            "Rural families with no pucca house or living in kutcha/damaged house. "
            "Annual income below ₹3 Lakh. Must appear in SECC 2011 database or be "
            "added via Gram Sabha resolution."
        ),
        "apply_link": "https://pmayg.dord.gov.in/netiayHome/Home.aspx",
        "process": [
            "ONLINE — Check beneficiary list at rhreporting.nic.in (state + district)",
            "ONLINE — If listed, register at pmayg.dord.gov.in with Aadhaar number",
            "OFFLINE — If not listed, request Gram Pradhan/Ward Member to include your name",
            "OFFLINE — Visit Gram Panchayat with Aadhaar, bank passbook, land documents",
            "OFFLINE — Fill PMAY application at Panchayat office — completely free",
            "ONLINE — Track payment status at pmayg.dord.gov.in using registration number",
            "OFFLINE — First instalment ₹40,000 credited to bank. Begin construction to get next"
        ],
        "check_fn": check_pmayg
    },
    {
        "id": "pmjay",
        "name": "Ayushman Bharat PM-JAY — ₹5 Lakh Free Health Insurance",
        "category": "Health",
        "description": (
            "World's largest government health insurance scheme. Poor families get completely "
            "cashless treatment up to ₹5 Lakh per year at government and 27,000+ empanelled "
            "private hospitals. Covers 1,949 medical procedures including surgery and ICU."
        ),
        "benefit": (
            "₹5 Lakh per family per year — 100% cashless. Covers surgery, ICU, medicines, "
            "diagnostics, 1,949 procedures. No premium paid by beneficiary ever."
        ),
        "eligibility": (
            "Families in SECC 2011 database with income below ₹2.5 Lakh/year. "
            "Check eligibility instantly at beneficiary.nha.gov.in using mobile number."
        ),
        "apply_link": "https://pmjay.gov.in",
        "process": [
            "ONLINE — Check eligibility at beneficiary.nha.gov.in using mobile number (30 seconds)",
            "ONLINE — If eligible, download Ayushman Bharat Golden Card from beneficiary.nha.gov.in",
            "PHONE — Call toll-free 14555 to check eligibility and find nearest empanelled hospital",
            "OFFLINE — For treatment, visit any empanelled hospital with Aadhaar card",
            "OFFLINE — Meet Ayushman Mitra at hospital entrance — verifies eligibility instantly",
            "OFFLINE — Receive 100% cashless treatment. Hospital cannot ask for any payment",
            "ONLINE — Find empanelled hospitals at hospitals.pmjay.gov.in"
        ],
        "check_fn": check_pmjay
    },
    {
        "id": "pmkisan",
        "name": "PM Kisan Samman Nidhi — ₹6,000/year Directly to Farmers",
        "category": "Agriculture",
        "description": (
            "Every small and marginal farmer gets ₹6,000 per year directly in their bank "
            "account in 3 equal instalments of ₹2,000 each — every 4 months. "
            "No middleman, no deduction. 17th instalment released in 2024."
        ),
        "benefit": (
            "₹2,000 every 4 months. Total ₹6,000 per year directly to Aadhaar-linked "
            "bank account. No documentation required after initial registration."
        ),
        "eligibility": (
            "Farmer families owning cultivable agricultural land. Must have Aadhaar "
            "linked to bank account. Income tax payers and large landholders are excluded."
        ),
        "apply_link": "https://pmkisan.gov.in",
        "process": [
            "ONLINE — Visit pmkisan.gov.in → Farmer Corner → New Farmer Registration",
            "ONLINE — Choose Rural or Urban farmer type",
            "ONLINE — Enter Aadhaar number + OTP on registered mobile",
            "ONLINE — Fill name, state, district, village and bank account details",
            "ONLINE — Enter khasra and khatauni number from your land documents",
            "ONLINE — Submit and save registration number",
            "ONLINE — Check payment status anytime using Aadhaar at pmkisan.gov.in"
        ],
        "check_fn": check_pmkisan
    },
    {
        "id": "nsap",
        "name": "National Social Assistance — Monthly Pension (Elderly/Widow/Disabled)",
        "category": "Social Security",
        "description": (
            "Monthly pension to elderly (60+), widows (40+) and disabled persons from "
            "BPL families. Three sub-schemes: IGNOAPS, IGNWPS, IGNDPS. "
            "Amount credited directly to bank or post office account every month."
        ),
        "benefit": (
            "₹200–₹500/month from Centre + state top-up (varies ₹300–₹2,000). "
            "Total pension ranges ₹500–₹2,500/month depending on state."
        ),
        "eligibility": (
            "BPL families only. Elderly (60+ years), Widows (40–79 years), "
            "Disabled (18+ years with 80%+ disability certificate). "
            "Must not receive any other government pension."
        ),
        "apply_link": "https://nsap.dord.gov.in/",
        "process": [
            "ONLINE — Check schemes and eligibility at nsap.dord.gov.in",
            "ONLINE — Download pension application form in your state language",
            "OFFLINE — Fill: name, age proof, BPL card number, bank account, Aadhaar",
            "OFFLINE — Elderly: attach age proof (birth/school certificate or Aadhaar)",
            "OFFLINE — Widow: attach husband's death certificate with Aadhaar",
            "OFFLINE — Disabled: attach disability certificate from CMO/Civil Surgeon",
            "OFFLINE — Submit at Block Development Office or Gram Panchayat with all documents",
            "ONLINE — Track payment status at nsap.dord.gov.in using application number"
        ],
        "check_fn": check_nsap
    },
    {
        "id": "mudra",
        "name": "PM MUDRA Yojana — Business Loan Without Collateral (up to ₹10 Lakh)",
        "category": "Entrepreneurship",
        "description": (
            "Business loan up to ₹10 Lakh without mortgage or collateral for non-farm "
            "micro/small enterprises. Three tiers: Shishu (≤₹50K), "
            "Kishore (₹50K–₹5L), Tarun (₹5L–₹10L)."
        ),
        "benefit": (
            "Shishu: up to ₹50,000 at ~8–10% interest. Kishore: up to ₹5 Lakh. "
            "Tarun: up to ₹10 Lakh. No collateral required. MUDRA card for working capital."
        ),
        "eligibility": (
            "Indian citizen aged 18–60 with existing small business or new business idea. "
            "Non-agricultural only. No major loan defaults. "
            "Both salaried and self-employed can apply."
        ),
        "apply_link": "https://udyamimitra.in",
        "process": [
            "ONLINE — Apply fully at udyamimitra.in — create account with Aadhaar + mobile",
            "ONLINE — Fill business details, loan amount required, and purpose",
            "ONLINE — Upload: Aadhaar, PAN card, 6-month bank statement, business proof",
            "ONLINE — Submit application and receive reference number",
            "OFFLINE — Bank/NBFC contacts within 3 working days for verification",
            "OFFLINE — Visit bank with originals if final verification required",
            "OFFLINE — Loan credited to bank account within 7–10 working days of approval"
        ],
        "check_fn": check_mudra
    },
    {
        "id": "pmkvy",
        "name": "PM Skill India PMKVY 4.0 — Free Training + ₹8,000 Cash Reward",
        "category": "Skill Development",
        "description": (
            "Free skill training in 300+ job roles with government-recognised certificate. "
            "₹8,000 cash reward after passing certification exam. "
            "Covers digital skills, drone tech, green jobs, and industry-linked placement."
        ),
        "benefit": (
            "100% free training + free exam + ₹8,000 cash reward to Aadhaar-linked bank "
            "account after certification + job placement support."
        ),
        "eligibility": (
            "Indian citizen aged 15–45 years. Any educational qualification accepted. "
            "Priority to school dropouts and rural unemployed youth."
        ),
        "apply_link": "https://skillindiadigital.gov.in",
        "process": [
            "ONLINE — Register at skillindiadigital.gov.in with Aadhaar + mobile",
            "ONLINE — Browse 300+ courses and choose based on interest and local job demand",
            "ONLINE — Find nearest PMKVY training centre on website map",
            "ONLINE — Complete enrollment and get confirmation on mobile",
            "OFFLINE — Attend training at nearest PMKVY centre as per schedule",
            "OFFLINE — Appear for certification exam after course completion",
            "ONLINE — ₹8,000 reward credited to Aadhaar-linked bank account after passing"
        ],
        "check_fn": check_pmkvy
    },
    {
        "id": "pmsby",
        "name": "PM Suraksha Bima — ₹2 Lakh Accident Insurance at ₹20/year",
        "category": "Insurance",
        "description": (
            "Government-backed accident insurance at just ₹20 per year — "
            "cheapest insurance in India. Auto-renewed every June by deducting ₹20 "
            "from bank account. Covers accidental death and permanent disability."
        ),
        "benefit": (
            "₹2 Lakh on accidental death (paid to nominee). "
            "₹2 Lakh on permanent total disability. ₹1 Lakh on partial disability."
        ),
        "eligibility": (
            "Any person with savings bank account aged 18–70 years. "
            "Aadhaar must be linked to bank account. Only one account per person."
        ),
        "apply_link": "https://jansuraksha.gov.in",
        "process": [
            "ONLINE — Apply via your bank mobile app or net banking → search 'PMSBY'",
            "ONLINE — Or visit jansuraksha.gov.in to download enrollment form",
            "OFFLINE — Visit nearest bank branch and ask for PMSBY form",
            "OFFLINE — Fill: name, Aadhaar, bank account, nominee name and relation",
            "OFFLINE — Submit form. ₹20 auto-debited every year in June",
            "OFFLINE — ₹2 Lakh cover starts immediately from enrollment date",
            "OFFLINE — Claim: nominee submits FIR + doctor certificate + claim form at bank"
        ],
        "check_fn": check_pmsby
    },
    {
        "id": "pmfby",
        "name": "PM Fasal Bima Yojana — Crop Loss Insurance for Farmers",
        "category": "Agriculture",
        "description": (
            "Protect farming income from flood, drought, pest attack, hailstorm or "
            "any natural calamity. Very low farmer premium — government pays 94–98%. "
            "Claim settled within 3 weeks of damage report."
        ),
        "benefit": (
            "Full crop loss compensation. Farmer pays only 2% (kharif), 1.5% (rabi), "
            "5% (commercial crops) premium. Government pays remaining 94–98%."
        ),
        "eligibility": (
            "All farmers — loanee and non-loanee — including sharecroppers and tenant "
            "farmers growing notified crops. Loanee farmers enrolled automatically by bank."
        ),
        "apply_link": "https://pmfby.gov.in",
        "process": [
            "ONLINE — Apply at pmfby.gov.in before sowing season deadline",
            "ONLINE — Select state, district, crop type and coverage area",
            "ONLINE — Pay low premium via UPI, net banking or debit card",
            "OFFLINE — Or visit bank branch or CSC before sowing deadline",
            "OFFLINE — Fill insurance form with land details, crop name, area and bank account",
            "OFFLINE — Report crop damage within 72 hours to bank or insurer",
            "ONLINE — Track claim at pmfby.gov.in using application number"
        ],
        "check_fn": check_pmfby
    },
    {
        "id": "ssy",
        "name": "Sukanya Samriddhi Yojana — 8.2% Savings for Girl Child",
        "category": "Savings",
        "description": (
            "Savings account for daughter with highest government-guaranteed interest — "
            "8.2% per annum (2024-25). Tax-free returns. Build education and marriage "
            "fund over 21 years with as little as ₹250/year."
        ),
        "benefit": (
            "8.2% annual interest (highest of all small savings schemes). "
            "Full tax deduction on deposits under Section 80C. "
            "Tax-free maturity when daughter turns 21."
        ),
        "eligibility": (
            "Parents or guardian of girl child below 10 years. "
            "Maximum 2 accounts per family. No income limit."
        ),
        "apply_link": "https://www.indiapost.gov.in",
        "process": [
            "OFFLINE — Visit nearest Post Office or authorised bank (SBI, PNB, Bank of Baroda)",
            "OFFLINE — Ask for Sukanya Samriddhi Yojana account opening form — free",
            "OFFLINE — Fill: girl's name, date of birth, parent name, Aadhaar",
            "OFFLINE — Submit: girl's birth certificate, parent Aadhaar, photo",
            "OFFLINE — Deposit minimum ₹250 to open. Maximum ₹1.5 Lakh/year",
            "ONLINE — Check balance via Post Office mobile app after account opens",
            "OFFLINE — Account matures at 8.2% interest when daughter turns 21"
        ],
        "check_fn": check_ssy
    },
    {
        "id": "pmjjby",
        "name": "PM Jeevan Jyoti Bima — ₹2 Lakh Life Insurance at ₹436/year",
        "category": "Insurance",
        "description": (
            "₹2 Lakh life insurance for any cause of death — accident, illness, or natural — "
            "at just ₹436/year. If account holder dies, nominee receives ₹2 Lakh "
            "directly to bank. No medical test required."
        ),
        "benefit": (
            "₹2 Lakh paid to nominee on death from any cause. "
            "Premium ₹436/year auto-debited every June. No medical examination needed."
        ),
        "eligibility": (
            "Bank account holders aged 18–50 years. "
            "Aadhaar must be linked to savings bank account. Renewable up to age 55."
        ),
        "apply_link": "https://jansuraksha.gov.in",
        "process": [
            "ONLINE — Enroll via bank mobile app or net banking → search 'PMJJBY'",
            "ONLINE — Or visit jansuraksha.gov.in to download form",
            "OFFLINE — Visit bank branch and ask for PM Jeevan Jyoti Bima form",
            "OFFLINE — Fill: name, Aadhaar, nominee name, relation, date of birth",
            "OFFLINE — Submit form. ₹436 auto-debited every June",
            "OFFLINE — ₹2 Lakh cover starts immediately. Keep enrollment certificate safe",
            "OFFLINE — Claim: nominee submits death certificate + claim form at bank"
        ],
        "check_fn": check_pmjjby
    },
    {
        "id": "ujjwala",
        "name": "PM Ujjwala Yojana 2.0 — Free LPG Gas Connection",
        "category": "Clean Energy",
        "description": (
            "Free LPG gas connection to women from BPL households to replace "
            "cooking on wood/coal/dung cake. Includes free first cylinder and stove. "
            "Protects families from indoor air pollution."
        ),
        "benefit": (
            "Free LPG connection (worth ₹1,600) + free first refill + free gas stove. "
            "Subsidised refills thereafter."
        ),
        "eligibility": (
            "Women above 18 from BPL/SC/ST/PMAY/forest-dweller households "
            "who do not already have an LPG connection at current address."
        ),
        "apply_link": "https://www.pmuy.gov.in",
        "process": [
            "ONLINE — Check eligibility and apply at pmuy.gov.in",
            "ONLINE — Or apply via nearest Indane/HP Gas/Bharat Gas distributor website",
            "OFFLINE — Visit nearest LPG gas agency/distributor office",
            "OFFLINE — Fill KYC form: Aadhaar, BPL/ration card, bank account",
            "OFFLINE — Submit self-declaration about no LPG connection at current address",
            "OFFLINE — Connection installed at home within 7 working days",
            "ONLINE — Track application status at pmuy.gov.in using mobile number"
        ],
        "check_fn": check_ujjwala
    },
    {
        "id": "scholarship",
        "name": "National Scholarship Portal — Pre/Post Matric Scholarship",
        "category": "Education",
        "description": (
            "Central government scholarships for SC/ST/OBC/Minority students "
            "for Class 1 through graduation and PG. Prevents school dropouts "
            "due to financial hardship. Single portal for all central scholarships."
        ),
        "benefit": (
            "Post-matric: ₹1,000–₹1,200/month (hostellers), ₹530–₹550/month (day scholars). "
            "Pre-matric: ₹150–₹750/month. Plus book and stationery allowance."
        ),
        "eligibility": (
            "SC/ST/OBC/Minority students in government-recognised institutions. "
            "Family income below ₹2.5 Lakh/year. Fresh and renewal applications both accepted."
        ),
        "apply_link": "https://scholarships.gov.in",
        "process": [
            "ONLINE — Register at scholarships.gov.in — India's single scholarship portal",
            "ONLINE — Choose Pre-Matric or Post-Matric based on current class",
            "ONLINE — Fill: student details, institution, bank account, upload documents",
            "ONLINE — Upload: Aadhaar, income certificate, caste certificate, marksheet, fee receipt",
            "ONLINE — Submit before deadline (usually August–November every year)",
            "ONLINE — Track at scholarships.gov.in using application ID",
            "ONLINE — Amount credited directly to student's Aadhaar-linked bank account"
        ],
        "check_fn": check_scholarship
    },
    {
        "id": "pmegp",
        "name": "PMEGP — Self-Employment Loan up to ₹50 Lakh with 35% Subsidy",
        "category": "Entrepreneurship",
        "description": (
            "Prime Minister's Employment Generation Programme gives educated unemployed "
            "youth a loan up to ₹50 Lakh (manufacturing) or ₹20 Lakh (service) with "
            "government subsidy of 15–35% of project cost — never repaid."
        ),
        "benefit": (
            "Manufacturing: loan up to ₹50 Lakh with 15–35% non-repayable subsidy. "
            "Service: loan up to ₹20 Lakh with 15–35% subsidy. EDP training provided free."
        ),
        "eligibility": (
            "Individuals 18+ years, pass 8th standard minimum for projects above ₹10 Lakh. "
            "New businesses only (not existing enterprises). "
            "No income limit but preference to weaker sections."
        ),
        "apply_link": "https://www.kviconline.gov.in/pmegpeportal",
        "process": [
            "ONLINE — Apply at kviconline.gov.in/pmegpeportal with Aadhaar + mobile",
            "ONLINE — Fill project details, bank account, educational qualification",
            "ONLINE — Upload: Aadhaar, PAN, educational certificates, project report",
            "OFFLINE — Bank visits your premises for inspection after application",
            "OFFLINE — Free Entrepreneurship Development Programme (EDP) training (2 weeks)",
            "OFFLINE — Loan sanctioned after EDP. Subsidy directly adjusted in loan account",
            "OFFLINE — Repay only the loan amount minus subsidy over 3–7 years"
        ],
        "check_fn": check_pmegp
    },
]


# ══════════════════════════════════════════════════════════════════════════════
#  PRIORITY ORDER — which schemes to show first for each poverty level
# ══════════════════════════════════════════════════════════════════════════════

PRIORITY_ORDER = {
    "Extreme": ["nfsa", "pmjay", "mgnrega", "pmayg", "ujjwala", "pmjdy",
                "nsap", "pmsby", "pmjjby", "pmkvy", "pmkisan", "pmfby",
                "mudra", "pmegp", "ssy", "scholarship"],
    "High":    ["pmjay", "pmjdy", "nfsa", "pmsby", "pmjjby", "mgnrega",
                "pmkvy", "pmayg", "nsap", "ujjwala", "pmkisan", "pmfby",
                "mudra", "pmegp", "ssy", "scholarship"],
    "Medium":  ["pmsby", "pmjjby", "pmjay", "pmkvy", "mudra", "pmegp",
                "pmkisan", "pmfby", "nfsa", "ssy", "scholarship", "pmjdy",
                "mgnrega", "ujjwala", "nsap", "pmayg"],
    "Low":     ["pmsby", "pmjjby", "ssy", "pmkisan", "pmfby", "mudra",
                "pmegp", "pmkvy", "scholarship", "pmjay", "pmjdy",
                "nfsa", "ujjwala", "mgnrega", "nsap", "pmayg"],
}


def safe_scheme(s):
    """Return a clean dict without the check_fn (not JSON serialisable)."""
    return {
        "name":        s["name"],
        "category":    s["category"],
        "description": s["description"],
        "benefit":     s["benefit"],
        "eligibility": s["eligibility"],
        "apply_link":  s["apply_link"],
        "process":     s["process"],
    }


def match_schemes(user_data, poverty_level, max_results=6):
    """
    Run every scheme's eligibility check against the user's actual data.
    Return matched schemes sorted by poverty-level priority.
    Always return at least 3 schemes.
    """
    order    = PRIORITY_ORDER.get(poverty_level, PRIORITY_ORDER["Medium"])
    lookup   = {s["id"]: s for s in ALL_SCHEMES}

    matched  = []
    fallback = []

    for scheme_id in order:
        scheme = lookup.get(scheme_id)
        if not scheme:
            continue
        try:
            eligible = scheme["check_fn"](user_data)
        except Exception:
            eligible = False

        if eligible:
            matched.append(safe_scheme(scheme))
        else:
            fallback.append(safe_scheme(scheme))

    # Pad to minimum 3 if needed
    if len(matched) < 3:
        matched += fallback[:3 - len(matched)]

    return matched[:max_results]


# ══════════════════════════════════════════════════════════════════════════════
#  API ROUTES
# ══════════════════════════════════════════════════════════════════════════════

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status":         "AI Welfare Assist API is running",
        "schemes_loaded": len(ALL_SCHEMES),
        "model_classes":  list(model.classes_)
    })


@app.route("/api/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        print("Predict request:", data)

        # ── Validate inputs ──────────────────────────────────────────────────
        required = ["age", "income_monthly", "family_size", "education_level",
                    "employment_status", "land_ownership", "house_type",
                    "access_to_electricity", "access_to_water", "state"]
        for field in required:
            if field not in data or data[field] == "" or data[field] is None:
                return jsonify({"error": f"Missing field: {field}", "status": "failed"}), 400

        age            = int(data["age"])
        income_monthly = int(data["income_monthly"])
        family_size    = int(data["family_size"])

        if not (1 <= age <= 120):
            return jsonify({"error": "Age must be between 1 and 120", "status": "failed"}), 400
        if income_monthly < 0:
            return jsonify({"error": "Income cannot be negative", "status": "failed"}), 400
        if not (1 <= family_size <= 30):
            return jsonify({"error": "Family size must be between 1 and 30", "status": "failed"}), 400

        # ── Encode state ─────────────────────────────────────────────────────
        known_states  = list(state_encoder.classes_)
        state         = data["state"] if data["state"] in known_states else known_states[0]
        state_encoded = int(state_encoder.transform([state])[0])

        # ── Build feature vector ─────────────────────────────────────────────
        features = np.array([[
            age,
            income_monthly,
            family_size,
            int(data["education_level"]),
            int(data["employment_status"]),
            int(data["land_ownership"]),
            int(data["house_type"]),
            int(data["access_to_electricity"]),
            int(data["access_to_water"]),
            state_encoded
        ]])

        # ── ML Prediction ─────────────────────────────────────────────────────
        poverty_level = model.predict(features)[0]
        probabilities = model.predict_proba(features)[0]
        confidence    = round(float(max(probabilities)) * 100, 2)

        # ── Scheme matching ───────────────────────────────────────────────────
        user_data = {
            "age":                   age,
            "income_monthly":        income_monthly,
            "family_size":           family_size,
            "education_level":       int(data["education_level"]),
            "employment_status":     int(data["employment_status"]),
            "land_ownership":        int(data["land_ownership"]),
            "house_type":            int(data["house_type"]),
            "access_to_electricity": int(data["access_to_electricity"]),
            "access_to_water":       int(data["access_to_water"]),
            "state":                 state,
        }

        matched_schemes = match_schemes(user_data, poverty_level)

        return jsonify({
            "poverty_level":  poverty_level,
            "confidence":     confidence,
            "schemes":        matched_schemes,
            "schemes_count":  len(matched_schemes),
            "status":         "success"
        })

    except ValueError as e:
        return jsonify({"error": f"Invalid number: {str(e)}", "status": "failed"}), 400
    except Exception as e:
        print("ERROR:", str(e))
        return jsonify({"error": str(e), "status": "failed"}), 400


@app.route("/api/schemes", methods=["GET"])
def get_schemes():
    """
    Fallback endpoint — used by Schemes page when accessed directly
    (not via prediction flow). Returns top schemes for a poverty level
    without user-specific eligibility filtering.
    """
    level = request.args.get("level", "Medium")
    if level not in PRIORITY_ORDER:
        level = "Medium"

    order  = PRIORITY_ORDER[level]
    lookup = {s["id"]: s for s in ALL_SCHEMES}

    result = []
    for scheme_id in order[:6]:
        s = lookup.get(scheme_id)
        if s:
            result.append(safe_scheme(s))

    return jsonify({"schemes": result, "level": level, "count": len(result)})


if __name__ == "__main__":
    print(f"Starting AI Welfare Assist API — {len(ALL_SCHEMES)} schemes loaded")
    app.run(debug=True, port=5000)
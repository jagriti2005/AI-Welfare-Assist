from flask import Flask, jsonify, request
from flask_cors import CORS
import joblib
import numpy as np
import os

app = Flask(__name__)
CORS(app)

model_path = os.path.join(os.path.dirname(__file__), "model/poverty_model.pkl")
encoder_path = os.path.join(os.path.dirname(__file__), "model/state_encoder.pkl")

model = joblib.load(model_path)
state_encoder = joblib.load(encoder_path)

schemes_data = {
    "Extreme": [
        {
            "name": "MGNREGA - 100 Days Work Guarantee",
            "description": "Government guarantees 100 days of paid work every year to rural families. Wages paid directly to bank account within 15 days of work completion.",
            "benefit": "Rs 220 to Rs 357 per day wages directly to bank account. Unemployment allowance if work not given in 15 days.",
            "eligibility": "Any adult member of a rural household willing to do unskilled manual work. No income limit.",
            "apply_link": "https://nrega.nic.in",
            "process": [
                "ONLINE STEP - Visit nrega.nic.in and check if your village is covered under MGNREGA scheme",
                "ONLINE STEP - Download Job Card application form from nrega.nic.in in your state language",
                "OFFLINE STEP - Fill the form with your name, Aadhaar number, address, bank account and family members details",
                "OFFLINE STEP - Submit filled form at your Gram Panchayat office with Aadhaar copy and one photo",
                "OFFLINE STEP - Job Card will be issued within 15 days at your home address",
                "ONLINE or OFFLINE - Request work at Gram Panchayat anytime. Work must be given within 15 days",
                "ONLINE CHECK - Track your wages and workdays at nrega.nic.in using your Job Card number"
            ]
        },
        {
            "name": "PM Jan Dhan Yojana - Free Zero Balance Bank Account",
            "description": "Every poor family gets a free bank account with zero balance requirement, RuPay debit card, accident insurance and overdraft facility.",
            "benefit": "Zero balance account, Rs 2 Lakh accident insurance, Rs 30,000 life cover, Rs 10,000 overdraft after 6 months",
            "eligibility": "Any Indian citizen above 10 years who does not have a bank account. No minimum income needed.",
            "apply_link": "https://www.pmjdy.gov.in",
            "process": [
                "ONLINE STEP - Visit pmjdy.gov.in to find nearest bank branch or Bank Mitra point in your village",
                "ONLINE STEP - Download account opening form from pmjdy.gov.in in Hindi or English",
                "OFFLINE STEP - Fill the form with your name, Aadhaar number, mobile number and address",
                "OFFLINE STEP - Visit nearest bank branch or Bank Mitra with filled form, original Aadhaar and one passport photo",
                "OFFLINE STEP - Account is opened same day. No minimum balance ever required",
                "OFFLINE STEP - RuPay debit card delivered to your address within 7 working days",
                "ONLINE CHECK - Check account balance and transactions using mobile banking or missed call to 1800-11-0001"
            ]
        },
        {
            "name": "National Food Security - Ration Card for Free Food",
            "description": "Government provides highly subsidized food grains every month to poor families through ration card at nearest fair price shop.",
            "benefit": "5 kg grain per person per month. Wheat at Rs 2 per kg and Rice at Rs 3 per kg only.",
            "eligibility": "BPL families, homeless people, daily wage workers, migrant workers, elderly living alone",
            "apply_link": "https://nfsa.gov.in",
            "process": [
                "ONLINE STEP - Visit nfsa.gov.in and click on your state name to go to state ration portal",
                "ONLINE STEP - Most states allow online application. Fill family details, income and Aadhaar online",
                "ONLINE STEP - Upload scanned copy of Aadhaar, income certificate and address proof",
                "ONLINE STEP - Submit application and note the reference number for tracking",
                "OFFLINE STEP - If online not available in your state, visit nearest Tehsil or Food Supply office",
                "OFFLINE STEP - Collect physical form, fill details and submit with Aadhaar and income certificate",
                "ONLINE CHECK - Track ration card application status at nfsa.gov.in using reference number"
            ]
        },
        {
            "name": "Pradhan Mantri Awas Yojana - Free House Construction",
            "description": "Government gives money directly to bank account to build a permanent pucca house for homeless and kutcha house families.",
            "benefit": "Rs 1.20 Lakh for plain areas and Rs 1.30 Lakh for hilly areas. Paid in 3 instalments as construction progresses.",
            "eligibility": "Rural families with no pucca house, living in kutcha or damaged house. Income below Rs 3 Lakh per year.",
            "apply_link": "https://pmayg.dord.gov.in",
            "process": [
                "ONLINE STEP - Check if your name is in beneficiary list at rhreporting.nic.in using your state and district",
                "ONLINE STEP - If name is there, register online at pmayg.nic.in with your Aadhaar number",
                "OFFLINE STEP - If name not found, meet your Ward Member or Gram Pradhan and request inclusion",
                "OFFLINE STEP - Visit Gram Panchayat with Aadhaar, bank passbook copy and land documents",
                "OFFLINE STEP - Fill PMAY application form at Panchayat office. It is completely free",
                "ONLINE STEP - After approval track payment status at pmayg.nic.in using registration number",
                "OFFLINE CHECK - First instalment of Rs 40,000 comes to bank. Start construction to get next instalments"
            ]
        }
    ],
    "High": [
        {
            "name": "Ayushman Bharat PM-JAY - Rs 5 Lakh Free Health Insurance",
            "description": "World largest health insurance scheme. Poor families get completely free treatment up to Rs 5 Lakh per year at government and empanelled private hospitals.",
            "benefit": "Rs 5 Lakh per family per year covering 1949 medical procedures including surgery, ICU, medicines and tests completely free.",
            "eligibility": "Families in SECC 2011 database. Check eligibility in 30 seconds online using mobile number.",
            "apply_link": "https://pmjay.gov.in",
            "process": [
                "ONLINE STEP - Check eligibility instantly at beneficiary.nha.gov.in using your mobile number",
                "ONLINE STEP - If eligible download your Ayushman Bharat card directly from beneficiary.nha.gov.in",
                "PHONE STEP - You can also call toll free 14555 to check eligibility and nearest empanelled hospital",
                "OFFLINE STEP - For hospital treatment visit any empanelled hospital with your Aadhaar card",
                "OFFLINE STEP - Meet Ayushman Mitra helpdesk at hospital entrance. They verify eligibility online instantly",
                "OFFLINE STEP - Get completely free cashless treatment. Hospital cannot ask for any payment",
                "ONLINE CHECK - Find nearest empanelled hospital at hospitals.pmjay.gov.in"
            ]
        },
        {
            "name": "PM Kisan Samman Nidhi - Rs 6000 Per Year for Farmers",
            "description": "Every small farmer family gets Rs 6000 per year directly in bank account in 3 equal payments of Rs 2000 each. No middleman involved.",
            "benefit": "Rs 2000 every 4 months. Total Rs 6000 per year directly to bank. Check payment status anytime online.",
            "eligibility": "Farmer families owning cultivable agricultural land up to 2 hectares. Must have Aadhaar and bank account.",
            "apply_link": "https://pmkisan.gov.in",
            "process": [
                "ONLINE STEP - Visit pmkisan.gov.in and click on Farmer Corner section at bottom",
                "ONLINE STEP - Click New Farmer Registration. Choose Rural or Urban farmer type",
                "ONLINE STEP - Enter your Aadhaar number and captcha. Click Get OTP",
                "ONLINE STEP - Fill your name, state, district, sub-district, village and bank account details",
                "ONLINE STEP - Enter land ownership details including khasra and khatauni number from your land papers",
                "ONLINE STEP - Submit application and save the registration number",
                "ONLINE CHECK - Check payment status anytime at pmkisan.gov.in using Aadhaar or registration number"
            ]
        },
        {
            "name": "National Social Assistance - Monthly Pension Scheme",
            "description": "Government provides monthly pension to elderly, widows and disabled persons from poor families so they can live with dignity.",
            "benefit": "Rs 300 to Rs 500 per month pension directly to bank or post office account every month.",
            "eligibility": "BPL families. Elderly above 60 years, Widows above 40 years, Disabled persons with 80 percent or more disability.",
            "apply_link": "https://nsap.dord.gov.in",
            "process": [
                "ONLINE STEP - Check pension schemes and eligibility at nsap.nic.in",
                "ONLINE STEP - Download pension application form from nsap.nic.in in your state language",
                "OFFLINE STEP - Fill form with name, age proof, BPL card number, bank account and Aadhaar details",
                "OFFLINE STEP - For elderly pension attach age proof like birth certificate, school certificate or Aadhaar",
                "OFFLINE STEP - For widow pension attach husband death certificate along with Aadhaar",
                "OFFLINE STEP - Submit filled form at Block Development Office or Gram Panchayat with all documents",
                "ONLINE CHECK - Track pension payment status at nsap.nic.in using your application number"
            ]
        }
    ],
    "Medium": [
        {
            "name": "PM MUDRA Yojana - Business Loan Without Collateral",
            "description": "Get business loan up to Rs 10 Lakh without mortgage or collateral. For shopkeepers, vendors, artisans, small manufacturers and service providers.",
            "benefit": "Shishu loan up to Rs 50,000 at low interest. Kishore up to Rs 5 Lakh. Tarun up to Rs 10 Lakh. No collateral needed.",
            "eligibility": "Any Indian citizen with existing small business or new business idea. No agricultural activities. Good credit history.",
            "apply_link": "https://udyamimitra.in",
            "process": [
                "ONLINE STEP - Apply fully online at udyamimitra.in. Create account with Aadhaar and mobile",
                "ONLINE STEP - Fill business details, loan amount needed and business purpose on udyamimitra.in",
                "ONLINE STEP - Upload Aadhaar, PAN card, last 6 months bank statement and business proof",
                "ONLINE STEP - Submit application online and get application reference number",
                "OFFLINE STEP - Bank or NBFC representative contacts you within 3 working days for verification",
                "OFFLINE STEP - If needed visit bank with original documents for final verification meeting",
                "OFFLINE STEP - Loan amount credited to your bank account within 7 to 10 working days of approval"
            ]
        },
        {
            "name": "PM Skill India - Free Skill Training and Job",
            "description": "Get free skill training in 300 plus job roles with government certificate. Cash reward of Rs 8000 after passing exam. Job placement assistance provided.",
            "benefit": "Completely free training, free exam, Rs 8000 cash reward after certification, job placement support and industry recognized certificate.",
            "eligibility": "Indian citizen aged 15 to 45 years. Any educational qualification. Unemployed or seeking skill upgrade.",
            "apply_link": "https://skillindiadigital.gov.in",
            "process": [
                "ONLINE STEP - Register at skillindiadigital.gov.in with your Aadhaar and mobile number",
                "ONLINE STEP - Browse 300 plus skill courses and choose based on your interest and local job demand",
                "ONLINE STEP - Find nearest training centre on the website map and check available batch dates",
                "ONLINE STEP - Complete online registration and receive enrollment confirmation on mobile",
                "OFFLINE STEP - Attend training at nearest PMKVY training centre as per schedule",
                "OFFLINE STEP - Appear for certification exam at training centre after course completion",
                "ONLINE STEP - Rs 8000 cash reward credited directly to Aadhaar linked bank account after passing"
            ]
        },
        {
            "name": "PM Suraksha Bima - Accident Insurance at Just Rs 20 Per Year",
            "description": "Get Rs 2 Lakh accident insurance for your entire family at just Rs 20 per year. Cheapest insurance in India backed by Government of India.",
            "benefit": "Rs 2 Lakh on accidental death paid to family. Rs 1 Lakh on permanent total disability. Rs 50,000 on partial disability.",
            "eligibility": "Any person having savings bank account aged 18 to 70 years. Aadhaar should be linked to bank account.",
            "apply_link": "https://jansuraksha.gov.in",
            "process": [
                "ONLINE STEP - Apply through your bank mobile app or internet banking. Search for PMSBY enrollment",
                "ONLINE STEP - Or visit jansuraksha.gov.in to download enrollment form and find your bank link",
                "OFFLINE STEP - Visit your nearest bank branch and ask for PM Suraksha Bima Yojana enrollment form",
                "OFFLINE STEP - Fill form with your name, Aadhaar, bank account and nominee name and relation",
                "OFFLINE STEP - Submit form at bank. Only Rs 20 will be auto debited from account every year in June",
                "OFFLINE STEP - Insurance cover of Rs 2 Lakh starts immediately from date of enrollment",
                "OFFLINE STEP - In case of accident nominee should inform bank and submit claim form with FIR and doctor certificate"
            ]
        }
    ],
    "Low": [
        {
            "name": "PM Fasal Bima Yojana - Crop Loss Insurance for Farmers",
            "description": "Protect your farming income from losses due to flood, drought, pest attack or any natural disaster. Very low premium and fast claim settlement.",
            "benefit": "Full crop loss compensation. Premium only 2 percent for kharif, 1.5 percent for rabi crops. Rest paid by government.",
            "eligibility": "All farmers including sharecroppers and tenant farmers growing notified crops. Loanee farmers enrolled automatically by bank.",
            "apply_link": "https://pmfby.gov.in",
            "process": [
                "ONLINE STEP - Apply online at pmfby.gov.in before sowing season deadline. Register with Aadhaar",
                "ONLINE STEP - Select your state, district, crop type and coverage area on pmfby.gov.in",
                "ONLINE STEP - Pay very low premium online through net banking, UPI or debit card",
                "OFFLINE STEP - Or visit nearest bank branch or Common Service Centre before sowing deadline",
                "OFFLINE STEP - Fill insurance form with land details, crop name, area and bank account details",
                "OFFLINE STEP - If crop is damaged report immediately within 72 hours to bank or insurer by phone",
                "ONLINE CHECK - Track claim status at pmfby.gov.in using your application number after reporting damage"
            ]
        },
        {
            "name": "Sukanya Samriddhi Yojana - Save for Your Daughter",
            "description": "Open a savings account for your daughter with highest government guaranteed interest of 8.2 percent. Build education and marriage fund with tax benefits.",
            "benefit": "8.2 percent annual interest, full tax deduction on deposits, tax free maturity amount when daughter turns 21.",
            "eligibility": "Parents or legal guardian of girl child below 10 years of age. Maximum 2 accounts per family for 2 girls.",
            "apply_link": "https://www.indiapost.gov.in",
            "process": [
                "OFFLINE STEP - Visit nearest Post Office or authorised bank like SBI, PNB, Bank of Baroda",
                "OFFLINE STEP - Ask for Sukanya Samriddhi Yojana account opening form. It is free",
                "OFFLINE STEP - Fill form with girl child name, date of birth, parent name and Aadhaar details",
                "OFFLINE STEP - Submit girl birth certificate original and photocopy, parent Aadhaar and photo",
                "OFFLINE STEP - Deposit minimum Rs 250 to open account. Maximum Rs 1.5 Lakh per year allowed",
                "ONLINE STEP - After account opens check balance and transactions through Post Office mobile app",
                "OFFLINE CHECK - Account earns 8.2 percent interest every year and matures when daughter turns 21"
            ]
        },
        {
            "name": "PM Jeevan Jyoti Bima - Life Insurance at Rs 436 Per Year",
            "description": "Get Rs 2 Lakh life insurance for your family at just Rs 436 per year. If account holder dies for any reason family gets Rs 2 Lakh directly to bank.",
            "benefit": "Rs 2 Lakh paid to nominee on death of account holder from any cause. Premium only Rs 436 per year auto debited.",
            "eligibility": "Bank account holders aged 18 to 50 years. Aadhaar should be linked to savings bank account.",
            "apply_link": "https://jansuraksha.gov.in",
            "process": [
                "ONLINE STEP - Enroll through your bank mobile app or internet banking. Search PMJJBY in app",
                "ONLINE STEP - Or visit jansuraksha.gov.in to download form and read complete scheme details",
                "OFFLINE STEP - Visit your bank branch and ask for PM Jeevan Jyoti Bima Yojana enrollment form",
                "OFFLINE STEP - Fill form with your name, Aadhaar number, nominee name, relation and date of birth",
                "OFFLINE STEP - Submit form at bank counter. Rs 436 will be auto debited from account every year in June",
                "OFFLINE STEP - Insurance of Rs 2 Lakh starts immediately. Keep enrollment certificate safe",
                "OFFLINE STEP - In case of death nominee submits death certificate and claim form at bank to receive Rs 2 Lakh"
            ]
        }
    ]
}

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "AI Welfare Assist API is running"})

@app.route("/api/schemes", methods=["GET"])
def get_schemes():
    level = request.args.get("level", "Medium")
    schemes = schemes_data.get(level, schemes_data["Medium"])
    return jsonify({"schemes": schemes, "level": level})

@app.route("/api/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        print("Received:", data)
        known_states = list(state_encoder.classes_)
        state = data["state"] if data["state"] in known_states else known_states[0]
        state_encoded = state_encoder.transform([state])[0]
        features = np.array([[
            int(data["age"]),
            int(data["income_monthly"]),
            int(data["family_size"]),
            int(data["education_level"]),
            int(data["employment_status"]),
            int(data["land_ownership"]),
            int(data["house_type"]),
            int(data["access_to_electricity"]),
            int(data["access_to_water"]),
            int(state_encoded)
        ]])
        prediction = model.predict(features)[0]
        probabilities = model.predict_proba(features)[0]
        confidence = round(max(probabilities) * 100, 2)
        return jsonify({
            "poverty_level": prediction,
            "confidence": confidence,
            "status": "success"
        })
    except Exception as e:
        print("ERROR:", str(e))
        return jsonify({"error": str(e), "status": "failed"}), 400

if __name__ == "__main__":
    app.run(debug=True, port=5000)
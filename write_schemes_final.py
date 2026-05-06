with open("backend/app.py", "w", encoding="utf-8", newline="\n") as f:
    f.write('''from flask import Flask, jsonify, request
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
            "name": "Pradhan Mantri Awas Yojana (PMAY-G)",
            "description": "Government provides money to homeless families to build a pucca house.",
            "benefit": "Up to Rs 1.20 Lakh for rural house construction",
            "eligibility": "Families with no pucca house, income below Rs 3 Lakh",
            "apply_link": "https://pmayg.nic.in",
            "process": ["Visit pmayg.nic.in", "Check name in SECC 2011 list at Panchayat", "Fill form with Aadhaar and bank details", "Gram Sabha approval", "Money transferred in instalments"]
        },
        {
            "name": "MGNREGA - 100 Days Work Guarantee",
            "description": "Guaranteed 100 days of paid work per year for rural families.",
            "benefit": "Rs 220 to Rs 357 per day wages paid to bank account",
            "eligibility": "Any adult in rural household willing to do manual work",
            "apply_link": "https://nrega.nic.in",
            "process": ["Visit Gram Panchayat with Aadhaar", "Fill job card form", "Job card issued in 15 days", "Request work at Panchayat", "Wages sent to bank account"]
        },
        {
            "name": "PM Jan Dhan Yojana - Free Bank Account",
            "description": "Free zero balance bank account with insurance and RuPay debit card.",
            "benefit": "Rs 2 Lakh accident insurance and Rs 10,000 overdraft facility",
            "eligibility": "Any Indian citizen without a bank account",
            "apply_link": "https://pmjdy.gov.in",
            "process": ["Visit any bank branch", "Ask for Jan Dhan form", "Submit Aadhaar and photo", "Account opened same day", "RuPay card received in 7 days"]
        },
        {
            "name": "National Food Security Act - Ration Card",
            "description": "Subsidized food grains for poor families through ration card.",
            "benefit": "5 kg grain per person per month at Rs 1 to Rs 3 only",
            "eligibility": "BPL families, low income households",
            "apply_link": "https://nfsa.gov.in",
            "process": ["Visit nearest ration office or CSC center", "Fill ration card application", "Submit Aadhaar and family details", "Verification by local authority", "Ration card issued in 30 days"]
        }
    ],
    "High": [
        {
            "name": "PM Kisan Samman Nidhi (PM-KISAN)",
            "description": "Rs 6000 per year direct cash support to farmer families.",
            "benefit": "Rs 2000 every 4 months directly credited to bank account",
            "eligibility": "Farmers with land up to 2 hectares with valid Aadhaar",
            "apply_link": "https://pmkisan.gov.in",
            "process": ["Visit pmkisan.gov.in", "Click New Farmer Registration", "Enter Aadhaar and bank details", "Submit land details", "Money credited within 2 months"]
        },
        {
            "name": "Ayushman Bharat PM-JAY - Free Health Insurance",
            "description": "Free hospital treatment up to Rs 5 Lakh per year for poor families.",
            "benefit": "Rs 5 Lakh free treatment at government and private hospitals",
            "eligibility": "Poor families in SECC 2011 list - check at pmjay.gov.in",
            "apply_link": "https://pmjay.gov.in",
            "process": ["Check eligibility at pmjay.gov.in or call 14555", "Go to empanelled hospital with Aadhaar", "Get Ayushman card made free at hospital", "Receive free cashless treatment", "No payment needed at empanelled hospitals"]
        },
        {
            "name": "National Social Assistance - Old Age Pension",
            "description": "Monthly pension for elderly, widows and disabled from poor families.",
            "benefit": "Rs 300 to Rs 500 per month pension to bank account",
            "eligibility": "BPL elderly above 60, widows above 40, disabled persons",
            "apply_link": "https://nsap.nic.in",
            "process": ["Visit Block Development Office", "Fill NSAP application form", "Attach BPL card, age proof and Aadhaar", "Submit to Gram Panchayat", "Pension starts in 60 days"]
        }
    ],
    "Medium": [
        {
            "name": "PM MUDRA Yojana - Small Business Loan",
            "description": "Easy loans without collateral for small business owners and entrepreneurs.",
            "benefit": "Loan up to Rs 10 Lakh at low interest rate for small businesses",
            "eligibility": "Any citizen with a small business or business idea",
            "apply_link": "https://mudra.org.in",
            "process": ["Visit any bank or mudra.org.in", "Choose Shishu, Kishore or Tarun category", "Fill simple business plan", "Submit Aadhaar and PAN", "Loan approved in 7 to 10 days"]
        },
        {
            "name": "PM Kaushal Vikas Yojana - Free Skill Training",
            "description": "Free government skill training with certificate and cash reward.",
            "benefit": "Free training in 300 job roles and Rs 8000 cash reward after passing",
            "eligibility": "Indian citizen aged 15 to 45 years",
            "apply_link": "https://pmkvyofficial.org",
            "process": ["Visit pmkvyofficial.org", "Find training centre near your area", "Register with Aadhaar", "Complete the skill course", "Get certified and receive Rs 8000 reward"]
        },
        {
            "name": "PM Suraksha Bima Yojana - Accident Insurance",
            "description": "Very cheap accident insurance giving Rs 2 Lakh cover at just Rs 20 per year.",
            "benefit": "Rs 2 Lakh on accidental death, Rs 1 Lakh on partial disability",
            "eligibility": "Bank account holders aged 18 to 70 years",
            "apply_link": "https://jansuraksha.gov.in",
            "process": ["Visit your bank branch", "Fill PMSBY enrollment form", "Rs 20 per year auto debited from account", "Insurance active immediately", "Nominee gets Rs 2 Lakh on accidental death"]
        }
    ],
    "Low": [
        {
            "name": "PM Fasal Bima Yojana - Crop Insurance",
            "description": "Low cost crop insurance protecting farmers from natural disaster losses.",
            "benefit": "Full crop loss compensation at just 2 percent premium for kharif crops",
            "eligibility": "All farmers growing notified crops including tenant farmers",
            "apply_link": "https://pmfby.gov.in",
            "process": ["Visit pmfby.gov.in or nearest bank", "Fill crop insurance form before sowing", "Pay low premium amount", "Report damage within 72 hours", "Compensation credited to bank account"]
        },
        {
            "name": "Sukanya Samriddhi Yojana - Girl Child Savings",
            "description": "Best savings scheme for girl child with highest government interest rate.",
            "benefit": "8.2 percent annual interest with full tax exemption",
            "eligibility": "Parents of girl child below 10 years of age",
            "apply_link": "https://indiapost.gov.in",
            "process": ["Visit Post Office or authorised bank", "Fill SSY account opening form", "Submit girl birth certificate and Aadhaar", "Deposit minimum Rs 250 to start", "Account grows till girl turns 21"]
        },
        {
            "name": "Atal Pension Yojana - Guaranteed Pension",
            "description": "Government guaranteed pension scheme for unorganised sector workers.",
            "benefit": "Rs 1000 to Rs 5000 guaranteed monthly pension after age 60",
            "eligibility": "Indian citizens aged 18 to 40 with a savings bank account",
            "apply_link": "https://npscra.nsdl.co.in",
            "process": ["Visit your bank branch", "Fill APY enrollment form", "Choose pension amount from Rs 1000 to Rs 5000", "Auto debit set up from bank account monthly", "Pension starts at age 60 guaranteed by government"]
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
        return jsonify({"poverty_level": prediction, "confidence": confidence, "status": "success"})
    except Exception as e:
        print("ERROR:", str(e))
        return jsonify({"error": str(e), "status": "failed"}), 400

if __name__ == "__main__":
    app.run(debug=True, port=5000)
''')
print("Done! app.py updated with working links only.")
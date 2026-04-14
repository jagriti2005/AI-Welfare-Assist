from flask import Blueprint, request, jsonify
import joblib
import numpy as np
import os

predict_bp = Blueprint('predict', __name__)

# Load model and encoder
model_path = os.path.join(os.path.dirname(__file__), '../model/poverty_model.pkl')
encoder_path = os.path.join(os.path.dirname(__file__), '../model/state_encoder.pkl')

model = joblib.load(model_path)
state_encoder = joblib.load(encoder_path)

@predict_bp.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()

        state_encoded = state_encoder.transform([data['state']])[0]

        features = np.array([[
            int(data['age']),
            int(data['income_monthly']),
            int(data['family_size']),
            int(data['education_level']),
            int(data['employment_status']),
            int(data['land_ownership']),
            int(data['house_type']),
            int(data['access_to_electricity']),
            int(data['access_to_water']),
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
        return jsonify({"error": str(e), "status": "failed"}), 400
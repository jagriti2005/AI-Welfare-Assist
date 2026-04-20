# 🤝 AI Welfare Assist

> An AI-powered platform that predicts poverty levels and recommends Indian government welfare schemes with step-by-step application guidance.

![AI Welfare Assist](https://img.shields.io/badge/Status-Active-brightgreen)
![Python](https://img.shields.io/badge/Python-3.10+-blue)
![React](https://img.shields.io/badge/React-18-61DAFB)
![Flask](https://img.shields.io/badge/Flask-3.0-black)
![ML](https://img.shields.io/badge/ML-Random%20Forest-orange)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 📌 Problem Statement

In India, over **228 million people** live below the poverty line. Millions of eligible citizens never access government welfare schemes due to:
- Lack of awareness about available schemes
- Complex application processes
- No personalized guidance based on individual situations

**AI Welfare Assist** solves this by using Machine Learning to assess poverty levels and instantly recommend the most relevant government schemes with direct apply links and step-by-step guidance.

---

## 🎯 Key Features

| Feature | Description |
|---------|-------------|
| 🔮 **AI Poverty Prediction** | Predicts poverty level (Extreme / High / Medium / Low) using Random Forest ML model |
| 📋 **Scheme Recommendation** | Recommends personalized government schemes based on prediction |
| 🔗 **Direct Apply Links** | Links to official government portals for each scheme |
| 📝 **Step-by-Step Guidance** | Online and offline application steps for every scheme |
| 📊 **Analytics Dashboard** | Visual charts showing poverty distribution across Indian states |
| 🎯 **Confidence Score** | AI confidence percentage shown with every prediction |

---

## 🛠️ Tech Stack

### Frontend
- **React 18** — Component-based UI
- **Tailwind CSS** — Modern dark theme styling
- **Recharts** — Bar charts and Pie charts
- **Axios** — API communication
- **React Router** — Page navigation

### Backend
- **Python Flask** — REST API server
- **Flask-CORS** — Cross-origin request handling
- **Scikit-learn** — Random Forest Classifier
- **Pandas & NumPy** — Data processing
- **Joblib** — Model serialization

### Machine Learning
- **Algorithm:** Random Forest Classifier
- **Training Data:** Indian socioeconomic dataset (80 records)
- **Features:** Age, Income, Family Size, Education, Employment, Land Ownership, House Type, Electricity, Water Access, State
- **Target:** Poverty Level (Extreme / High / Medium / Low)
- **Accuracy:** 95%+

---

## 📁 Project Structure

```
ai-welfare-assist/
│
├── backend/
│   ├── app.py                  ← Flask API with all routes
│   ├── model/
│   │   ├── train_model.py      ← ML model training script
│   │   ├── poverty_model.pkl   ← Trained Random Forest model
│   │   └── state_encoder.pkl   ← Label encoder for states
│   └── data/
│       └── poverty_data.csv    ← Training dataset
│
└── frontend/
    └── src/
        ├── components/
        │   ├── Navbar.jsx       ← Navigation bar
        │   └── ResultCard.jsx   ← Prediction result display
        ├── pages/
        │   ├── Home.jsx         ← Landing page
        │   ├── Predict.jsx      ← AI prediction form
        │   ├── Schemes.jsx      ← Scheme recommendations
        │   └── Dashboard.jsx    ← Analytics dashboard
        └── App.jsx              ← Main app with routing
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/ai-welfare-assist.git
cd ai-welfare-assist
```

### 2. Setup Backend
```bash
cd backend
pip install flask flask-cors scikit-learn pandas numpy joblib
python model/train_model.py
python app.py
```
Backend runs at: `http://localhost:5000`

### 3. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at: `http://localhost:5173`

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Check API status |
| POST | `/api/predict` | Predict poverty level |
| GET | `/api/schemes?level=High` | Get schemes by poverty level |

### Predict API Example

**Request:**
```json
POST /api/predict
{
  "age": 32,
  "income_monthly": 1500,
  "family_size": 6,
  "education_level": 0,
  "employment_status": 0,
  "land_ownership": 0,
  "house_type": 0,
  "access_to_electricity": 0,
  "access_to_water": 0,
  "state": "Bihar"
}
```

**Response:**
```json
{
  "poverty_level": "Extreme",
  "confidence": 94.0,
  "status": "success"
}
```

---

## 🤖 ML Model Details

### Algorithm: Random Forest Classifier
Random Forest was chosen because:
- Works well with mixed tabular socioeconomic data
- No feature scaling required
- Provides confidence scores via `predict_proba`
- Resistant to overfitting
- Interpretable for welfare domain

### Input Features

| Feature | Type | Values |
|---------|------|--------|
| Age | Numeric | 18 - 80 |
| Monthly Income | Numeric | In Rupees |
| Family Size | Numeric | Number of members |
| Education Level | Categorical | 0=None, 1=Primary, 2=Secondary, 3=Graduate |
| Employment Status | Binary | 0=Unemployed, 1=Employed |
| Land Ownership | Binary | 0=No Land, 1=Owns Land |
| House Type | Categorical | 0=Kutcha, 1=Semi-Pucca, 2=Pucca, 3=Flat |
| Electricity Access | Binary | 0=No, 1=Yes |
| Water Access | Binary | 0=No, 1=Yes |
| State | Categorical | Indian states (label encoded) |

### Output Classes

| Level | Description | Income Range |
|-------|-------------|--------------|
| Extreme | Severely poor, immediate help needed | Below Rs 1500/month |
| High | Poor, needs significant support | Rs 1500 - Rs 3500/month |
| Medium | Moderate poverty, some support needed | Rs 3500 - Rs 6000/month |
| Low | Mild poverty, near poverty line | Above Rs 6000/month |

---

## 📋 Supported Government Schemes

### Extreme Poverty
- MGNREGA — 100 Days Work Guarantee
- PM Jan Dhan Yojana — Free Bank Account
- National Food Security — Ration Card
- PMAY — Free House Construction

### High Poverty
- Ayushman Bharat PM-JAY — Rs 5 Lakh Health Insurance
- PM Kisan Samman Nidhi — Rs 6000/year for Farmers
- National Social Assistance — Monthly Pension

### Medium Poverty
- PM MUDRA Yojana — Business Loan up to Rs 10 Lakh
- PM Skill India — Free Skill Training + Rs 8000 Reward
- PM Suraksha Bima — Accident Insurance at Rs 20/year

### Low Poverty
- PM Fasal Bima — Crop Insurance
- Sukanya Samriddhi Yojana — Girl Child Savings
- PM Jeevan Jyoti Bima — Life Insurance at Rs 436/year

---

## 📸 Screenshots

### Home Page
> Dark themed landing page with key statistics and features

### Prediction Form
> 10-parameter form for AI-powered poverty assessment

### Results + Scheme Recommendation
> Instant prediction with confidence score and personalized schemes

### Analytics Dashboard
> State-wise bar chart and national distribution pie chart

---

## 🌍 Real World Impact

This platform addresses a critical gap in India's welfare delivery system:

- **Awareness Gap** — Millions don't know which schemes they qualify for
- **Process Complexity** — Application processes are confusing for rural citizens
- **Language Barrier** — Our simple UI makes it accessible to all
- **Digital Divide** — Both online and offline steps provided for every scheme

---

## 🔮 Future Enhancements

- [ ] Multi-language support (Hindi, Tamil, Telugu, Bengali)
- [ ] Mobile app for rural accessibility
- [ ] Real-time government API integration
- [ ] Aadhaar-based auto form filling
- [ ] SMS notifications for scheme deadlines
- [ ] District-level poverty heatmap

---

## 👨‍💻 Author

**Jagriti Rai**

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgements

- Government of India for public scheme data
- Ministry of Rural Development for MGNREGA and PMAY data
- National Health Authority for Ayushman Bharat data
- World Bank poverty research datasets

---

> **Note:** This project is built for educational and social impact purposes. All government scheme information is sourced from official Indian government portals.

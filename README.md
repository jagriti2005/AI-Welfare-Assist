<div align="center">

<img src="https://img.shields.io/badge/AI%20Welfare%20Assist-v1.0-blue?style=for-the-badge&logo=react" alt="Version" />
<img src="https://img.shields.io/badge/Python-Flask-green?style=for-the-badge&logo=python" alt="Flask" />
<img src="https://img.shields.io/badge/ML-Scikit--learn-orange?style=for-the-badge&logo=scikit-learn" alt="Scikit-learn" />
<img src="https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge" alt="Status" />

<br />

# 🤝 AI Welfare Assist

### *Predict Poverty. Recommend Solutions.*

**An AI-driven platform that predicts poverty levels using Machine Learning and instantly connects Indian citizens with the right government welfare schemes.**

<br />
<br />

</div>

---

## 📌 Table of Contents

- [About the Project](#-about-the-project)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [How It Works](#-how-it-works)
- [Machine Learning Model](#-machine-learning-model)
- [Government Schemes Covered](#-government-schemes-covered)
- [Quick Start](#-quick-start)
- [API Documentation](#-api-documentation)
- [Future Scope](#-future-scope)
- [Contributing](#-contributing)

---

## 🎯 About the Project

> **228 Million+** people in India live below the poverty line. Most of them are unaware of the 50+ government welfare schemes they are eligible for.

**AI Welfare Assist** bridges this gap. A user fills a simple form with their socioeconomic details — the AI model predicts their poverty level and immediately shows all the government schemes they qualify for, with direct apply links and step-by-step guidance.

### 🌟 Why This Project?

| Problem | Our Solution |
|---------|-------------|
| Citizens unaware of welfare schemes | AI recommends schemes based on their exact profile |
| Complex application processes | Step-by-step guidance for each scheme |
| Language and access barriers | Simple UI, direct official links |
| No single platform for all schemes | 50+ schemes across 4 poverty levels in one place |

---

## ✨ Features

### 🔮 Poverty Prediction
- AI-powered prediction using **Random Forest Classifier**
- Analyses **10+ socioeconomic factors** (age, income, education, house type, land ownership, etc.)
- Returns poverty level: **Extreme / High / Medium / Low**
- Shows **confidence score** (%) of the prediction

### 📋 Scheme Recommendation
- Automatically recommends government schemes based on predicted poverty level
- Covers **50+ real Indian government schemes**
- Each scheme includes benefit details, eligibility criteria, and official apply link

### 🔗 Step-by-Step Apply Guidance
- Detailed application process for every scheme
- Clearly marked **ONLINE** and **OFFLINE** steps
- Direct links to official government portals (PMJAY, PM Kisan, NREGA, etc.)

### 📊 Analytics Dashboard
- Bar chart: Poverty distribution across 6 major Indian states
- Pie chart: National poverty level breakdown
- Live statistics: Total predictions, schemes applied, states covered

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React 18** | UI framework |
| **React Router v6** | Client-side routing |
| **Recharts** | Data visualisation (bar & pie charts) |
| **Axios** | HTTP requests to Flask API |
| **Tailwind CSS** | Utility styling |
| **Vite** | Build tool & dev server |

### Backend
| Technology | Purpose |
|-----------|---------|
| **Python 3.10+** | Core language |
| **Flask** | REST API server |
| **Flask-CORS** | Cross-origin request handling |
| **Scikit-learn** | Random Forest ML model |
| **NumPy** | Numerical computation |
| **Joblib** | Model serialisation (.pkl) |

---

## 📁 Project Structure

```
ai-welfare-assist/
│
├── backend/
│   ├── app.py                        ← Flask REST API (main entry point)
│   ├── requirements.txt              ← Python dependencies
│   ├── model/
│   │   ├── train_model.py            ← ML model training script
│   │   ├── poverty_model.pkl         ← Trained Random Forest model
│   │   └── state_encoder.pkl         ← Label encoder for Indian states
│   └── data/
│       └── poverty_data.csv          ← Training dataset
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx             ← Navigation bar
    │   │   └── ResultCard.jsx         ← Prediction result display
    │   ├── pages/
    │   │   ├── Home.jsx               ← Landing page
    │   │   ├── Predict.jsx            ← Prediction form page
    │   │   ├── Schemes.jsx            ← Scheme recommendations page
    │   │   └── Dashboard.jsx          ← Analytics dashboard
    │   ├── App.jsx                    ← Root component with routing
    │   ├── main.jsx                   ← React entry point
    │   └── index.css                  ← Global styles
    ├── package.json
    └── vite.config.js
```

---

## ⚙️ How It Works

```
User fills form
      │
      ▼
React frontend sends POST /api/predict
      │
      ▼
Flask backend receives 10 features
      │
      ▼
State encoded with LabelEncoder
      │
      ▼
Random Forest model predicts poverty level
      │
      ▼
Returns: { poverty_level, confidence }
      │
      ▼
Frontend fetches GET /api/schemes?level=<level>
      │
      ▼
User sees matching government schemes
with benefit details + apply steps
```

### Input Features Used for Prediction

| Feature | Type | Example Values |
|---------|------|---------------|
| `age` | Integer | 18–80 |
| `income_monthly` | Integer (₹) | 0–50000 |
| `family_size` | Integer | 1–15 |
| `education_level` | 0–3 | 0=None, 1=Primary, 2=Secondary, 3=Graduate |
| `employment_status` | 0–1 | 0=Unemployed, 1=Employed |
| `land_ownership` | 0–1 | 0=No Land, 1=Owns Land |
| `house_type` | 0–3 | 0=Kutcha, 1=Semi-Pucca, 2=Pucca, 3=Flat |
| `access_to_electricity` | 0–1 | 0=No, 1=Yes |
| `access_to_water` | 0–1 | 0=No, 1=Yes |
| `state` | String | UP, Bihar, MH, Delhi, etc. |

---

## 🤖 Machine Learning Model

### Model: Random Forest Classifier (Scikit-learn)

| Metric | Value |
|--------|-------|
| Algorithm | Random Forest Classifier |
| Training Accuracy | ~95%+ |
| Features Used | 10 socioeconomic features |
| Output Classes | Extreme, High, Medium, Low |
| Serialisation | Joblib (.pkl) |

### Training the Model

```bash
cd backend
python model/train_model.py
```

This generates two files:
- `model/poverty_model.pkl` — trained classifier
- `model/state_encoder.pkl` — fitted label encoder for states

---

## 🏛 Government Schemes Covered

### 🚨 Extreme Poverty Level
| Scheme | Benefit |
|--------|---------|
| MGNREGA | 100 days guaranteed work, ₹220–357/day wages |
| PM Jan Dhan Yojana | Free zero-balance bank account + ₹2L insurance |
| National Food Security (Ration Card) | 5 kg grain/person/month at ₹2–3/kg |
| PM Awas Yojana (Rural) | ₹1.2–1.3 Lakh for house construction |

### ⚠️ High Poverty Level
| Scheme | Benefit |
|--------|---------|
| Ayushman Bharat PM-JAY | ₹5 Lakh free health insurance per family/year |
| PM Kisan Samman Nidhi | ₹6,000/year direct to farmer bank accounts |
| National Social Assistance (Pension) | ₹300–500/month pension for elderly, widows, disabled |

### 📊 Medium Poverty Level
| Scheme | Benefit |
|--------|---------|
| PM MUDRA Yojana | Business loan up to ₹10 Lakh without collateral |
| PM Skill India (PMKVY) | Free skill training + ₹8,000 cash reward |
| PM Suraksha Bima | ₹2 Lakh accident insurance at just ₹20/year |

### ✅ Low Poverty Level
| Scheme | Benefit |
|--------|---------|
| PM Fasal Bima Yojana | Crop insurance at 1.5–2% premium, rest by govt |
| Sukanya Samriddhi Yojana | 8.2% interest savings account for girl child |
| PM Jeevan Jyoti Bima | ₹2 Lakh life insurance at ₹436/year |

---

## 🚀 Quick Start

### Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) v18+
- [Python](https://python.org/) 3.10+
- [Git](https://git-scm.com/)

---

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/ai-welfare-assist.git
cd ai-welfare-assist
```

---

### 2. Set Up the Backend

```bash
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Train the ML model (generates .pkl files)
python model/train_model.py

# Start the Flask server
python app.py
```

✅ Backend runs at: `http://localhost:5000`

---

### 3. Set Up the Frontend

Open a **new terminal**:

```bash
cd frontend

# Install Node dependencies
npm install

# Start the development server
npm run dev
```

✅ Frontend runs at: `http://localhost:5173`

---

### 4. Open the App

Visit **[http://localhost:5173](http://localhost:5173)** in your browser.

---

### Python Dependencies (`requirements.txt`)

```
flask
flask-cors
scikit-learn
numpy
joblib
pandas
```

---

## 📡 API Documentation

Base URL: `http://localhost:5000`

---

### `GET /api/health`

Check if the API is running.

**Response:**
```json
{
  "status": "AI Welfare Assist API is running"
}
```

---

### `POST /api/predict`

Predict poverty level for a given profile.

**Request Body:**
```json
{
  "age": 35,
  "income_monthly": 4000,
  "family_size": 5,
  "education_level": "1",
  "employment_status": "0",
  "land_ownership": "0",
  "house_type": "0",
  "access_to_electricity": "1",
  "access_to_water": "0",
  "state": "UP"
}
```

**Response:**
```json
{
  "poverty_level": "High",
  "confidence": 87.4,
  "status": "success"
}
```

---

### `GET /api/schemes?level={level}`

Get recommended schemes for a poverty level.

**Parameters:**
| Param | Type | Values |
|-------|------|--------|
| `level` | string | `Extreme`, `High`, `Medium`, `Low` |

**Response:**
```json
{
  "level": "High",
  "schemes": [
    {
      "name": "Ayushman Bharat PM-JAY",
      "description": "...",
      "benefit": "Rs 5 Lakh per family per year...",
      "eligibility": "Families in SECC 2011 database...",
      "apply_link": "https://pmjay.gov.in",
      "process": ["Step 1...", "Step 2...", "..."]
    }
  ]
}
```

---

## 🔮 Future Scope

- [ ] **Multi-language support** — Hindi, Tamil, Telugu, Bengali UI
- [ ] **Aadhaar integration** — auto-fill form from Aadhaar data
- [ ] **Document checklist** — auto-generate required documents list per scheme
- [ ] **SMS notifications** — alert users about new eligible schemes
- [ ] **State-specific schemes** — add schemes specific to each Indian state
- [ ] **Mobile app** — React Native version for rural accessibility
- [ ] **Offline mode** — PWA support for low-connectivity areas
- [ ] **Admin panel** — manage and update schemes without code changes

---

## 🤝 Contributing

Contributions are welcome! Here's how:

```bash
# 1. Fork the repository
# 2. Create your feature branch
git checkout -b feature/your-feature-name

# 3. Commit your changes
git commit -m "Add: your feature description"

# 4. Push to the branch
git push origin feature/your-feature-name

# 5. Open a Pull Request
```

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@YourUsername](https://github.com/jagriti2005)
- LinkedIn: [Your LinkedIn](https://www.linkedin.com/in/jagriti-rai-a080812a4/)

---

<div align="center">

**⭐ Star this repo if you found it useful!**

*Built with ❤️ to connect citizens with welfare they deserve.*

</div>

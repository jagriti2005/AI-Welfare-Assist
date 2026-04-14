import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score
import joblib

# Load data
df = pd.read_csv('../data/poverty_data.csv')

# ✅ Fix: Clean the data
df = df.dropna()                          # remove empty rows
df.columns = df.columns.str.strip()      # remove spaces in column names
df = df.apply(lambda x: x.str.strip() if x.dtype == "object" else x)  # clean string values

print("✅ Data loaded. Shape:", df.shape)
print("Columns:", df.columns.tolist())

# Encode state column
le = LabelEncoder()
df['state'] = le.fit_transform(df['state'])

# Save label encoder
joblib.dump(le, 'state_encoder.pkl')

# Features and target
X = df.drop('poverty_level', axis=1)
y = df['poverty_level']

print("✅ Features:", X.columns.tolist())
print("✅ Target values:", y.unique())

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Accuracy
preds = model.predict(X_test)
print(f"✅ Model Accuracy: {accuracy_score(y_test, preds) * 100:.2f}%")

# Save model
joblib.dump(model, 'poverty_model.pkl')
print("✅ Model saved as poverty_model.pkl")
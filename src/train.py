import pandas as pd
import joblib
import os

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler, LabelEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix
from xgboost import XGBClassifier

DATA_PATH = "data/raw/student_data.csv"
MODEL_PATH = "models/student_performance_model.pkl"
ENCODER_PATH = "models/label_encoder.pkl"

def train_model():
    df = pd.read_csv(DATA_PATH)

    X = df.drop(columns=["student_id", "final_score", "grade_band"])
    y = df["grade_band"]

    label_encoder = LabelEncoder()
    y_encoded = label_encoder.fit_transform(y)

    numeric_features = [
        "attendance_pct", "study_hours_wk", "quiz_avg",
        "assignment_score", "midterm_score", "lms_logins_wk",
        "forum_posts", "previous_gpa", "sleep_hours"
    ]

    categorical_features = [
        "gender", "internet_access", "parent_education"
    ]

    numeric_pipeline = Pipeline([
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler())
    ])

    categorical_pipeline = Pipeline([
        ("imputer", SimpleImputer(strategy="most_frequent")),
        ("encoder", OneHotEncoder(handle_unknown="ignore"))
    ])

    preprocessor = ColumnTransformer([
        ("num", numeric_pipeline, numeric_features),
        ("cat", categorical_pipeline, categorical_features)
    ])

    model = XGBClassifier(
        n_estimators=250,
        max_depth=5,
        learning_rate=0.08,
        random_state=42,
        eval_metric="mlogloss"
    )

    pipeline = Pipeline([
        ("preprocessor", preprocessor),
        ("model", model)
    ])

    X_train, X_test, y_train, y_test = train_test_split(
        X, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded
    )

    pipeline.fit(X_train, y_train)

    y_pred = pipeline.predict(X_test)

    accuracy = accuracy_score(y_test, y_pred)
    report = classification_report(
        y_test,
        y_pred,
        target_names=label_encoder.classes_
    )

    cm = confusion_matrix(y_test, y_pred)

    os.makedirs("models", exist_ok=True)
    os.makedirs("outputs", exist_ok=True)

    joblib.dump(pipeline, MODEL_PATH)
    joblib.dump(label_encoder, ENCODER_PATH)

    with open("outputs/model_report.txt", "w") as f:
        f.write(f"Accuracy: {accuracy:.4f}\n\n")
        f.write(report)
        f.write("\nConfusion Matrix:\n")
        f.write(str(cm))

    print("Model trained successfully!")
    print(f"Accuracy: {accuracy:.4f}")
    print(report)
    print("Model saved in models/")

if __name__ == "__main__":
    train_model()
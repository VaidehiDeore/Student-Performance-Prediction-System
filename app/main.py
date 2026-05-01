from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
import joblib
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Student Performance Prediction API",
    description="Predicts student grade band and academic risk level.",
    version="1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = joblib.load("models/student_performance_model.pkl")
label_encoder = joblib.load("models/label_encoder.pkl")

class StudentInput(BaseModel):
    gender: str
    attendance_pct: float
    study_hours_wk: float
    quiz_avg: float
    assignment_score: float
    midterm_score: float
    lms_logins_wk: float
    forum_posts: float
    previous_gpa: float
    sleep_hours: float
    internet_access: str
    parent_education: str

@app.get("/")
def home():
    return {"message": "Student Performance Prediction API is running"}

@app.post("/predict")
def predict_student(student: StudentInput):
    data = pd.DataFrame([student.dict()])

    pred_encoded = model.predict(data)[0]
    grade = label_encoder.inverse_transform([pred_encoded])[0]

    probabilities = model.predict_proba(data)[0]
    confidence = round(float(max(probabilities) * 100), 2)

    if grade in ["A", "B"]:
        risk_level = "Low Risk"
        alert = "Student is on track."
        intervention = "Maintain current learning plan."
    elif grade == "C":
        risk_level = "Medium Risk"
        alert = "Student needs academic monitoring."
        intervention = "Improve quiz practice, assignment consistency, and weekly study hours."
    else:
        risk_level = "High Risk"
        alert = "Student is academically at risk."
        intervention = "Immediate support required: attendance plan, mentoring, and extra practice sessions."

    return {
        "predicted_grade": grade,
        "confidence": confidence,
        "risk_level": risk_level,
        "alert": alert,
        "intervention": intervention
    }
import pandas as pd
import joblib

MODEL_PATH = "models/student_performance_model.pkl"
ENCODER_PATH = "models/label_encoder.pkl"

model = joblib.load(MODEL_PATH)
label_encoder = joblib.load(ENCODER_PATH)

def predict_student(data):
    df = pd.DataFrame([data])

    prediction_encoded = model.predict(df)[0]
    prediction = label_encoder.inverse_transform([prediction_encoded])[0]

    probabilities = model.predict_proba(df)[0]
    confidence = max(probabilities) * 100

    if prediction in ["A", "B"]:
        risk = "Low Risk"
        suggestion = "Student is performing well. Maintain current study habits."
    elif prediction == "C":
        risk = "Medium Risk"
        suggestion = "Student should improve quiz scores and consistency."
    else:
        risk = "High Risk"
        suggestion = "Immediate intervention needed: attendance, assignments, and study hours should improve."

    return {
        "predicted_grade": prediction,
        "confidence": round(confidence, 2),
        "risk_level": risk,
        "suggestion": suggestion
    }

if __name__ == "__main__":
    sample_student = {
        "gender": "Female",
        "attendance_pct": 78,
        "study_hours_wk": 8,
        "quiz_avg": 65,
        "assignment_score": 70,
        "midterm_score": 62,
        "lms_logins_wk": 8,
        "forum_posts": 3,
        "previous_gpa": 7.2,
        "sleep_hours": 6.5,
        "internet_access": "Yes",
        "parent_education": "Graduate"
    }

    result = predict_student(sample_student)
    print(result)
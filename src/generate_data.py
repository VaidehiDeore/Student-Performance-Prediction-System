import numpy as np
import pandas as pd
import os

np.random.seed(42)

def generate_student_data(n=1200):
    data = []

    for i in range(1, n + 1):
        attendance = np.random.randint(45, 101)
        study_hours = np.random.randint(1, 21)
        quiz_avg = np.random.randint(25, 101)
        assignment_score = np.random.randint(30, 101)
        midterm_score = np.random.randint(20, 101)
        lms_logins = np.random.randint(0, 25)
        forum_posts = np.random.randint(0, 15)
        previous_gpa = round(np.random.uniform(4.0, 10.0), 2)
        sleep_hours = round(np.random.uniform(4.0, 9.0), 1)

        gender = np.random.choice(["Male", "Female"])
        internet_access = np.random.choice(["Yes", "No"], p=[0.85, 0.15])
        parent_education = np.random.choice(["High School", "Graduate", "Post Graduate"])

        final_score = (
            attendance * 0.18 +
            study_hours * 1.8 +
            quiz_avg * 0.20 +
            assignment_score * 0.18 +
            midterm_score * 0.22 +
            lms_logins * 0.5 +
            forum_posts * 0.4 +
            previous_gpa * 2.5 +
            sleep_hours * 1.2
        )

        if internet_access == "No":
            final_score -= 5

        final_score += np.random.normal(0, 5)
        final_score = max(0, min(100, final_score))

        if final_score >= 85:
            grade = "A"
        elif final_score >= 70:
            grade = "B"
        elif final_score >= 55:
            grade = "C"
        elif final_score >= 40:
            grade = "D"
        else:
            grade = "F"

        data.append([
            i, gender, attendance, study_hours, quiz_avg,
            assignment_score, midterm_score, lms_logins,
            forum_posts, previous_gpa, sleep_hours,
            internet_access, parent_education,
            round(final_score, 2), grade
        ])

    columns = [
        "student_id", "gender", "attendance_pct", "study_hours_wk",
        "quiz_avg", "assignment_score", "midterm_score",
        "lms_logins_wk", "forum_posts", "previous_gpa",
        "sleep_hours", "internet_access", "parent_education",
        "final_score", "grade_band"
    ]

    return pd.DataFrame(data, columns=columns)

if __name__ == "__main__":
    os.makedirs("data/raw", exist_ok=True)
    df = generate_student_data()
    df.to_csv("data/raw/student_data.csv", index=False)
    print("Dataset generated successfully!")
    print(df.head())
    print("Saved at: data/raw/student_data.csv")
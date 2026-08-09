from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
import pickle
from dataset import training_data

# Data ko alag karo: messages, categories, priorities
messages = [item[0] for item in training_data]
categories = [item[1] for item in training_data]
priorities = [item[2] for item in training_data]

# ===== Category Model Train Karo =====
# Pipeline: pehle text ko numbers mein convert karo (TF-IDF), phir classify karo (Logistic Regression)
category_model = Pipeline([
    ('tfidf', TfidfVectorizer(ngram_range=(1, 2))),
    ('classifier', LogisticRegression(max_iter=1000, class_weight='balanced'))
])
category_model.fit(messages, categories)

# ===== Priority Model Train Karo =====
priority_model = Pipeline([
    ('tfidf', TfidfVectorizer(ngram_range=(1, 2))),
    ('classifier', LogisticRegression(max_iter=1000, class_weight='balanced'))
])
priority_model.fit(messages, priorities)

# ===== Models Ko Save Karo (File Mein) =====
with open('category_model.pkl', 'wb') as f:
    pickle.dump(category_model, f)

with open('priority_model.pkl', 'wb') as f:
    pickle.dump(priority_model, f)

print("Training complete! Models saved as category_model.pkl and priority_model.pkl")

# Quick test
test_messages = [
    "meri maa ko chot lagi hai",
    "we need food urgently",
    "paani ghar mein aa gaya hai"
]
for msg in test_messages:
    cat = category_model.predict([msg])[0]
    pri = priority_model.predict([msg])[0]
    print(f"'{msg}' -> Category: {cat}, Priority: {pri}")
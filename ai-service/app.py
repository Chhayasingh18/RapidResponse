from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle

app = Flask(__name__)
CORS(app)

with open('category_model.pkl', 'rb') as f:
    category_model = pickle.load(f)

with open('priority_model.pkl', 'rb') as f:
    priority_model = pickle.load(f)


@app.route('/classify', methods=['POST'])
def classify():
    data = request.get_json()
    description = data.get('description', '')

    if not description:
        return jsonify({'error': 'Description is required'}), 400

    category = category_model.predict([description])[0]
    priority = priority_model.predict([description])[0]

    return jsonify({
        'category': category,
        'priority': priority
    })


@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'AI service is running'})


if __name__ == '__main__':
    app.run(port=5000, debug=True)
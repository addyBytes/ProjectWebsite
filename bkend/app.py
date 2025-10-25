from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import tensorflow as tf
from tensorflow import keras
import pandas as pd
import os
import random

app = Flask(__name__)
CORS(app)  # Allow React to connect

# Load your model
MODEL_PATH = 'model/model.h5'
model = keras.models.load_model(MODEL_PATH)

# Load test dataset
TEST_DATA_PATH = 'datasets/test/'

def preprocess_data(data):
    """Add your preprocessing logic here"""
    # Example: normalize, scale, reshape as per your model's input requirements
    return data

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'Model loaded successfully'})

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        # Get data from request
        data = request.json.get('data')
        
        # Preprocess
        processed_data = preprocess_data(np.array(data))
        
        # Make prediction
        prediction = model.predict(processed_data)
        
        # Convert to response format
        attack_confidence = float(prediction[0][1] * 100)
        benign_confidence = float(prediction[0][0] * 100)
        predicted_class = 'Attack' if attack_confidence > 50 else 'Benign'
        
        return jsonify({
            'prediction': {
                'class': predicted_class,
                'attack_confidence': round(attack_confidence, 2),
                'benign_confidence': round(benign_confidence, 2)
            }
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/predict-random', methods=['GET'])
def predict_random():
    """Predict on a random sample from test dataset"""
    try:
        # Load random sample from test data
        test_files = os.listdir(TEST_DATA_PATH)
        random_file = random.choice(test_files)
        
        # Load and preprocess
        data = pd.read_csv(os.path.join(TEST_DATA_PATH, random_file))
        sample = data.sample(n=1)
        
        # Extract true label (adjust column name as per your dataset)
        true_label = sample['label'].values[0]  # 0 for Benign, 1 for Attack
        
        # Remove label for prediction
        features = sample.drop('label', axis=1).values
        processed = preprocess_data(features)
        
        # Predict
        prediction = model.predict(processed)
        
        attack_confidence = float(prediction[0][1] * 100)
        benign_confidence = float(prediction[0][0] * 100)
        predicted_class = 'Attack' if attack_confidence > 50 else 'Benign'
        true_class = 'Attack' if true_label == 1 else 'Benign'
        
        return jsonify({
            'true_label': {'class': true_class},
            'prediction': {
                'class': predicted_class,
                'attack_confidence': round(attack_confidence, 2),
                'benign_confidence': round(benign_confidence, 2)
            }
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/performance', methods=['GET'])
def get_performance():
    """Return model performance metrics"""
    # You can calculate these from your test set or load pre-computed metrics
    return jsonify({
        'attack_detection_rate': 99.87,
        'benign_detection_rate': 99.96,
        'balanced_accuracy': 99.91,
        'f1_score': 99.92,
        'precision': 99.95,
        'recall': 99.88,
        'confusion_matrix': [[15894, 6], [2, 1284]]
    })

@app.route('/api/comparison', methods=['GET'])
def get_comparison():
    """Return comparison data"""
    return jsonify({
        'base_paper': {
            'claimed_accuracy': 98.2,
            'issues': [
                'Overfitting on specific attack types',
                'High false positive rate',
                'Not tested on recent threats'
            ]
        },
        'our_model': {
            'balanced_accuracy': 99.91,
            'advantages': [
                'Superior balanced accuracy',
                'Lower false positives',
                'Generalizes well to new threats',
                'Efficient architecture'
            ]
        }
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
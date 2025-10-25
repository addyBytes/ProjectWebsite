import React, { useState } from 'react';
import axios from 'axios';

const ModelWorkingPage = () => {
  const [result, setResult] = useState(null);

  const handleRunModel = async () => {
    // Calls backend API to run model on random sample
    const response = await axios.get('http://localhost:5000/api/run-detection');
    setResult(response.data);
  };

  return (
    <div>
      <h2>Model Working & Output</h2>
      <button onClick={handleRunModel}>Run Model on Random Sample</button>
      {result &&
        <div>
          <p>True Label: {result.true_label.class}</p>
          <p>Model Prediction: {result.prediction.class}</p>
          <p>Confidence (Attack): {result.prediction.attack_confidence}%</p>
          <p>Confidence (Benign): {result.prediction.benign_confidence}%</p>
        </div>
      }
    </div>
  );
};

export default ModelWorkingPage;

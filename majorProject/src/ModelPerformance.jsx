import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ModelPerformancePage = () => {
  const [performance, setPerformance] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/performance')
      .then(res => setPerformance(res.data));
  }, []);

  return (
    <div>
      <h2>Model Performance</h2>
      {performance ?
        <ul>
          <li>Attack Detection Rate: {performance.attack_detection_rate}%</li>
          <li>Benign Detection Rate: {performance.benign_detection_rate}%</li>
          <li>Balanced Accuracy: {performance.balanced_accuracy}%</li>
          <li>F1-Score: {performance.f1_score}%</li>
          {/* Render confusion matrix, precision, recall, etc. */}
        </ul>
        : <p>Loading performance data...</p>}
    </div>
  );
};

export default ModelPerformancePage;

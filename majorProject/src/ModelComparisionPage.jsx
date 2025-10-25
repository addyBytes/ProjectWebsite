import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ModelComparisonPage = () => {
  const [comparison, setComparison] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/comparison')
      .then(res => setComparison(res.data));
  }, []);

  return (
    <div>
      <h2>Model Comparison</h2>
      {comparison ?
        <div>
          <h3>Base Paper Model</h3>
          <ul>
            <li>Accuracy: {comparison.base_paper.claimed_accuracy}%</li>
            <li>Issues: {comparison.base_paper.issues.join(', ')}</li>
          </ul>
          <h3>Our CNN-LSTM Model</h3>
          <ul>
            <li>Balanced Accuracy: {comparison.our_model.balanced_accuracy}%</li>
            <li>Advantages: {comparison.our_model.advantages.join(', ')}</li>
          </ul>
        </div>
        : <p>Loading comparison data...</p>
      }
    </div>
  );
};

export default ModelComparisonPage;

import React, { useState, useEffect } from 'react';

// --- Mock API Data ---
// In a real application, this data would come from your backend.
const mockPerformanceData = {
  attack_detection_rate: 99.87,
  benign_detection_rate: 99.96,
  balanced_accuracy: 99.91,
  f1_score: 99.92,
  precision: 99.95,
  recall: 99.88,
  confusion_matrix: [
    [15894, 6], // True Benign, False Attack
    [2, 1284]   // False Benign, True Attack
  ]
};

const mockComparisonData = {
  base_paper: {
    claimed_accuracy: 98.2,
    issues: ["Overfitting on specific attack types", "High false positive rate", "Not tested on recent threats"]
  },
  our_model: {
    balanced_accuracy: 99.91,
    advantages: ["Superior balanced accuracy", "Lower false positives", "Generalizes well to new threats", "Efficient architecture"]
  }
};

const mockDetectionSamples = [
    { 
        true_label: { class: 'Attack' },
        prediction: { class: 'Attack', attack_confidence: 99.98, benign_confidence: 0.02 }
    },
    { 
        true_label: { class: 'Benign' },
        prediction: { class: 'Benign', attack_confidence: 0.01, benign_confidence: 99.99 }
    },
    { 
        true_label: { class: 'Attack' },
        prediction: { class: 'Benign', attack_confidence: 45.12, benign_confidence: 54.88 }
    },
     { 
        true_label: { class: 'Benign' },
        prediction: { class: 'Attack', attack_confidence: 88.76, benign_confidence: 11.24 }
    }
];

// --- CSS Styles Component ---
// This component injects all the necessary CSS into the document.
const AppStyles = () => (
  <style>{`
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      margin: 0;
      padding: 2rem;
      background-color: #fff;
      color: #333;
    }

    .container {
      max-width: 960px;
      margin: 0 auto;
    }
    
    /* Header & Navigation */
    .app-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 1rem;
      margin-bottom: 2rem;
      border-bottom: 1px solid #eee;
    }
    
    .logo {
      font-weight: bold;
      font-size: 1.2rem;
    }

    .app-nav button {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1rem;
      margin-left: 1.5rem;
      color: #007bff;
      padding-bottom: 5px;
      border-bottom: 2px solid transparent;
    }
    
    .app-nav button:hover {
        color: #0056b3;
    }

    .app-nav button.active {
      color: #000;
      font-weight: bold;
      border-bottom: 2px solid #000;
    }
    
    /* Typography */
    h1, h2, h3 {
      color: #000;
    }
    
    h1 {
      font-size: 2.2rem;
      margin-bottom: 1rem;
    }

    h2 {
      font-size: 1.8rem;
      margin-top: 2rem;
      margin-bottom: 1rem;
    }

    h3 {
      font-size: 1.4rem;
      margin-top: 1.5rem;
      margin-bottom: 0.5rem;
    }

    p {
      line-height: 1.6;
      margin-bottom: 1rem;
    }
    
    ul {
        padding-left: 20px;
        line-height: 1.6;
    }

    /* Model Working Page */
    .model-working-page button {
      padding: 10px 15px;
      font-size: 1rem;
      cursor: pointer;
      margin-bottom: 1rem;
      border: 1px solid #ccc;
      background-color: #f7f7f7;
    }
    
    .model-working-page button:disabled {
        cursor: not-allowed;
        background-color: #eee;
        color: #999;
    }

    .result-display {
      border: 1px solid #eee;
      padding: 1rem;
      margin-top: 1rem;
      background-color: #fcfcfc;
    }
    
    .result-display p {
        margin-bottom: 0.5rem;
    }

    /* Confusion Matrix Table */
    .confusion-matrix {
      margin-top: 1rem;
      border-collapse: collapse;
      width: 100%;
      max-width: 400px;
    }
    .confusion-matrix th, .confusion-matrix td {
      border: 1px solid #ccc;
      padding: 8px;
      text-align: center;
    }
    .confusion-matrix th {
      background-color: #f2f2f2;
    }
    
    /* Footer */
    .app-footer {
        margin-top: 3rem;
        padding-top: 1rem;
        border-top: 1px solid #eee;
        font-size: 0.9rem;
        color: #777;
    }
  `}</style>
);

// --- Page Components ---

const HomePage = () => {
  return (
    <div>
      <h1>CNN-LSTM IoMT Cybersecurity Project</h1>
      <p>
        An interactive dashboard to demonstrate, evaluate, and compare our deep learning model for threat detection in the Internet of Medical Things.
      </p>
      
      <h2>Model Working & Output</h2>
      <p>Run the model on a random data sample and see the real-time detection results.</p>
      
      <h2>Model Performance</h2>
      <p>View detailed performance metrics, including accuracy, F1-score, and the confusion matrix.</p>
      
      <h2>Model Comparison</h2>
      <p>Compare our CNN-LSTM model's performance against the claims of the base research paper.</p>
    </div>
  );
};

const ModelWorkingPage = () => {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRunModel = () => {
    setIsLoading(true);
    setResult(null);
    setTimeout(() => {
      const randomSample = mockDetectionSamples[Math.floor(Math.random() * mockDetectionSamples.length)];
      setResult(randomSample);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="model-working-page">
      <h1>Model Working & Output</h1>
      <button onClick={handleRunModel} disabled={isLoading}>
        {isLoading ? 'Running Model...' : 'Run Model on Random Sample'}
      </button>
      
      {isLoading && <p>Loading performance data...</p>}

      {result && (
        <div className="result-display">
          <h3>Detection Result</h3>
          <p><strong>True Label:</strong> {result.true_label.class}</p>
          <p><strong>Model Prediction:</strong> {result.prediction.class}</p>
          <p><strong>Result:</strong> {result.true_label.class === result.prediction.class ? 'Correct Prediction' : 'Incorrect Prediction'}</p>
          <p><strong>Confidence (Attack):</strong> {result.prediction.attack_confidence}%</p>
          <p><strong>Confidence (Benign):</strong> {result.prediction.benign_confidence}%</p>
        </div>
      )}
    </div>
  );
};

const ModelPerformancePage = () => {
  const [performance, setPerformance] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setPerformance(mockPerformanceData);
    }, 1000);
  }, []);
  
  if (!performance) return <p>Loading performance data...</p>;

  return (
    <div>
      <h1>Model Performance</h1>
      <ul>
        <li>Attack Detection Rate: {performance.attack_detection_rate}%</li>
        <li>Benign Detection Rate: {performance.benign_detection_rate}%</li>
        <li>Balanced Accuracy: {performance.balanced_accuracy}%</li>
        <li>F1-Score: {performance.f1_score}%</li>
      </ul>

      <h2>Confusion Matrix</h2>
      <table className="confusion-matrix">
        <thead>
          <tr>
            <th colSpan="2" rowSpan="2"></th>
            <th colSpan="2">True</th>
          </tr>
          <tr>
            <th>Benign</th>
            <th>Attack</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th rowSpan="2">Predicted</th>
            <th>Benign</th>
            <td>{performance.confusion_matrix[0][0]}</td>
            <td>{performance.confusion_matrix[1][0]}</td>
          </tr>
          <tr>
            <th>Attack</th>
            <td>{performance.confusion_matrix[0][1]}</td>
            <td>{performance.confusion_matrix[1][1]}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const ModelComparisonPage = () => {
  const [comparison, setComparison] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setComparison(mockComparisonData);
    }, 1000);
  }, []);

  if (!comparison) return <p>Loading comparison data...</p>;
  
  return (
    <div>
      <h1>Model Comparison</h1>
      <div>
        <h3>Base Paper Model</h3>
        <ul>
          <li>Claimed Accuracy: {comparison.base_paper.claimed_accuracy}%</li>
          <li>Issues: {comparison.base_paper.issues.join(', ')}</li>
        </ul>
      </div>
      <div>
        <h3>Our CNN-LSTM Model</h3>
        <ul>
          <li>Balanced Accuracy: {comparison.our_model.balanced_accuracy}%</li>
          <li>Advantages: {comparison.our_model.advantages.join(', ')}</li>
        </ul>
      </div>
    </div>
  );
};


// --- Main App Component ---
function App() {
  const [page, setPage] = useState('home');

  const NavItem = ({ pageName, children }) => (
    <button 
      onClick={() => setPage(pageName)}
      className={page === pageName ? 'active' : ''}
    >
      {children}
    </button>
  );

  const renderPage = () => {
    switch (page) {
      case 'working': return <ModelWorkingPage />;
      case 'performance': return <ModelPerformancePage />;
      case 'comparison': return <ModelComparisonPage />;
      case 'home':
      default: return <HomePage />;
    }
  };

  return (
    <>
      <AppStyles />
      <div className="container">
        <header className="app-header">
          <div className="logo">IoMT Security</div>
          <nav className="app-nav">
            <NavItem pageName="home">Home</NavItem>
            <NavItem pageName="working">Working</NavItem>
            <NavItem pageName="performance">Performance</NavItem>
            <NavItem pageName="comparison">Comparison</NavItem>
          </nav>
        </header>
        <main>
          {renderPage()}
        </main>
        <footer className="app-footer">
          <p>CNN-LSTM Cybersecurity Dashboard | Built for demonstration purposes.</p>
        </footer>
      </div>
    </>
  );
}

export default App;


import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Mock API Data
const mockPerformanceData = {
  attack_detection_rate: 99.87,
  benign_detection_rate: 99.96,
  balanced_accuracy: 99.91,
  f1_score: 99.92,
  precision: 99.95,
  recall: 99.88,
  confusion_matrix: [
    [15894, 6],
    [2, 1284]
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

const performanceHistory = [
  { epoch: 1, accuracy: 85.2, loss: 0.42 },
  { epoch: 5, accuracy: 92.1, loss: 0.28 },
  { epoch: 10, accuracy: 96.5, loss: 0.15 },
  { epoch: 15, accuracy: 98.8, loss: 0.08 },
  { epoch: 20, accuracy: 99.5, loss: 0.04 },
  { epoch: 25, accuracy: 99.91, loss: 0.02 }
];

const comparisonChartData = [
  { metric: 'Accuracy', 'Base Paper': 98.2, 'Our Model': 99.91 },
  { metric: 'Precision', 'Base Paper': 97.8, 'Our Model': 99.95 },
  { metric: 'Recall', 'Base Paper': 96.5, 'Our Model': 99.88 },
  { metric: 'F1-Score', 'Base Paper': 97.1, 'Our Model': 99.92 }
];

const COLORS = ['#10b981', '#ef4444', '#f59e0b', '#3b82f6'];

// SVG Icons Components
const ShieldIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
);

const ActivityIcon = ({ size = 24, color = "currentColor", className = "" }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
  </svg>
);

const ZapIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
  </svg>
);

const BarChartIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="20" x2="12" y2="10"></line>
    <line x1="18" y1="20" x2="18" y2="4"></line>
    <line x1="6" y1="20" x2="6" y2="16"></line>
  </svg>
);

const GitCompareIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="18" r="3"></circle>
    <circle cx="6" cy="6" r="3"></circle>
    <path d="M13 6h3a2 2 0 0 1 2 2v7"></path>
    <line x1="6" y1="9" x2="6" y2="21"></line>
  </svg>
);

const CheckCircleIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const XCircleIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="15" y1="9" x2="9" y2="15"></line>
    <line x1="9" y1="9" x2="15" y2="15"></line>
  </svg>
);

const AlertTriangleIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
    <line x1="12" y1="9" x2="12" y2="13"></line>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);

// Styles Component
const AppStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(90deg, #111c50ff 0%, #219ed7ff 50%, #3c7edaff 100%);
      color: #1f2937;
      min-height: 100vh;
      overflow-x: hidden;
    }
    
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes slideInLeft {
      from {
        opacity: 0;
        transform: translateX(-50px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
    
    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.7;
      }
    }
    
    @keyframes gradient {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    
    @keyframes shimmer {
      0% { background-position: -1000px 0; }
      100% { background-position: 1000px 0; }
    }
    
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    
    .animate-spin {
      animation: spin 1s linear infinite;
    }
    
    .app-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
    }
    
    .glass-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 24px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.3);
      animation: fadeInUp 0.6s ease-out;
    }
    
    .header {
      padding: 2rem 3rem;
      margin-bottom: 2rem;
    }
    
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .logo-section {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .logo-icon {
      width: 50px;
      height: 50px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      animation: pulse 2s ease-in-out infinite;
    }
    
    .logo-text {
      font-size: 1.75rem;
      font-weight: 800;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .nav-buttons {
      display: flex;
      gap: 0.5rem;
    }
    
    .nav-btn {
      padding: 0.75rem 1.5rem;
      border: none;
      background: transparent;
      color: #6b7280;
      font-weight: 600;
      font-size: 0.95rem;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }
    
    .nav-btn::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      opacity: 0;
      transition: opacity 0.3s ease;
      z-index: -1;
    }
    
    .nav-btn:hover {
      color: #667eea;
      transform: translateY(-2px);
    }
    
    .nav-btn.active {
      color: white;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    .nav-btn.active::before {
      opacity: 1;
    }
    
    .main-content {
      padding: 3rem;
      animation: fadeInUp 0.8s ease-out;
    }
    
    .hero-section {
      text-align: center;
      padding: 4rem 2rem;
    }
    
    .hero-title {
      font-size: 3.5rem;
      font-weight: 800;
      margin-bottom: 1.5rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
      background-size: 200% 200%;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: gradient 3s ease infinite;
    }
    
    .hero-subtitle {
      font-size: 1.25rem;
      color: #6b7280;
      max-width: 700px;
      margin: 0 auto 3rem;
      line-height: 1.8;
    }
    
    .feature-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin-top: 3rem;
    }
    
    .feature-card {
      background: white;
      padding: 2.5rem;
      border-radius: 20px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      border: 2px solid transparent;
      cursor: pointer;
      animation: fadeInUp 0.6s ease-out;
      animation-fill-mode: both;
    }
    
    .feature-card:nth-child(1) { animation-delay: 0.1s; }
    .feature-card:nth-child(2) { animation-delay: 0.2s; }
    .feature-card:nth-child(3) { animation-delay: 0.3s; }
    
    .feature-card:hover {
      transform: translateY(-10px);
      box-shadow: 0 20px 60px rgba(102, 126, 234, 0.3);
      border-color: #667eea;
    }
    
    .feature-icon {
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      margin-bottom: 1.5rem;
    }
    
    .feature-title {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 1rem;
      color: #1f2937;
    }
    
    .feature-description {
      color: #6b7280;
      line-height: 1.7;
    }
    
    .action-btn {
      padding: 1rem 2.5rem;
      border: none;
      border-radius: 14px;
      font-weight: 700;
      font-size: 1.1rem;
      cursor: pointer;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
      transition: all 0.3s ease;
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      margin-top: 1rem;
    }
    
    .action-btn:hover {
      transform: translateY(-3px);
      box-shadow: 0 15px 40px rgba(102, 126, 234, 0.5);
    }
    
    .action-btn:active {
      transform: translateY(-1px);
    }
    
    .action-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }
    
    .result-card {
      background: white;
      padding: 2.5rem;
      border-radius: 20px;
      margin-top: 2rem;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
      animation: fadeInUp 0.5s ease-out;
      border-left: 6px solid #667eea;
    }
    
    .result-card.correct {
      border-left-color: #10b981;
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, white 100%);
    }
    
    .result-card.incorrect {
      border-left-color: #ef4444;
      background: linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, white 100%);
    }
    
    .result-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2rem;
    }
    
    .result-title {
      font-size: 1.75rem;
      font-weight: 700;
      color: #1f2937;
    }
    
    .result-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
    }
    
    .result-item {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .result-label {
      font-size: 0.875rem;
      color: #6b7280;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .result-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1f2937;
    }
    
    .confidence-bars {
      margin-top: 2rem;
    }
    
    .confidence-item {
      margin-bottom: 1.5rem;
    }
    
    .confidence-label {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
      font-weight: 600;
    }
    
    .confidence-bar {
      height: 12px;
      background: #e5e7eb;
      border-radius: 8px;
      overflow: hidden;
      position: relative;
    }
    
    .confidence-fill {
      height: 100%;
      background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
      border-radius: 8px;
      transition: width 1s ease-out;
      position: relative;
      overflow: hidden;
    }
    
    .confidence-fill::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
      animation: shimmer 2s infinite;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }
    
    .stat-card {
      background: white;
      padding: 2rem;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
      transition: all 0.3s ease;
      animation: fadeInUp 0.5s ease-out;
      animation-fill-mode: both;
    }
    
    .stat-card:nth-child(1) { animation-delay: 0.1s; }
    .stat-card:nth-child(2) { animation-delay: 0.2s; }
    .stat-card:nth-child(3) { animation-delay: 0.3s; }
    .stat-card:nth-child(4) { animation-delay: 0.4s; }
    
    .stat-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
    }
    
    .stat-label {
      font-size: 0.875rem;
      color: #6b7280;
      font-weight: 600;
      margin-bottom: 0.5rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .stat-value {
      font-size: 2.5rem;
      font-weight: 800;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .chart-container {
      background: white;
      padding: 2.5rem;
      border-radius: 20px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
      margin-bottom: 2rem;
      animation: fadeInUp 0.6s ease-out;
    }
    
    .chart-title {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 2rem;
      color: #1f2937;
    }
    
    .matrix-container {
      background: white;
      padding: 2.5rem;
      border-radius: 20px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
      margin-top: 2rem;
    }
    
    .confusion-matrix {
      width: 100%;
      max-width: 600px;
      margin: 2rem auto;
      border-collapse: separate;
      border-spacing: 0;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }
    
    .confusion-matrix th,
    .confusion-matrix td {
      padding: 1.5rem;
      text-align: center;
      font-weight: 600;
    }
    
    .confusion-matrix th {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      font-size: 1rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .confusion-matrix td {
      font-size: 1.5rem;
      background: white;
      border: 2px solid #f3f4f6;
    }
    
    .matrix-tn { background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%) !important; color: #065f46; }
    .matrix-fp { background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%) !important; color: #991b1b; }
    .matrix-fn { background: linear-gradient(135deg, #fed7aa 0%, #fdba74 100%) !important; color: #92400e; }
    .matrix-tp { background: linear-gradient(135deg, #bfdbfe 0%, #93c5fd 100%) !important; color: #1e40af; }
    
    .comparison-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 2rem;
      margin-top: 2rem;
    }
    
    .comparison-card {
      background: white;
      padding: 2.5rem;
      border-radius: 20px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
      animation: slideInLeft 0.6s ease-out;
    }
    
    .comparison-card:nth-child(2) {
      animation-delay: 0.2s;
    }
    
    .comparison-title {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
      color: #1f2937;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    
    .comparison-list {
      list-style: none;
      padding: 0;
    }
    
    .comparison-list li {
      padding: 1rem;
      margin-bottom: 0.75rem;
      background: #f9fafb;
      border-radius: 12px;
      border-left: 4px solid #667eea;
      color: #374151;
      line-height: 1.6;
      transition: all 0.3s ease;
    }
    
    .comparison-list li:hover {
      background: #f3f4f6;
      transform: translateX(5px);
    }
    
    .loading-spinner {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 4rem;
      color: #667eea;
      font-size: 1.25rem;
      font-weight: 600;
    }
    
    @media (max-width: 768px) {
      .app-container {
        padding: 1rem;
      }
      
      .header {
        padding: 1.5rem;
      }
      
      .header-content {
        flex-direction: column;
        gap: 1.5rem;
      }
      
      .nav-buttons {
        flex-wrap: wrap;
        justify-content: center;
      }
      
      .hero-title {
        font-size: 2.5rem;
      }
      
      .feature-grid,
      .comparison-grid {
        grid-template-columns: 1fr;
      }
      
      .main-content {
        padding: 2rem 1.5rem;
      }
    }
  `}</style>
);

// Home Page Component
const HomePage = ({ onNavigate }) => {
  return (
    <div className="hero-section">
      <h1 className="hero-title">CNN-LSTM IoMT Cybersecurity</h1>
      <p className="hero-subtitle">
        Advanced deep learning architecture for real-time threat detection in Internet of Medical Things networks.
        Achieving 97.52% balanced accuracy with cutting-edge LSTM-based anomaly detection.
      </p>
      
      <div className="feature-grid">
        <div className="feature-card" onClick={() => onNavigate('working')}>
          <div className="feature-icon">
            <ZapIcon size={28} />
          </div>
          <h3 className="feature-title">Live Detection</h3>
          <p className="feature-description">
            Run the model on real-time data samples and witness instant threat classification with confidence scores.
          </p>
        </div>
        
        <div className="feature-card" onClick={() => onNavigate('performance')}>
          <div className="feature-icon">
            <BarChartIcon size={28} />
          </div>
          <h3 className="feature-title">Performance Metrics</h3>
          <p className="feature-description">
            Explore comprehensive performance analytics including accuracy, precision, recall, and confusion matrices.
          </p>
        </div>
        
        <div className="feature-card" onClick={() => onNavigate('comparison')}>
          <div className="feature-icon">
            <GitCompareIcon size={28} />
          </div>
          <h3 className="feature-title">Model Comparison</h3>
          <p className="feature-description">
            Compare our CNN-LSTM architecture against baseline models and existing research benchmarks.
          </p>
        </div>
      </div>
    </div>
  );
};

// Model Working Page Component
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
    }, 2000);
  };

  const isCorrect = result && result.true_label.class === result.prediction.class;

  return (
    <div>
      <h1 className="hero-title" style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Live Model Detection</h1>
      <p className="hero-subtitle" style={{ marginBottom: '2rem' }}>
        Run the CNN-LSTM model on random samples from the test dataset to see real-time threat detection in action.
      </p>
      
      <button className="action-btn" onClick={handleRunModel} disabled={isLoading}>
        {isLoading ? (
          <>
            <ActivityIcon className="animate-spin" size={20} />
            Processing...
          </>
        ) : (
          <>
            <ZapIcon size={20} />
            Run Detection
          </>
        )}
      </button>

      {isLoading && (
        <div className="loading-spinner">
          <ActivityIcon className="animate-spin" size={32} style={{ marginRight: '1rem' }} />
          Analyzing network traffic patterns...
        </div>
      )}

      {result && (
        <div className={`result-card ${isCorrect ? 'correct' : 'incorrect'}`}>
          <div className="result-header">
            {isCorrect ? (
              <CheckCircleIcon size={32} color="#10b981" />
            ) : (
              <XCircleIcon size={32} color="#ef4444" />
            )}
            <h3 className="result-title">
              {isCorrect ? 'Correct Detection' : 'Misclassification'}
            </h3>
          </div>
          
          <div className="result-grid">
            <div className="result-item">
              <span className="result-label">True Label</span>
              <span className="result-value">{result.true_label.class}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Prediction</span>
              <span className="result-value">{result.prediction.class}</span>
            </div>
          </div>
          
          <div className="confidence-bars">
            <div className="confidence-item">
              <div className="confidence-label">
                <span>Attack Confidence</span>
                <span style={{ color: '#ef4444' }}>{result.prediction.attack_confidence}%</span>
              </div>
              <div className="confidence-bar">
                <div 
                  className="confidence-fill" 
                  style={{ 
                    width: `${result.prediction.attack_confidence}%`,
                    background: 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)'
                  }}
                />
              </div>
            </div>
            
            <div className="confidence-item">
              <div className="confidence-label">
                <span>Benign Confidence</span>
                <span style={{ color: '#10b981' }}>{result.prediction.benign_confidence}%</span>
              </div>
              <div className="confidence-bar">
                <div 
                  className="confidence-fill" 
                  style={{ 
                    width: `${result.prediction.benign_confidence}%`,
                    background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Model Performance Page Component
const ModelPerformancePage = () => {
  const [performance, setPerformance] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setPerformance(mockPerformanceData);
    }, 800);
  }, []);

  if (!performance) {
    return (
      <div className="loading-spinner">
        <ActivityIcon className="animate-spin" size={32} style={{ marginRight: '1rem' }} />
        Loading performance metrics...
      </div>
    );
  }

  const pieData = [
    { name: 'True Negative', value: performance.confusion_matrix[0][0] },
    { name: 'False Positive', value: performance.confusion_matrix[0][1] },
    { name: 'False Negative', value: performance.confusion_matrix[1][0] },
    { name: 'True Positive', value: performance.confusion_matrix[1][1] }
  ];

  return (
    <div>
      <h1 className="hero-title" style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Performance Analytics</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Balanced Accuracy</div>
          <div className="stat-value">{performance.balanced_accuracy}%</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">F1-Score</div>
          <div className="stat-value">{performance.f1_score}%</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Precision</div>
          <div className="stat-value">{performance.precision}%</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Recall</div>
          <div className="stat-value">{performance.recall}%</div>
        </div>
      </div>

      <div className="chart-container">
        <h3 className="chart-title">Training Progress</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={performanceHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="epoch" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="accuracy" stroke="#667eea" strokeWidth={3} name="Accuracy %" />
            <Line type="monotone" dataKey="loss" stroke="#ef4444" strokeWidth={3} name="Loss" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="matrix-container">
        <h3 className="chart-title">Confusion Matrix</h3>
        <table className="confusion-matrix">
          <thead>
            <tr>
              <th colSpan="2" rowSpan="2"></th>
              <th colSpan="2">Actual</th>
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
              <td className="matrix-tn">{performance.confusion_matrix[0][0]}</td>
              <td className="matrix-fn">{performance.confusion_matrix[1][0]}</td>
            </tr>
            <tr>
              <th>Attack</th>
              <td className="matrix-fp">{performance.confusion_matrix[0][1]}</td>
              <td className="matrix-tp">{performance.confusion_matrix[1][1]}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="chart-container">
        <h3 className="chart-title">Detection Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(2)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Model Comparison Page Component
const ModelComparisonPage = () => {
  const [comparison, setComparison] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setComparison(mockComparisonData);
    }, 800);
  }, []);

  if (!comparison) {
    return (
      <div className="loading-spinner">
        <ActivityIcon className="animate-spin" size={32} style={{ marginRight: '1rem' }} />
        Loading comparison data...
      </div>
    );
  }

  return (
    <div>
      <h1 className="hero-title" style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Model Comparison</h1>
      
      <div className="chart-container">
        <h3 className="chart-title">Performance Comparison</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={comparisonChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="metric" stroke="#6b7280" />
            <YAxis stroke="#6b7280" domain={[95, 100]} />
            <Tooltip />
            <Legend />
            <Bar dataKey="Base Paper" fill="#94a3b8" radius={[8, 8, 0, 0]} />
            <Bar dataKey="Our Model" fill="#667eea" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="comparison-grid">
        <div className="comparison-card">
          <h3 className="comparison-title">
            <AlertTriangleIcon size={24} color="#f59e0b" />
            Base Paper Model
          </h3>
          <p style={{ marginBottom: '1.5rem', color: '#6b7280' }}>
            <strong>Claimed Accuracy:</strong> {comparison.base_paper.claimed_accuracy}%
          </p>
          <h4 style={{ marginBottom: '1rem', color: '#374151' }}>Identified Issues:</h4>
          <ul className="comparison-list">
            {comparison.base_paper.issues.map((issue, index) => (
              <li key={index}>{issue}</li>
            ))}
          </ul>
        </div>

        <div className="comparison-card">
          <h3 className="comparison-title">
            <ShieldIcon size={24} color="#10b981" />
            Our CNN-LSTM Model
          </h3>
          <p style={{ marginBottom: '1.5rem', color: '#6b7280' }}>
            <strong>Balanced Accuracy:</strong> {comparison.our_model.balanced_accuracy}%
          </p>
          <h4 style={{ marginBottom: '1rem', color: '#374151' }}>Key Advantages:</h4>
          <ul className="comparison-list">
            {comparison.our_model.advantages.map((advantage, index) => (
              <li key={index}>{advantage}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

// Main App Component
function App() {
  const [page, setPage] = useState('home');

  const renderPage = () => {
    switch (page) {
      case 'working':
        return <ModelWorkingPage />;
      case 'performance':
        return <ModelPerformancePage />;
      case 'comparison':
        return <ModelComparisonPage />;
      case 'home':
      default:
        return <HomePage onNavigate={setPage} />;
    }
  };

  return (
    <>
      <AppStyles />
      <div className="app-container">
        <div className="glass-card header">
          <div className="header-content">
            <div className="logo-section">
              <div className="logo-icon">
                <ShieldIcon size={28} />
              </div>
              <div className="logo-text">IoMT Security</div>
            </div>
            <nav className="nav-buttons">
              <button 
                className={`nav-btn ${page === 'home' ? 'active' : ''}`}
                onClick={() => setPage('home')}
              >
                Home
              </button>
              <button 
                className={`nav-btn ${page === 'working' ? 'active' : ''}`}
                onClick={() => setPage('working')}
              >
                Live Detection
              </button>
              <button 
                className={`nav-btn ${page === 'performance' ? 'active' : ''}`}
                onClick={() => setPage('performance')}
              >
                Performance
              </button>
              <button 
                className={`nav-btn ${page === 'comparison' ? 'active' : ''}`}
                onClick={() => setPage('comparison')}
              >
                Comparison
              </button>
            </nav>
          </div>
        </div>
        
        <div className="glass-card main-content">
          {renderPage()}
        </div>
      </div>
    </>
  );
}

export default App;
import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign:"center", paddingTop:"4rem", background:"#eee", height:"100vh" }}>
      <h2>CNN-LSTM IoMT Cybersecurity Project</h2>
      <button onClick={() => navigate('/working')}>Model Working & Output</button>
      <button onClick={() => navigate('/performance')}>Model Performance</button>
      <button onClick={() => navigate('/comparison')}>Model Comparison</button>
    </div>
  );
};

export default HomePage;

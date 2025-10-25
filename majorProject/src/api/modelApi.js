const API_BASE_URL = 'http://localhost:5000/api';

export const modelApi = {
  // Health check
  healthCheck: async () => {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.json();
  },

  // Predict on random sample
  predictRandom: async () => {
    const response = await fetch(`${API_BASE_URL}/predict-random`);
    if (!response.ok) throw new Error('Prediction failed');
    return response.json();
  },

  // Get performance metrics
  getPerformance: async () => {
    const response = await fetch(`${API_BASE_URL}/performance`);
    return response.json();
  },

  // Get comparison data
  getComparison: async () => {
    const response = await fetch(`${API_BASE_URL}/comparison`);
    return response.json();
  },

  // Predict on custom data
  predict: async (data) => {
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data }),
    });
    if (!response.ok) throw new Error('Prediction failed');
    return response.json();
  }
};
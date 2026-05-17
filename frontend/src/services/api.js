import axios from 'axios';

const BASE_URL = 'https://awkward-mundane-gopher.ngrok-free.dev';  // ← coloca o IP do passo 2

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'ngrok-skip-browser-warning': 'true',
  },
});

export const analyzeFood = async (imageFile) => {
  const formData = new FormData();
  formData.append('file', imageFile);

  const response = await api.post('/api/v1/analyze', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export default api;
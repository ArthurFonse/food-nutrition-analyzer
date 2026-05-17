import axios from 'axios';

// URL da API no Render (produção)
const BASE_URL = 'https://food-nutrition-analyzer-6k31.onrender.com';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const analyzeFood = async (imageUri) => {
  try {
    const formData = new FormData();
    formData.append('file', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'food.jpg',
    });

    const response = await api.post('/api/v1/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Erro na API:', error.response?.data || error.message);
    throw error;
  }
};

export default api;
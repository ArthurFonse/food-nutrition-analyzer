import axios from 'axios';

// URL do ngrok - atualize quando reiniciar o ngrok
const BASE_URL = 'https://awkward-mundane-gopher.ngrok-free.dev';

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
    throw error;
  }
};
s
export default api;
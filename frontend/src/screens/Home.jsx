import { useState, useRef } from 'react';
import { analyzeFood } from '../services/api';

export default function Home() {
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImage(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!imageFile) return;
    setLoading(true);
    setError(null);
    try {
      const data = await analyzeFood(imageFile);
      setResult(data);
    } catch (err) {
      setError('Erro ao analisar imagem. Tente novamente!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gray-900 p-4 shadow-lg">
        <h1 className="text-2xl font-bold text-center text-green-400">
          🍽️ Food Analyzer
        </h1>
        <p className="text-center text-gray-400 text-sm">
          Analise seus alimentos com IA
        </p>
      </div>

      <div className="max-w-md mx-auto p-4">
        {/* Botões de foto */}
        <div className="grid grid-cols-2 gap-3 mb-4 mt-4">
          <button
            onClick={() => cameraInputRef.current.click()}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-4 rounded-xl flex flex-col items-center gap-1 transition"
          >
            <span className="text-2xl">📸</span>
            <span>Câmera</span>
          </button>
          <button
            onClick={() => fileInputRef.current.click()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-4 rounded-xl flex flex-col items-center gap-1 transition"
          >
            <span className="text-2xl">🖼️</span>
            <span>Galeria</span>
          </button>
        </div>

        {/* Inputs hidden */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleImageChange}
        />

        {/* Preview da imagem */}
        {image && (
          <div className="mb-4">
            <img
              src={image}
              alt="Food"
              className="w-full h-64 object-cover rounded-xl mb-3"
            />
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Analisando...
                </>
              ) : (
                '🔍 Analisar Alimento'
              )}
            </button>
          </div>
        )}

        {/* Erro */}
        {error && (
          <div className="bg-red-900 border border-red-500 text-red-200 p-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        {/* Resultado */}
        {result && (
          <div className="bg-gray-900 rounded-xl p-4 space-y-4">
            <h2 className="text-xl font-bold text-green-400">📊 Resultado</h2>

            {/* Nome do alimento */}
            {result.food_name && (
              <p className="text-lg font-semibold text-white">
                🍴 {result.food_name}
              </p>
            )}

            {/* Calorias */}
            <div className="bg-orange-500 rounded-xl p-4 text-center">
              <p className="text-4xl font-bold">{result.calories}</p>
              <p className="text-sm opacity-80">kcal</p>
            </div>

            {/* Macros */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-blue-900 rounded-xl p-3 text-center">
                <p className="text-xl font-bold text-blue-300">{result.protein}g</p>
                <p className="text-xs text-gray-400">Proteína</p>
              </div>
              <div className="bg-yellow-900 rounded-xl p-3 text-center">
                <p className="text-xl font-bold text-yellow-300">{result.carbs}g</p>
                <p className="text-xs text-gray-400">Carboidrato</p>
              </div>
              <div className="bg-red-900 rounded-xl p-3 text-center">
                <p className="text-xl font-bold text-red-300">{result.fat}g</p>
                <p className="text-xs text-gray-400">Gordura</p>
              </div>
            </div>

            {/* Peso estimado */}
            {result.weight && (
              <div className="bg-gray-800 rounded-xl p-3 text-center">
                <p className="text-lg font-bold">⚖️ {result.weight}g</p>
                <p className="text-xs text-gray-400">Peso estimado</p>
              </div>
            )}

            {/* Botão novo */}
            <button
              onClick={() => { setImage(null); setResult(null); setImageFile(null); }}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-xl transition"
            >
              🔄 Analisar outro alimento
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
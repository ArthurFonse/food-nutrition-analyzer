import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { analyzeFood } from '../services/api';

export default function HomeScreen() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Precisamos de acesso à galeria!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setResult(null);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Precisamos de acesso à câmera!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setResult(null);
    }
  };

  const analyzeImage = async () => {
    if (!image) {
      Alert.alert('Atenção', 'Selecione uma imagem primeiro!');
      return;
    }

    setLoading(true);
    try {
      const data = await analyzeFood(image);
      setResult(data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível analisar a imagem. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🍽️ Food Analyzer</Text>
      <Text style={styles.subtitle}>Analise seus alimentos com IA</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={takePhoto}>
          <Text style={styles.buttonText}>📸 Câmera</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>🖼️ Galeria</Text>
        </TouchableOpacity>
      </View>

      {image && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: image }} style={styles.image} />
          <TouchableOpacity
            style={styles.analyzeButton}
            onPress={analyzeImage}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.analyzeButtonText}>🔍 Analisar</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {result && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>📊 Resultado</Text>

          <View style={styles.kcalBox}>
            <Text style={styles.kcalText}>{result.calories} kcal</Text>
            <Text style={styles.kcalLabel}>Calorias totais</Text>
          </View>

          <View style={styles.macrosContainer}>
            <View style={styles.macroBox}>
              <Text style={styles.macroValue}>{result.protein}g</Text>
              <Text style={styles.macroLabel}>Proteína</Text>
            </View>
            <View style={styles.macroBox}>
              <Text style={styles.macroValue}>{result.carbs}g</Text>
              <Text style={styles.macroLabel}>Carboidrato</Text>
            </View>
            <View style={styles.macroBox}>
              <Text style={styles.macroValue}>{result.fat}g</Text>
              <Text style={styles.macroLabel}>Gordura</Text>
            </View>
          </View>

          {result.weight && (
            <Text style={styles.weight}>⚖️ Peso estimado: {result.weight}g</Text>
          )}

          {result.food_name && (
            <Text style={styles.foodName}>🍴 {result.food_name}</Text>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 50,
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    marginBottom: 30,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    width: '45%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 15,
    marginBottom: 15,
  },
  analyzeButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  analyzeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  kcalBox: {
    backgroundColor: '#FF5722',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  kcalText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  kcalLabel: {
    color: '#fff',
    fontSize: 14,
  },
  macrosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  macroBox: {
    backgroundColor: '#E3F2FD',
    borderRadius: 10,
    padding: 15,
    width: '30%',
    alignItems: 'center',
  },
  macroValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1565C0',
  },
  macroLabel: {
    fontSize: 12,
    color: '#666',
  },
  weight: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  foodName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});
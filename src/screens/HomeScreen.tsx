import React, { useState, useEffect } from 'react';
import { View, ScrollView, ActivityIndicator, Text, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BannerSlider from '../components/BannerSlider';
import CategoryList from '../components/CategoryList';


const HomeScreen = ({ navigation }) => {
  const [banners, setBanners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          navigation.navigate('Auth', { screen: 'Login' });
          return;
        }

        const response = await axios.get('http://192.168.29.94:5000/api/banners', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });
        
        setBanners(response.data.length ? response.data : []);
      } catch (error) {
        if (error.response?.status === 401) {
          await AsyncStorage.removeItem('token');
          navigation.navigate('Auth', { screen: 'Login' });
        } else {
          setError(error.message || 'Failed to load data');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigation]);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Auth', params: { screen: 'Login' } }],
    });
  };

  const handleCategoryPress = (category) => {
    console.log('Category pressed:', category.name);
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <BannerSlider banners={banners} />
      <CategoryList onCategoryPress={handleCategoryPress} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
  loginText: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  logoutButton: {
    alignSelf: 'flex-end',
    margin: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
});

export default HomeScreen;
import React, { useState, useEffect, useRef } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const AUTO_SLIDE_INTERVAL = 3000; // 3 seconds

const ImageSlider = () => {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout>();

  const fetchSliderImages = async () => {
    try {
      const response = await axios.get('http://192.168.29.94:5000/api/slider-images');
      setImages(response.data.data);
    } catch (error) {
      console.error('Error fetching slider images:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchSliderImages();
      return () => {
        // Clean up on unmount
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }, [])
  );

  useEffect(() => {
    if (images.length > 1 && !isPaused) {
      timerRef.current = setTimeout(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
      }, AUTO_SLIDE_INTERVAL);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentIndex, isPaused, images.length]);

  if (images.length === 0) return null;

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        activeOpacity={1}
        onPressIn={() => setIsPaused(true)}
        onPressOut={() => setIsPaused(false)}
      >
        <Image
          source={{ uri: images[currentIndex].imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      </TouchableOpacity>

      {images.length > 1 && (
        <View style={styles.indicatorContainer}>
          {images.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                index === currentIndex && styles.activeIndicator
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 200,
    marginBottom: 20,
    position: 'relative',
  },
  image: {
    width: width - 40,
    height: 200,
    borderRadius: 10,
    marginHorizontal: 20,
  },
  indicatorContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.4)',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#fff',
    width: 12,
  },
});

export default ImageSlider;
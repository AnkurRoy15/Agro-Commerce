import React, { useRef, useState, useEffect } from 'react';
import { View, Image, Dimensions, Animated, PanResponder, StyleSheet } from 'react-native';


const { width } = Dimensions.get('window');
const BANNER_HEIGHT = 200;
const SLIDE_INTERVAL = 3000;
const SWIPE_THRESHOLD = 50;

const BannerSlider = ({ banners }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef();
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setIsPaused(true);
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (e, gestureState) => {
        setIsPaused(false);
        
        if (Math.abs(gestureState.dx) > SWIPE_THRESHOLD) {
          if (gestureState.dx > 0) {
            goToPrev();
          } else {
            goToNext();
          }
        } else {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false
          }).start();
        }
      }
    })
  ).current;

  const goToNext = () => {
    if (banners.length <= 1) return;
    
    Animated.timing(pan, {
      toValue: { x: -width, y: 0 },
      duration: 300,
      useNativeDriver: false
    }).start(() => {
      pan.setValue({ x: width, y: 0 });
      setCurrentIndex((prev) => (prev + 1) % banners.length);
      Animated.timing(pan, {
        toValue: { x: 0, y: 0 },
        duration: 300,
        useNativeDriver: false
      }).start();
    });
  };

  const goToPrev = () => {
    if (banners.length <= 1) return;
    
    Animated.timing(pan, {
      toValue: { x: width, y: 0 },
      duration: 300,
      useNativeDriver: false
    }).start(() => {
      pan.setValue({ x: -width, y: 0 });
      setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
      Animated.timing(pan, {
        toValue: { x: 0, y: 0 },
        duration: 300,
        useNativeDriver: false
      }).start();
    });
  };

  useEffect(() => {
    if (banners.length > 1 && !isPaused) {
      timerRef.current = setTimeout(() => {
        goToNext();
      }, SLIDE_INTERVAL);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentIndex, isPaused, banners.length]);

  if (banners.length === 0) return null;

  return (
    <Animated.View
      style={[
        styles.bannerContainer,
        { transform: [{ translateX: pan.x }] }
      ]}
      {...panResponder.panHandlers}
    >
      <Image
        source={{ uri: `http://192.168.29.94:5000${banners[currentIndex]?.imageUrl}` }}
        style={styles.bannerImage}
        resizeMode="cover"
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    width: '100%',
    height: BANNER_HEIGHT,
  },
  bannerImage: {
    width: width,
    height: BANNER_HEIGHT,
  },
});

export default BannerSlider;
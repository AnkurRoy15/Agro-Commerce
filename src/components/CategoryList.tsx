import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  StyleSheet,
  Dimensions 
} from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9;

// Ensure all IDs are unique
const categories = [
    { id: 1, name: 'Seeds', image: require('assets/seed.png') },
    { id: 2, name: 'Fertilizers', image: require('assets/fertilizer.png') },
    { id: 3, name: 'Fruits', image: require('assets/fruit.png') },
    { id: 4, name: 'Vegetables', image: require('assets/tomato.png') },
    { id: 5, name: 'Pesticides', image: require('assets/pesticide.png') },
    { id: 6, name: 'Grain & Pulses', image: require('assets/rice.png') },
];

const CategoryItem = ({ item, onPress }) => (
  <TouchableOpacity 
    style={styles.categoryCard} 
    onPress={() => onPress(item)}
    activeOpacity={0.7}
  >
    <Image 
      source={item.image} 
      style={styles.categoryImage}
      resizeMode="contain"
    />
    <Text style={styles.categoryName}>{item.name}</Text>
  </TouchableOpacity>
);

const CategoryList = ({ onCategoryPress }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shop by Category</Text>
      <View style={styles.gridContainer}>
        {categories.map((item) => (
          <CategoryItem 
            key={`category-${item.id}`} // Unique key format
            item={item} 
            onPress={onCategoryPress} 
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: CARD_WIDTH / 2 - 10, // Two items per row with spacing
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Shadow for Android
    elevation: 3,
  },
  categoryIcon: {
    fontSize: 30,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  categoryImage: {
    width: 50,
    height: 50,
    marginBottom: 8,
  },
});

export default CategoryList;
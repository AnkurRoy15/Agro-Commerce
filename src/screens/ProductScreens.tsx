import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';


const API_BASE_URL = 'http://192.168.29.94:5000/api';

interface Product {
  _id: string;
  name: string;
  price: number;
  user_id:string;
  quantity: number;
  image_id: string;
}

const ProductsScreen = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { addToCart, updateQuantity, cartItems } = useCart();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get(`${API_BASE_URL}/products`);
      console.log(response);


      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.message || 'Invalid response format');
      }

      setProducts(response.data.data);
    } catch (err: any) {
      console.error('API Error:', err);
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProducts();
    }, [])
  );

  const renderItem = ({ item }: { item: Product }) => {
    const cartItem = cartItems?.find((c) => c._id === item._id);

    return (
      <View style={styles.productCard}>
        <Image
          source={{ 
            uri: `${API_BASE_URL}/images/${item.image_id}`,
            headers: {
              Accept: 'image/jpeg, image/png, image/webp, image/gif, */*'
            }
          }}
          style={styles.image}
          onError={(e) => {
            console.log(`Image error for ${item.image_id}:`, e.nativeEvent.error);
          }}
        />
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>₹{item.price.toFixed(2)}</Text>
        <Text style={styles.stock}>Quantity: {item.quantity} kg</Text>
        {/* <Text>{item.user_id}</Text> */}

        {cartItem ? (
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => updateQuantity(item._id, cartItem.quantity - 1)}
            >
              <Text style={styles.qtyText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.qtyValue}>{cartItem.quantity}</Text>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => updateQuantity(item._id, cartItem.quantity + 1)}
            >
              <Text style={styles.qtyText}>+</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => addToCart(item)}
          >
            <Text style={styles.addBtnText}>Add to Cart</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#27ae60" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchProducts}>
          <Text style={styles.addBtnText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      data={products}
      renderItem={renderItem}
      keyExtractor={(item) => item._id}
      numColumns={2}
      contentContainerStyle={styles.list}
      columnWrapperStyle={{ justifyContent: 'space-between' }}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 120,
    backgroundColor: '#f7f8fa', // Soft background
    minHeight: '100%',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f8fa',
    padding: 16,
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 14,
    marginBottom: 18,
    width: '47%',
    shadowColor: '#4a4a4a',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 6,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 110,
    borderRadius: 12,
    marginBottom: 12,
    resizeMode: 'cover',
    backgroundColor: '#e9ecef',
  },
  name: {
    fontWeight: '700',
    fontSize: 16,
    color: '#212529',
    marginBottom: 4,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  price: {
    color: '#27ae60',
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 2,
    textAlign: 'center',
  },
  stock: {
    fontSize: 13,
    color: '#6c757d',
    marginBottom: 10,
    textAlign: 'center',
  },
  addBtn: {
    backgroundColor: '#27ae60',
    paddingVertical: 10,
    paddingHorizontal: 0,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
    width: '100%',
    shadowColor: '#27ae60',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  addBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 0.2,
  },
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f3f6',
    borderRadius: 10,
    paddingVertical: 7,
    paddingHorizontal: 16,
    marginTop: 8,
    width: '100%',
  },
  qtyBtn: {
    backgroundColor: '#27ae60',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginHorizontal: 6,
    shadowColor: '#27ae60',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 2,
    elevation: 1,
  },
  qtyText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  qtyValue: {
    fontSize: 16,
    fontWeight: '700',
    marginHorizontal: 8,
    color: '#212529',
  },
  retryButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 12,
    paddingHorizontal: 26,
    borderRadius: 10,
    marginTop: 10,
    shadowColor: '#27ae60',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 3,
    elevation: 2,
  },
});



export default ProductsScreen;

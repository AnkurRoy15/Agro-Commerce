import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import ProductsScreen from '../screens/ProductScreens';
import ProfileScreen from '../screens/ProfileScreen';
import CartScreen from '../screens/CartScreen';
import NotificationScreen from '../components/Notification';
import { TouchableOpacity, View, StyleSheet } from 'react-native';

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Products') {
            iconName = focused ? 'leaf' : 'leaf-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }
          else if (route.name === 'Cart') {
            iconName = focused ? 'cart' : 'cart-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#27ae60',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          paddingBottom: 4,
          height: 60,
          position: 'relative',
        },
        headerStyle: {
          backgroundColor: '#27ae60',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        }
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={({ navigation }) => ({ 
          title: 'Agro Home',
          tabBarLabel: 'Home',
          headerTitleAlign: 'center',
          headerRight: () => (
            <TouchableOpacity 
              onPress={() => navigation.navigate(NotificationScreen)}
              style={{ marginRight: 15 }}
            >
              <Ionicons 
                name="notifications-outline" 
                size={24} 
                color="#fff" 
              />
            </TouchableOpacity>
          ),
        })}
      />
      
      <Tab.Screen 
        name="Products" 
        component={ProductsScreen} 
        options={{ title: 'Browse Products',
          tabBarLabel: 'Products'
        }}
      />
      
      {/* Cart Screen with Circular Icon */}
      <Tab.Screen 
        name="Cart" 
        component={CartScreen}
        options={{ title: 'Cart' }}
      />
      
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
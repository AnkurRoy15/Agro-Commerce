import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  user_id:string;
  image_id: string;
}

interface CartContextType {
  cart: { [key: string]: CartItem };
  cartItems: CartItem[];
  addToCart: (product: CartItem) => void;
  updateQuantity: (id: string, quantity: number) => void;
  incrementQuantity: (id: string) => void;
  decrementQuantity: (id: string) => void;
  removeFromCart: (id: string) => void;
  clearCart:() => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<{ [key: string]: CartItem }>({});

  const addToCart = (product: CartItem) => {
    setCart((prev) => {
      if (prev[product._id]) {
        return {
          ...prev,
          [product._id]: {
            ...prev[product._id],
            quantity: prev[product._id].quantity + 1,
          },
        };
      }
      return {
        ...prev,
        [product._id]: { ...product, quantity: 1, sellerId: product.user_id,},
        
      };
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      setCart((prev) => ({
        ...prev,
        [id]: { ...prev[id], quantity },
      }));
    }
  };

  const incrementQuantity = (id: string) => {
    if (cart[id]) {
      updateQuantity(id, cart[id].quantity + 1);
    }
  };

  const decrementQuantity = (id: string) => {
    if (cart[id]) {
      updateQuantity(id, cart[id].quantity - 1);
    }
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  const clearCart = () => {
    setCart({});
  };

  const cartItems = useMemo(() => Object.values(cart), [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartItems,
        addToCart,
        updateQuantity,
        incrementQuantity,
        decrementQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

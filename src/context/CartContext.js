import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (item, quantity) => {
    const existing = cart.find((i) => i.itemId === item._id);

    if (existing) {
      setCart(
        cart.map((i) =>
          i.itemId === item._id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        )
      );
    } else {
      setCart([
        ...cart,
        {
          itemId: item._id,
          name: item.name,
          price: item.price,
          quantity,
          vendorId: item.vendorId, 
          vendorName: item.vendorName  // ⭐ important fix
        },
      ]);
    }
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter((i) => i.itemId !== itemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

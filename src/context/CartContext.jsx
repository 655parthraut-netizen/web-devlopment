import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import supabase from '../supabase/client';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load cart and wishlist when user login state changes
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      if (user) {
        try {
          // Fetch from Supabase
          const { data: dbCart, error: cartErr } = await supabase
            .from('cart')
            .select('*, products(*)');
          
          if (!cartErr && dbCart) {
            // Map db structure to local structure
            const mappedCart = dbCart.map(item => ({
              id: item.id,
              product_id: item.product_id,
              quantity: item.quantity,
              product: item.products || { id: item.product_id }
            }));
            setCart(mappedCart);
          }

          const { data: dbWish, error: wishErr } = await supabase
            .from('wishlist')
            .select('*, products(*)');
          
          if (!wishErr && dbWish) {
            const mappedWish = dbWish.map(item => item.products || { id: item.product_id });
            setWishlist(mappedWish);
          }

          // Sync local items (guest cart) to DB if any exist
          const localCart = JSON.parse(localStorage.getItem('electronova_guest_cart') || '[]');
          if (localCart.length > 0) {
            for (const localItem of localCart) {
              // Check if item already in dbCart
              const existing = dbCart?.find(d => d.product_id === localItem.product.id);
              if (existing) {
                // Update quantity
                await supabase
                  .from('cart')
                  .update({ quantity: existing.quantity + localItem.quantity })
                  .eq('id', existing.id);
              } else {
                // Insert new
                await supabase
                  .from('cart')
                  .insert({
                    user_id: user.id,
                    product_id: localItem.product.id,
                    quantity: localItem.quantity
                  });
              }
            }
            // Clear local storage and reload
            localStorage.removeItem('electronova_guest_cart');
            const { data: updatedDbCart } = await supabase
              .from('cart')
              .select('*, products(*)');
            if (updatedDbCart) {
              setCart(updatedDbCart.map(item => ({
                id: item.id,
                product_id: item.product_id,
                quantity: item.quantity,
                product: item.products
              })));
            }
          }

          const localWish = JSON.parse(localStorage.getItem('electronova_guest_wishlist') || '[]');
          if (localWish.length > 0) {
            for (const product of localWish) {
              const { data: existingWish } = await supabase
                .from('wishlist')
                .select('*')
                .eq('product_id', product.id);
              if (!existingWish || existingWish.length === 0) {
                await supabase
                  .from('wishlist')
                  .insert({
                    user_id: user.id,
                    product_id: product.id
                  });
              }
            }
            localStorage.removeItem('electronova_guest_wishlist');
            const { data: updatedDbWish } = await supabase
              .from('wishlist')
              .select('*, products(*)');
            if (updatedDbWish) {
              setWishlist(updatedDbWish.map(item => item.products));
            }
          }

        } catch (err) {
          console.error('Error syncing Supabase cart/wishlist:', err);
        }
      } else {
        // Load from guest local storage
        const localCart = JSON.parse(localStorage.getItem('electronova_guest_cart') || '[]');
        const localWish = JSON.parse(localStorage.getItem('electronova_guest_wishlist') || '[]');
        setCart(localCart);
        setWishlist(localWish);
      }
      setLoading(false);
    };

    loadData();
  }, [user]);

  // Sync guest cart to local storage when it changes
  useEffect(() => {
    if (!user) {
      localStorage.setItem('electronova_guest_cart', JSON.stringify(cart));
    }
  }, [cart, user]);

  useEffect(() => {
    if (!user) {
      localStorage.setItem('electronova_guest_wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, user]);

  const addToCart = async (product, quantity = 1) => {
    if (user) {
      try {
        // Check if existing
        const { data: existingItems } = await supabase
          .from('cart')
          .select('*')
          .eq('product_id', product.id);

        if (existingItems && existingItems.length > 0) {
          const item = existingItems[0];
          const newQty = item.quantity + quantity;
          await supabase
            .from('cart')
            .update({ quantity: newQty })
            .eq('id', item.id);
          
          setCart(prev => prev.map(item => 
            item.product_id === product.id ? { ...item, quantity: newQty } : item
          ));
        } else {
          const { data: inserted } = await supabase
            .from('cart')
            .insert({
              user_id: user.id,
              product_id: product.id,
              quantity: quantity
            });
          
          if (inserted && inserted.length > 0) {
            setCart(prev => [...prev, {
              id: inserted[0].id,
              product_id: product.id,
              quantity,
              product
            }]);
          } else {
            // Re-fetch to be safe
            const { data } = await supabase.from('cart').select('*, products(*)');
            if (data) {
              setCart(data.map(item => ({
                id: item.id,
                product_id: item.product_id,
                quantity: item.quantity,
                product: item.products
              })));
            }
          }
        }
      } catch (err) {
        console.error('Error adding to Supabase cart:', err);
      }
    } else {
      // Local cart
      setCart(prev => {
        const idx = prev.findIndex(item => item.product_id === product.id);
        if (idx > -1) {
          const updated = [...prev];
          updated[idx].quantity += quantity;
          return updated;
        } else {
          return [...prev, {
            id: `guest-${Math.random().toString(36).substring(2, 9)}`,
            product_id: product.id,
            quantity,
            product
          }];
        }
      });
    }
  };

  const removeFromCart = async (productId) => {
    if (user) {
      try {
        await supabase
          .from('cart')
          .delete()
          .eq('product_id', productId);
        
        setCart(prev => prev.filter(item => item.product_id !== productId));
      } catch (err) {
        console.error('Error deleting from Supabase cart:', err);
      }
    } else {
      setCart(prev => prev.filter(item => item.product_id !== productId));
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    if (user) {
      try {
        const cartItem = cart.find(item => item.product_id === productId);
        if (cartItem) {
          await supabase
            .from('cart')
            .update({ quantity })
            .eq('product_id', productId);
          
          setCart(prev => prev.map(item => 
            item.product_id === productId ? { ...item, quantity } : item
          ));
        }
      } catch (err) {
        console.error('Error updating Supabase cart quantity:', err);
      }
    } else {
      setCart(prev => prev.map(item => 
        item.product_id === productId ? { ...item, quantity } : item
      ));
    }
  };

  const clearCart = async () => {
    if (user) {
      try {
        await supabase
          .from('cart')
          .delete()
          .eq('user_id', user.id);
      } catch (err) {
        console.error('Error clearing Supabase cart:', err);
      }
    }
    setCart([]);
  };

  const toggleWishlist = async (product) => {
    const isAlreadyWishlisted = wishlist.some(item => item.id === product.id);
    if (user) {
      try {
        if (isAlreadyWishlisted) {
          await supabase
            .from('wishlist')
            .delete()
            .eq('product_id', product.id);
          
          setWishlist(prev => prev.filter(item => item.id !== product.id));
        } else {
          await supabase
            .from('wishlist')
            .insert({
              user_id: user.id,
              product_id: product.id
            });
          
          setWishlist(prev => [...prev, product]);
        }
      } catch (err) {
        console.error('Error modifying Supabase wishlist:', err);
      }
    } else {
      if (isAlreadyWishlisted) {
        setWishlist(prev => prev.filter(item => item.id !== product.id));
      } else {
        setWishlist(prev => [...prev, product]);
      }
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  const placeOrder = async (shippingDetails) => {
    const itemsSummary = cart.map(item => ({
      product_id: item.product_id,
      name: item.product.name,
      price: item.product.price,
      discount: item.product.discount,
      quantity: item.quantity,
      image: item.product.image
    }));

    const finalPrice = cart.reduce((total, item) => {
      const discountedPrice = item.product.price * (1 - (item.product.discount || 0) / 100);
      return total + (discountedPrice * item.quantity);
    }, 0);

    const orderData = {
      user_id: user ? user.id : 'guest',
      items: itemsSummary,
      total: Number(finalPrice.toFixed(2)),
      status: 'Pending',
      shipping_details: shippingDetails
    };

    if (user) {
      const { data, error } = await supabase
        .from('orders')
        .insert(orderData);
      if (error) throw error;
      await clearCart();
      return data;
    } else {
      // For guest, simulate saving order history to localStorage orders
      const orders = JSON.parse(localStorage.getItem('electronova_orders') || '[]');
      const newOrder = {
        id: `ord-${Math.random().toString(36).substring(2, 9)}`,
        created_at: new Date().toISOString(),
        ...orderData
      };
      orders.push(newOrder);
      localStorage.setItem('electronova_orders', JSON.stringify(orders));
      await clearCart();
      return [newOrder];
    }
  };

  const getOrders = async () => {
    if (user) {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    } else {
      const orders = JSON.parse(localStorage.getItem('electronova_orders') || '[]');
      return orders.filter(o => o.user_id === 'guest').sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
  };

  return (
    <CartContext.Provider value={{
      cart,
      wishlist,
      loading,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      toggleWishlist,
      isInWishlist,
      placeOrder,
      getOrders
    }}>
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

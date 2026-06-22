import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Trash2, ArrowRight, ShoppingBag, Plus, Minus, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  // Price calculations
  const originalSubtotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  const finalSubtotal = cart.reduce((total, item) => {
    const discountedPrice = item.product.price * (1 - (item.product.discount || 0) / 100);
    return total + (discountedPrice * item.quantity);
  }, 0);
  
  const discountAmount = originalSubtotal - finalSubtotal;
  const estimatedTax = finalSubtotal * 0.08; // 8% tax
  const shippingFee = 0; // Complimentary shipping
  const totalPrice = finalSubtotal + estimatedTax + shippingFee;

  if (cart.length === 0) {
    return (
      <div className="w-full bg-white min-h-[70vh] flex flex-col items-center justify-center py-20 px-4 text-center animate-fade-in">
        <div className="p-5 rounded-none bg-gray-50 border border-gray-200 text-black mb-6">
          <ShoppingBag className="h-10 w-10" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight mb-3">
          Your cart is empty
        </h1>
        <p className="text-sm text-gray-500 max-w-sm mb-8 leading-relaxed font-normal">
          Explore our collection of premium headphones, laptops, smartphones, and luxury accessories to add your first flagship item.
        </p>
        <button
          onClick={() => navigate('/products')}
          className="btn-primary"
        >
          Browse products
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-white text-gray-700 min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 animate-fade-in">
      
      {/* Header */}
      <div className="text-left mb-10">
        <span className="eyebrow">Cart</span>
        <h1 className="page-heading">Shopping cart ({cart.length})</h1>
      </div>

      {/* Main Grid: Cart Items (Left) vs Summary Card (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        
        {/* Cart Items List (Col Span 2) */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => {
            const discPrice = item.product.price * (1 - (item.product.discount || 0) / 100);
            return (
              <motion.div
                key={item.id}
                layout
                className="flex flex-col sm:flex-row items-center gap-6 p-5 rounded-none border border-gray-100 bg-white hover:border-black text-left justify-between transition-colors duration-300"
              >
                
                {/* Product Image and description */}
                <div className="flex items-center gap-5 w-full sm:w-auto">
                  <div
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-none bg-gray-50 border border-gray-100 p-2 flex items-center justify-center flex-shrink-0 cursor-pointer"
                    onClick={() => navigate(`/product/${item.product.id}`)}
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="max-h-full max-w-full object-contain drop-shadow-sm"
                    />
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      {item.product.brand}
                    </span>
                    <h3
                      className="font-medium text-base text-gray-900 hover:underline cursor-pointer line-clamp-2 leading-snug"
                      onClick={() => navigate(`/product/${item.product.id}`)}
                    >
                      {item.product.name}
                    </h3>
                    <p className="text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">{item.product.category}</p>
                    
                    {/* Price details */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-black">
                        ${discPrice.toFixed(2)}
                      </span>
                      {item.product.discount > 0 && (
                        <span className="text-xs text-gray-400 line-through">
                          ${item.product.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Controls: Quantity adjustments and item subtotal */}
                <div className="flex items-center justify-between sm:justify-end gap-8 w-full sm:w-auto border-t sm:border-t-0 border-gray-100 pt-4 sm:pt-0">
                  
                  {/* Qty controls */}
                  <div className="flex items-center border border-gray-200 rounded-none bg-white overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                      className="p-2.5 hover:bg-gray-50 text-gray-400 hover:text-black transition-colors"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-black">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                      className="p-2.5 hover:bg-gray-50 text-gray-400 hover:text-black transition-colors"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Total item price */}
                  <div className="text-right w-24">
                    <span className="font-display text-sm font-extrabold text-black block">
                      ${(discPrice * item.quantity).toFixed(2)}
                    </span>
                  </div>

                  {/* Remove trigger */}
                  <button
                    onClick={() => removeFromCart(item.product_id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-50 rounded-none transition-all duration-300"
                    title="Remove item"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>

                </div>

              </motion.div>
            );
          })}

          <div className="text-left pt-2">
            <Link
              to="/products"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-black hover:underline transition-colors duration-250"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>

        {/* Order pricing summary Card */}
        <div className="p-6 rounded-xl border border-gray-100 bg-gray-50 text-left space-y-6">
          <h3 className="font-medium text-sm text-gray-900 border-b border-gray-200 pb-3">
            Summary
          </h3>

          <div className="space-y-3.5 text-sm font-normal">
            <div className="flex justify-between text-gray-550 text-gray-500">
              <span>Retail Subtotal</span>
              <span className="font-semibold text-black">${originalSubtotal.toFixed(2)}</span>
            </div>
            
            {discountAmount > 0 && (
              <div className="flex justify-between text-red-600">
                <span>Exclusive Savings</span>
                <span className="font-bold">-${discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between text-gray-500">
              <span>Estimated Tax (8%)</span>
              <span className="font-semibold text-black">${estimatedTax.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-gray-500">
              <span>Shipping & Handling</span>
              <span className="text-black font-extrabold uppercase text-xs tracking-wider">Free</span>
            </div>

            <div className="flex justify-between text-base font-extrabold text-black pt-4 border-t border-gray-200">
              <span>Total Price</span>
              <span className="font-display text-lg text-black">${totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full inline-flex items-center justify-center gap-2 rounded-none bg-black py-4 text-xs font-bold uppercase tracking-widest text-white hover:bg-gray-800 transition-colors duration-300 shadow-md"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

      </div>

    </div>
  );
};

export default Cart;

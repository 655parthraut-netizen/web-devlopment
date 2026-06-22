import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, CheckCircle, ArrowRight, ArrowLeft, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';

const Checkout = () => {
  const { cart, placeOrder } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '', fullName: '', address: '', city: '', zip: '', country: 'United States',
    cardName: '', cardNumber: '', cardExpiry: '', cardCvv: ''
  });
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState('');

  const finalSubtotal = cart.reduce((total, item) => {
    const dp = item.product.price * (1 - (item.product.discount || 0) / 100);
    return total + (dp * item.quantity);
  }, 0);
  const estimatedTax = finalSubtotal * 0.08;
  const totalPrice = finalSubtotal + estimatedTax;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await placeOrder({ email: formData.email, fullName: formData.fullName, address: formData.address, city: formData.city, zip: formData.zip, country: formData.country });
      setPlacedOrderId(response && response.length > 0 ? response[0].id : `ord-${Math.random().toString(36).substring(2, 9)}`);
      setOrderSuccess(true);
    } catch (err) { console.error('Error placing order:', err); }
    finally { setLoading(false); }
  };

  if (orderSuccess) {
    return (
      <div className="w-full bg-white min-h-screen flex items-center justify-center py-20 px-4 animate-fade-in">
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full p-8 rounded-none border border-gray-100 bg-gray-50 text-center space-y-6 shadow-md">
          <div className="flex justify-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 10, stiffness: 100 }} className="p-4 rounded-none bg-emerald-50 border border-emerald-200 text-emerald-700 mb-2">
              <CheckCircle className="h-12 w-12" />
            </motion.div>
          </div>
          <div className="space-y-2">
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-black uppercase tracking-tight">Order Placed Successfully</h1>
            <p className="text-xs font-bold text-gray-400 tracking-widest uppercase">Order ID: {placedOrderId}</p>
            <p className="text-sm text-gray-500 leading-relaxed pt-2 font-normal">Thank you for choosing ElectroNova. A confirmation receipt has been sent to <span className="text-black font-bold">{formData.email}</span>.</p>
          </div>
          <div className="pt-6 space-y-3">
            <button onClick={() => navigate('/profile')} className="w-full py-3.5 rounded-none bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors duration-300 shadow-md">Track Order History</button>
            <button onClick={() => navigate('/')} className="w-full py-3.5 rounded-none border border-gray-200 text-xs font-bold uppercase tracking-widest text-gray-500 hover:border-black hover:text-black transition-all duration-300">Back to Homepage</button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="w-full bg-white min-h-[70vh] flex flex-col items-center justify-center px-4 text-center animate-fade-in">
        <h1 className="font-display font-extrabold text-xl text-black uppercase mb-2">No Active Checkout Session</h1>
        <p className="text-sm text-gray-500 mb-6">Your shopping cart is empty.</p>
        <button onClick={() => navigate('/products')} className="px-6 py-3 rounded-none bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-gray-800">View Catalog</button>
      </div>
    );
  }

  const inputClasses = "w-full bg-white border border-gray-200 text-black rounded-none py-3 px-4 text-sm focus:border-black";

  return (
    <div className="w-full bg-white text-gray-700 min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 animate-fade-in">
      <div className="text-left flex items-center justify-between">
        <div>
          <h1 className="text-xs font-bold tracking-[0.25em] text-gray-400 uppercase mb-2">Secure Gateway</h1>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-black uppercase tracking-tight">Checkout Details</h2>
        </div>
        <button onClick={() => navigate('/cart')} className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors">
          <ArrowLeft className="h-4 w-4" /><span>Return to Cart</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        <div className="lg:col-span-2 space-y-8 text-left">
          {/* Section 1: Customer Info */}
          <div className="space-y-4">
            <h3 className="font-display font-extrabold text-xs uppercase tracking-widest text-black border-b border-gray-100 pb-2.5">1. Customer Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Email Address</label>
                <input type="email" required name="email" placeholder="e.g. lex@nova.com" value={formData.email} onChange={handleInputChange} className={inputClasses} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Full Name</label>
                <input type="text" required name="fullName" placeholder="e.g. Lex Sterling" value={formData.fullName} onChange={handleInputChange} className={inputClasses} />
              </div>
            </div>
          </div>

          {/* Section 2: Shipping */}
          <div className="space-y-4 pt-4">
            <h3 className="font-display font-extrabold text-xs uppercase tracking-widest text-black border-b border-gray-100 pb-2.5">2. Shipping Destination</h3>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Street Address</label>
                <input type="text" required name="address" placeholder="e.g. 5th Avenue Suite 40" value={formData.address} onChange={handleInputChange} className={inputClasses} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">City</label>
                  <input type="text" required name="city" placeholder="New York" value={formData.city} onChange={handleInputChange} className={inputClasses} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Postal Code</label>
                  <input type="text" required name="zip" placeholder="10001" value={formData.zip} onChange={handleInputChange} className={inputClasses} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Country</label>
                  <select name="country" value={formData.country} onChange={handleInputChange} className={`${inputClasses} cursor-pointer`}>
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Germany">Germany</option>
                    <option value="Japan">Japan</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Payment */}
          <div className="space-y-4 pt-4">
            <h3 className="font-display font-extrabold text-xs uppercase tracking-widest text-black border-b border-gray-100 pb-2.5">3. Payment Details</h3>
            <div className="p-5 rounded-none border border-gray-100 bg-gray-50 space-y-4">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-200 pb-3">
                <span className="flex items-center gap-1.5"><CreditCard className="h-4 w-4 text-black" /> Card Payment</span>
                <span className="flex items-center gap-1 text-emerald-700"><ShieldCheck className="h-3.5 w-3.5" /> SSL ENCRYPTED</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Name on Card</label>
                  <input type="text" required name="cardName" placeholder="LEX STERLING" value={formData.cardName} onChange={handleInputChange} className={inputClasses} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Card Number</label>
                  <input type="text" required name="cardNumber" pattern="\d{16}" maxLength="16" placeholder="4000123456789012" value={formData.cardNumber} onChange={handleInputChange} className={inputClasses} title="16-digit card number" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Expiration</label>
                  <input type="text" required name="cardExpiry" placeholder="MM/YY" maxLength="5" pattern="\d{2}/\d{2}" value={formData.cardExpiry} onChange={handleInputChange} className={inputClasses} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">CVV</label>
                  <input type="password" required name="cardCvv" maxLength="3" pattern="\d{3}" placeholder="***" value={formData.cardCvv} onChange={handleInputChange} className={inputClasses} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Order Summary */}
        <div className="p-6 rounded-none border border-gray-100 bg-gray-50 text-left space-y-6">
          <h3 className="font-display font-extrabold text-xs uppercase tracking-widest text-black border-b border-gray-200 pb-3">Your Order Invoice</h3>
          <div className="max-h-48 overflow-y-auto space-y-3 pr-2">
            {cart.map((item) => {
              const dp = item.product.price * (1 - (item.product.discount || 0) / 100);
              return (
                <div key={item.id} className="flex gap-3 justify-between items-center text-sm border-b border-gray-100 pb-2">
                  <div className="flex gap-2.5 items-center truncate">
                    <img src={item.product.image} className="w-8 h-8 object-contain bg-white border border-gray-200 p-0.5 rounded-none" alt="" />
                    <span className="truncate text-black text-xs font-bold">{item.product.name}</span>
                    <span className="text-[10px] font-bold text-gray-400">x{item.quantity}</span>
                  </div>
                  <span className="font-extrabold text-xs text-black">${(dp * item.quantity).toFixed(2)}</span>
                </div>
              );
            })}
          </div>
          <div className="space-y-3.5 text-xs border-b border-gray-200 pb-4 font-normal">
            <div className="flex justify-between text-gray-500"><span>Items Total</span><span className="font-bold text-black">${finalSubtotal.toFixed(2)}</span></div>
            <div className="flex justify-between text-gray-500"><span>Sales Tax (8%)</span><span className="font-bold text-black">${estimatedTax.toFixed(2)}</span></div>
            <div className="flex justify-between text-gray-500"><span>Insured Shipping</span><span className="text-black font-extrabold uppercase text-[10px] tracking-wider">Free</span></div>
          </div>
          <div className="flex justify-between text-sm font-extrabold text-black">
            <span>Amount Due</span>
            <span className="font-display text-lg">${totalPrice.toFixed(2)}</span>
          </div>
          <button type="submit" disabled={loading} className="w-full inline-flex items-center justify-center gap-2 rounded-none bg-black py-4 text-xs font-bold uppercase tracking-widest text-white hover:bg-gray-800 transition-colors duration-300 shadow-md disabled:opacity-50 disabled:cursor-wait">
            {loading ? <span>Authorizing Transaction...</span> : <><span>Submit Order</span><ArrowRight className="h-4 w-4" /></>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { User, ClipboardList, Package, Calendar, LogOut } from 'lucide-react';
import Loader from '../components/Loader';
import { motion } from 'framer-motion';

const Profile = () => {
  const { user, logout, loading: authLoading } = useAuth();
  const { getOrders } = useCart();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => { if (!authLoading && !user) navigate('/login'); }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (user) {
        try { setLoadingOrders(true); const data = await getOrders(); if (data) setOrders(data); }
        catch (err) { console.error('Error fetching user orders:', err); }
        finally { setLoadingOrders(false); }
      }
    };
    fetchOrders();
  }, [user]);

  if (authLoading || !user) return <Loader fullPage />;

  const handleLogoutClick = async () => { await logout(); navigate('/'); };

  return (
    <div className="w-full bg-white text-gray-700 min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 animate-fade-in">
      {/* Header */}
      <div className="text-left flex items-center justify-between mb-10">
        <div>
          <span className="eyebrow">Account</span>
          <h1 className="page-heading">My account</h1>
        </div>
        <button onClick={handleLogoutClick} className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest text-red-600 border border-red-200 hover:border-red-400 rounded-none bg-red-50 hover:bg-red-100 transition-all duration-300">
          <LogOut className="h-3.5 w-3.5" /><span>Log Out</span>
        </button>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* User Card */}
        <div className="p-6 rounded-none border border-gray-100 bg-gray-50 text-left space-y-6">
          <div className="flex items-center gap-4 border-b border-gray-200 pb-4">
            <div className="w-12 h-12 rounded-none bg-black text-white flex items-center justify-center">
              <User className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-base text-black truncate max-w-[160px] uppercase">{user.user_metadata?.full_name || 'Nova Member'}</h3>
              <p className="text-xs text-gray-500 truncate max-w-[160px]">{user.email}</p>
            </div>
          </div>
          <div className="space-y-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
            <div className="flex items-center gap-2.5">
              <Calendar className="h-4 w-4 text-black" />
              <span>Registered: {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Premium Tier'}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Package className="h-4 w-4 text-black" />
              <span>Status: Active Elite</span>
            </div>
          </div>
        </div>

        {/* Orders list */}
        <div className="lg:col-span-2 space-y-6 text-left">
          <h3 className="font-display font-extrabold text-xs uppercase tracking-widest text-black flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            <span>Order History ({orders.length})</span>
          </h3>

          {loadingOrders ? (
            <Loader />
          ) : orders.length === 0 ? (
            <div className="p-12 text-center rounded-none border border-gray-100 bg-gray-50">
              <p className="text-sm text-gray-500 mb-6 font-normal">You haven't placed any orders yet.</p>
              <button onClick={() => navigate('/products')} className="px-6 py-3 rounded-none bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors">Go Shopping</button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="p-5 rounded-none border border-gray-100 bg-gray-50 space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-200 pb-3 gap-3">
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Order Placement</span>
                      <p className="text-sm font-extrabold text-black uppercase tracking-tight">{order.id}</p>
                    </div>
                    <div className="flex gap-4 items-center">
                      <div className="text-right">
                        <span className="text-[10px] text-gray-400 block font-bold uppercase">Date</span>
                        <span className="text-xs text-black font-bold">{new Date(order.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-gray-400 block font-bold uppercase">Amount</span>
                        <span className="text-sm font-extrabold text-black font-display">${order.total.toFixed(2)}</span>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-none text-[10px] font-bold uppercase border ${order.status === 'Delivered' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>{order.status}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 pt-2">
                    {order.items && order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-white border border-gray-200 p-2.5 rounded-none max-w-[280px] w-full">
                        <img src={item.image} alt={item.name} className="w-10 h-10 object-contain bg-gray-50 p-0.5 rounded-none" />
                        <div className="truncate text-left flex-grow">
                          <p className="text-xs text-black truncate font-bold">{item.name}</p>
                          <p className="text-[10px] text-gray-500 font-normal">Qty: {item.quantity} • ${(item.price * (1 - (item.discount || 0)/100)).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

import React, { createContext, useContext, useState, useEffect } from 'react';
import supabase, { ADMIN_EMAIL, ADMIN_PASSWORD, isMock } from '../supabase/client';

const AdminAuthContext = createContext();

const ADMIN_SESSION_KEY = 'electronova_admin_session';

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem(ADMIN_SESSION_KEY);
    if (stored) {
      try {
        setAdmin(JSON.parse(stored));
      } catch {
        sessionStorage.removeItem(ADMIN_SESSION_KEY);
      }
    }
    setLoading(false);
  }, []);

  const adminLogin = async (email, password) => {
    if (isMock) {
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        const adminUser = { email, role: 'admin', name: 'Admin' };
        sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(adminUser));
        setAdmin(adminUser);
        return adminUser;
      }
      throw new Error('Invalid admin credentials');
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    const role = data.user?.user_metadata?.role;
    if (role !== 'admin') {
      await supabase.auth.signOut();
      throw new Error('Access denied. Admin privileges required.');
    }

    const adminUser = { email: data.user.email, role: 'admin', id: data.user.id };
    sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(adminUser));
    setAdmin(adminUser);
    return adminUser;
  };

  const adminLogout = async () => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    setAdmin(null);
    if (!isMock) {
      await supabase.auth.signOut();
    }
  };

  return (
    <AdminAuthContext.Provider value={{ admin, loading, adminLogin, adminLogout, isAdmin: !!admin }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
};

import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import Loader from '../../components/Loader';

const AdminProtectedRoute = ({ children }) => {
  const { isAdmin, loading } = useAdminAuth();

  if (loading) return <Loader fullPage />;
  if (!isAdmin) return <Navigate to="/admin/login" replace />;

  return children;
};

export default AdminProtectedRoute;

import React from 'react';
import { Navigate } from 'react-router-dom';

const NotFoundRedirect = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" />;
  }
  return <Navigate to="/" />;
};

export default NotFoundRedirect;

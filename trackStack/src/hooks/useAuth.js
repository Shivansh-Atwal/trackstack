import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout as logoutApi } from '../api';

export function useAuth() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authToken, setAuthToken] = useState(null);
  const navigate = useNavigate();

  const checkAuthState = useCallback(() => {
    try {
      const token = localStorage.getItem('trackstack_token');
      const userData = localStorage.getItem('trackstack_user');
      
      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        setAuthToken(token);
        setUser(parsedUser);
        setIsAuthed(true);
      } else {
        setAuthToken(null);
        setUser(null);
        setIsAuthed(false);
      }
    } catch (err) {
      console.error('Failed to parse user data:', err);
      handleLogout();
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLogout = useCallback(() => {
    logoutApi();
    setAuthToken(null);
    setUser(null);
    setIsAuthed(false);
    localStorage.removeItem('trackstack_token');
    localStorage.removeItem('trackstack_user');
    navigate('/');
  }, [navigate]);

  const updateUser = useCallback((userData) => {
    setUser(userData);
  }, []);

  const updateToken = useCallback((token) => {
    setAuthToken(token);
  }, []);

  // Combined function for login to set both token and user
  const handleLogin = useCallback((token, userData) => {
    setAuthToken(token);
    setUser(userData);
  }, []);

  // useEffect to watch for token and user changes and update auth state
  useEffect(() => {
    console.log('useAuth useEffect - authToken:', authToken, 'user:', user);
    if (authToken && user) {
      console.log('Setting isAuthed to true');
      setIsAuthed(true);
      // Update localStorage
      localStorage.setItem('trackstack_token', authToken);
      localStorage.setItem('trackstack_user', JSON.stringify(user));
    } else if (!authToken || !user) {
      console.log('Setting isAuthed to false');
      setIsAuthed(false);
    }
  }, [authToken, user]);

  // useEffect to check auth state on mount
  useEffect(() => {
    checkAuthState();
  }, [checkAuthState]);

  // useEffect to listen for storage changes (for multi-tab sync)
  useEffect(() => {
    function onStorage() {
      checkAuthState();
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [checkAuthState]);

  return {
    isAuthed,
    user,
    isLoading,
    checkAuthState,
    handleLogout,
    updateUser,
    updateToken,
    handleLogin,
  };
}

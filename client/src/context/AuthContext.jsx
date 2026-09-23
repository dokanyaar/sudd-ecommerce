import { createContext, useCallback, useEffect, useState } from 'react';
import api from '../lib/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [userLoading, setUserLoading] = useState(true);

  const [authLoading, setAuthLoading] = useState(false);

  const [logoutLoading, setLogoutLoading] = useState(false);

  // Get currently logged-in user
  const getMe = useCallback(async () => {
    try {
      const { data } = await api.get('/auth/me');

      if (data.success) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setUserLoading(false);
    }
  }, []);

  // Register
  const registerUser = async (formData) => {
    setAuthLoading(true);

    try {
      const { data } = await api.post('/auth/register', formData);

      if (data.success) {
        setUser(data.user);
      }

      return data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed.',
      };
    } finally {
      setAuthLoading(false);
    }
  };

  // Login
  const loginUser = async (formData) => {
    setAuthLoading(true);

    try {
      const { data } = await api.post('/auth/login', formData);

      if (data.success) {
        setUser(data.user);
      }

      return data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed.',
      };
    } finally {
      setAuthLoading(false);
    }
  };

  // Logout
  const logoutUser = async () => {
    setLogoutLoading(true);

    try {
      const { data } = await api.post('/auth/logout');

      if (data.success) {
        setUser(null);
      }

      return data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Logout failed.',
      };
    } finally {
      setLogoutLoading(false);
    }
  };

  useEffect(() => {
    getMe();
  }, [getMe]);

  const value = {
    user,
    setUser,

    userLoading,
    authLoading,
    logoutLoading,

    getMe,
    registerUser,
    loginUser,
    logoutUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;

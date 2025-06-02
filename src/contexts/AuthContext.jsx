import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { LOCAL_STORAGE_KEYS } from '../utils/constants';
import { getFromLocalStorage, saveToLocalStorage, removeFromLocalStorage } from '../utils/localStorageUtils';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing session on app load
    const currentUser = getFromLocalStorage(LOCAL_STORAGE_KEYS.CURRENT_USER);
    if (currentUser && currentUser.id) {
      dispatch({ type: 'LOGIN_SUCCESS', payload: currentUser });
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const login = async (email, password) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const users = getFromLocalStorage(LOCAL_STORAGE_KEYS.USERS);
      const user = users.find(u => u.email === email && u.password === password);
      
      if (user) {
        const { password: _, ...userWithoutPassword } = user;
        saveToLocalStorage(LOCAL_STORAGE_KEYS.CURRENT_USER, userWithoutPassword);
        dispatch({ type: 'LOGIN_SUCCESS', payload: userWithoutPassword });
        navigate('/dashboard');
        return { success: true };
      } else {
        dispatch({ type: 'LOGIN_FAILURE', payload: 'Invalid email or password' });
        return { success: false, error: 'Invalid email or password' };
      }
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: 'Login failed. Please try again.' });
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  const logout = () => {
    removeFromLocalStorage(LOCAL_STORAGE_KEYS.CURRENT_USER);
    dispatch({ type: 'LOGOUT' });
    navigate('/login');
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    ...state,
    login,
    logout,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

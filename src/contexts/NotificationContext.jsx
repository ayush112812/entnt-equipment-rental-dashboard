import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { LOCAL_STORAGE_KEYS, NOTIFICATION_TYPES } from '../utils/constants';
import { getFromLocalStorage, saveToLocalStorage } from '../utils/localStorageUtils';

const NotificationContext = createContext();

// Action types
const ADD_NOTIFICATION = 'ADD_NOTIFICATION';
const REMOVE_NOTIFICATION = 'REMOVE_NOTIFICATION';
const MARK_AS_READ = 'MARK_AS_READ';
const CLEAR_NOTIFICATIONS = 'CLEAR_NOTIFICATIONS';
const SET_NOTIFICATIONS = 'SET_NOTIFICATIONS';

// Initial state
const initialState = {
  notifications: [],
};

// Reducer
const notificationReducer = (state, action) => {
  switch (action.type) {
    case ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [
          {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            read: false,
            ...action.payload,
          },
          ...state.notifications,
        ].slice(0, 50), // Keep only the last 50 notifications
      };

    case REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(
          (notification) => notification.id !== action.payload
        ),
      };

    case MARK_AS_READ:
      return {
        ...state,
        notifications: state.notifications.map((notification) =>
          notification.id === action.payload
            ? { ...notification, read: true }
            : notification
        ),
      };

    case CLEAR_NOTIFICATIONS:
      return {
        ...state,
        notifications: [],
      };

    case SET_NOTIFICATIONS:
      return {
        ...state,
        notifications: action.payload,
      };

    default:
      return state;
  }
};

export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  const addNotification = useCallback((notification) => {
    dispatch({ type: ADD_NOTIFICATION, payload: notification });
  }, []);

  const removeNotification = useCallback((id) => {
    dispatch({ type: REMOVE_NOTIFICATION, payload: id });
  }, []);

  const markAsRead = useCallback((id) => {
    dispatch({ type: MARK_AS_READ, payload: id });
  }, []);

  const clearNotifications = useCallback(() => {
    dispatch({ type: CLEAR_NOTIFICATIONS });
  }, []);

  // Helper function to add different types of notifications
  const notify = useCallback(
    (title, message, type = 'info') => {
      addNotification({
        title,
        message,
        type,
      });
    },
    [addNotification]
  );

  const success = useCallback(
    (title, message) => {
      notify(title, message, 'success');
    },
    [notify]
  );

  const error = useCallback(
    (title, message) => {
      notify(title, message, 'error');
    },
    [notify]
  );

  const warning = useCallback(
    (title, message) => {
      notify(title, message, 'warning');
    },
    [notify]
  );

  const info = useCallback(
    (title, message) => {
      notify(title, message, 'info');
    },
    [notify]
  );

  const value = {
    notifications: state.notifications,
    addNotification,
    removeNotification,
    markAsRead,
    clearNotifications,
    notify,
    success,
    error,
    warning,
    info,
  };

  useEffect(() => {
    const notifications = getFromLocalStorage(LOCAL_STORAGE_KEYS.NOTIFICATIONS);
    dispatch({ type: SET_NOTIFICATIONS, payload: notifications || [] });
  }, []);

  useEffect(() => {
    saveToLocalStorage(LOCAL_STORAGE_KEYS.NOTIFICATIONS, state.notifications);
  }, [state.notifications]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;

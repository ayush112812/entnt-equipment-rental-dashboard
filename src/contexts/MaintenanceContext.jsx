import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { LOCAL_STORAGE_KEYS, NOTIFICATION_TYPES } from '../utils/constants';
import { getFromLocalStorage, saveToLocalStorage, generateId } from '../utils/localStorageUtils';
import { useNotification } from './NotificationContext';

const MaintenanceContext = createContext();

const maintenanceReducer = (state, action) => {
  switch (action.type) {
    case 'SET_MAINTENANCE':
      return {
        ...state,
        maintenance: action.payload || [],
        loading: false
      };
    case 'ADD_MAINTENANCE':
      return {
        ...state,
        maintenance: [...state.maintenance, action.payload]
      };
    case 'UPDATE_MAINTENANCE':
      return {
        ...state,
        maintenance: state.maintenance.map(m => 
          m.id === action.payload.id ? action.payload : m
        )
      };
    case 'DELETE_MAINTENANCE':
      return {
        ...state,
        maintenance: state.maintenance.filter(m => m.id !== action.payload)
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    default:
      return state;
  }
};

const initialState = {
  maintenance: [],
  loading: true,
  error: null
};

export const MaintenanceProvider = ({ children }) => {
  const [state, dispatch] = useReducer(maintenanceReducer, initialState);
  const { success, error } = useNotification();

  // Load initial data from localStorage
  useEffect(() => {
    const maintenanceData = getFromLocalStorage(LOCAL_STORAGE_KEYS.MAINTENANCE);
    dispatch({ type: 'SET_MAINTENANCE', payload: maintenanceData });
  }, []);

  // Save data whenever it changes
  useEffect(() => {
    if (!state.loading && state.maintenance) {
    saveToLocalStorage(LOCAL_STORAGE_KEYS.MAINTENANCE, state.maintenance);
    }
  }, [state.maintenance, state.loading]);

  const addMaintenance = useCallback((maintenanceData) => {
    try {
      const newMaintenance = {
        ...maintenanceData,
        id: generateId('m_'),
        createdDate: new Date().toISOString()
      };

      const updatedMaintenanceList = [...state.maintenance, newMaintenance];
      saveToLocalStorage(LOCAL_STORAGE_KEYS.MAINTENANCE, updatedMaintenanceList);
      dispatch({ type: 'ADD_MAINTENANCE', payload: newMaintenance });

      success(
        NOTIFICATION_TYPES.MAINTENANCE_SCHEDULED,
        'Maintenance Scheduled',
        `Maintenance for ${maintenanceData.equipmentName} has been scheduled`
      );

      return { success: true, maintenance: newMaintenance };
    } catch (err) {
      console.error('Error adding maintenance:', err);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add maintenance record' });
      return { success: false, error: 'Failed to add maintenance record' };
    }
  }, [state.maintenance, success]);

  const updateMaintenance = useCallback((id, maintenanceData) => {
    try {
      const updatedMaintenance = { id, ...maintenanceData };
      const updatedMaintenanceList = state.maintenance.map(m => 
        m.id === id ? updatedMaintenance : m
      );
      saveToLocalStorage(LOCAL_STORAGE_KEYS.MAINTENANCE, updatedMaintenanceList);
      dispatch({ type: 'UPDATE_MAINTENANCE', payload: updatedMaintenance });
      return { success: true };
    } catch (err) {
      console.error('Error updating maintenance:', err);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update maintenance record' });
      return { success: false, error: 'Failed to update maintenance record' };
    }
  }, [state.maintenance]);

  const deleteMaintenance = useCallback((id) => {
    try {
      const updatedMaintenanceList = state.maintenance.filter(m => m.id !== id);
      saveToLocalStorage(LOCAL_STORAGE_KEYS.MAINTENANCE, updatedMaintenanceList);
      dispatch({ type: 'DELETE_MAINTENANCE', payload: id });
      return { success: true };
    } catch (err) {
      console.error('Error deleting maintenance:', err);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete maintenance record' });
      return { success: false, error: 'Failed to delete maintenance record' };
    }
  }, [state.maintenance]);

  const getMaintenanceById = useCallback((id) => {
    return state.maintenance.find(m => m.id === id);
  }, [state.maintenance]);

  const getMaintenanceByEquipment = useCallback((equipmentId) => {
    return state.maintenance.filter(m => m.equipmentId === equipmentId);
  }, [state.maintenance]);

  const getUpcomingMaintenance = useCallback(() => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return state.maintenance.filter(m => {
      const maintenanceDate = new Date(m.date);
      return maintenanceDate >= today && maintenanceDate <= nextWeek;
    });
  }, [state.maintenance]);

  const value = {
    maintenance: state.maintenance,
    loading: state.loading,
    error: state.error,
    addMaintenance,
    updateMaintenance,
    deleteMaintenance,
    getMaintenanceById,
    getMaintenanceByEquipment,
    getUpcomingMaintenance
  };

  return (
    <MaintenanceContext.Provider value={value}>
      {children}
    </MaintenanceContext.Provider>
  );
};

export const useMaintenance = () => {
  const context = useContext(MaintenanceContext);
  if (!context) {
    throw new Error('useMaintenance must be used within a MaintenanceProvider');
  }
  return context;
};
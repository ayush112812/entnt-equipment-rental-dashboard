import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { LOCAL_STORAGE_KEYS, EQUIPMENT_STATUS, NOTIFICATION_TYPES } from '../utils/constants';
import { getFromLocalStorage, saveToLocalStorage, generateId } from '../utils/localStorageUtils';
import { useNotification } from './NotificationContext';

const EquipmentContext = createContext();

const equipmentReducer = (state, action) => {
  switch (action.type) {
    case 'SET_EQUIPMENT':
      return {
        ...state,
        equipment: action.payload,
        loading: false
      };
    case 'ADD_EQUIPMENT':
      return {
        ...state,
        equipment: [...state.equipment, action.payload]
      };
    case 'UPDATE_EQUIPMENT':
      return {
        ...state,
        equipment: state.equipment.map(eq => 
          eq.id === action.payload.id ? action.payload : eq
        )
      };
    case 'DELETE_EQUIPMENT':
      return {
        ...state,
        equipment: state.equipment.filter(eq => eq.id !== action.payload)
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
  equipment: [],
  loading: true,
  error: null
};

export const EquipmentProvider = ({ children }) => {
  const [state, dispatch] = useReducer(equipmentReducer, initialState);
  const { success, error } = useNotification();

  React.useEffect(() => {
    const equipment = getFromLocalStorage(LOCAL_STORAGE_KEYS.EQUIPMENT);
    dispatch({ type: 'SET_EQUIPMENT', payload: equipment });
  }, []);

  React.useEffect(() => {
    saveToLocalStorage(LOCAL_STORAGE_KEYS.EQUIPMENT, state.equipment);
  }, [state.equipment]);

  const addEquipment = useCallback((equipmentData) => {
    try {
      const newEquipment = {
        ...equipmentData,
        id: generateId('eq_'),
        dateAdded: new Date().toISOString().split('T')[0],
        status: equipmentData.status || EQUIPMENT_STATUS.AVAILABLE
      };

      const updatedEquipment = [...state.equipment, newEquipment];
      saveToLocalStorage(LOCAL_STORAGE_KEYS.EQUIPMENT, updatedEquipment);
      dispatch({ type: 'ADD_EQUIPMENT', payload: newEquipment });

      success(
        NOTIFICATION_TYPES.EQUIPMENT_ADDED,
        'Equipment Added',
        `${newEquipment.name} has been added to the inventory`
      );

      return { success: true, equipment: newEquipment };
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add equipment' });
      return { success: false, error: 'Failed to add equipment' };
    }
  }, [state.equipment, success]);

  const updateEquipment = useCallback((id, equipmentData) => {
    try {
      const updatedEquipment = state.equipment.map(eq => 
        eq.id === id ? { ...eq, ...equipmentData } : eq
      );
      
      saveToLocalStorage(LOCAL_STORAGE_KEYS.EQUIPMENT, updatedEquipment);
      dispatch({ type: 'UPDATE_EQUIPMENT', payload: { id, ...equipmentData } });

      return { success: true };
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update equipment' });
      return { success: false, error: 'Failed to update equipment' };
    }
  }, [state.equipment]);

  const deleteEquipment = useCallback((id) => {
    try {
      const updatedEquipment = state.equipment.filter(eq => eq.id !== id);
      saveToLocalStorage(LOCAL_STORAGE_KEYS.EQUIPMENT, updatedEquipment);
      dispatch({ type: 'DELETE_EQUIPMENT', payload: id });

      return { success: true };
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete equipment' });
      return { success: false, error: 'Failed to delete equipment' };
    }
  }, [state.equipment]);

  const getEquipmentById = useCallback((id) => {
    return state.equipment.find(eq => eq.id === id);
  }, [state.equipment]);

  const getAvailableEquipment = useCallback(() => {
    return state.equipment.filter(eq => eq.status === EQUIPMENT_STATUS.AVAILABLE);
  }, [state.equipment]);

  const getEquipmentByCategory = useCallback((category) => {
    return state.equipment.filter(eq => eq.category === category);
  }, [state.equipment]);

  const value = {
    equipment: state.equipment,
    loading: state.loading,
    error: state.error,
    addEquipment,
    updateEquipment,
    deleteEquipment,
    getEquipmentById,
    getAvailableEquipment,
    getEquipmentByCategory
  };

  return (
    <EquipmentContext.Provider value={value}>
      {children}
    </EquipmentContext.Provider>
  );
};

export const useEquipment = () => {
  const context = useContext(EquipmentContext);
  if (!context) {
    throw new Error('useEquipment must be used within an EquipmentProvider');
  }
  return context;
};

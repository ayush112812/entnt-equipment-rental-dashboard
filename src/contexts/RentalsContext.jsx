import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { LOCAL_STORAGE_KEYS, RENTAL_STATUS, NOTIFICATION_TYPES } from '../utils/constants';
import { getFromLocalStorage, saveToLocalStorage, generateId } from '../utils/localStorageUtils';
import { getDaysBetween, isDatePast } from '../utils/dateUtils';
import { useNotification } from './NotificationContext';

const RentalsContext = createContext();

const rentalsReducer = (state, action) => {
  switch (action.type) {
    case 'SET_RENTALS':
      return {
        ...state,
        rentals: action.payload,
        loading: false
      };
    case 'ADD_RENTAL':
      return {
        ...state,
        rentals: [...state.rentals, action.payload]
      };
    case 'UPDATE_RENTAL':
      return {
        ...state,
        rentals: state.rentals.map(rental => 
          rental.id === action.payload.id ? action.payload : rental
        )
      };
    case 'DELETE_RENTAL':
      return {
        ...state,
        rentals: state.rentals.filter(rental => rental.id !== action.payload)
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
  rentals: [],
  loading: true,
  error: null
};

export const RentalsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(rentalsReducer, initialState);
  const { success, error } = useNotification();

  // Load initial data from localStorage
  useEffect(() => {
    const rentalsData = getFromLocalStorage(LOCAL_STORAGE_KEYS.RENTALS);
    dispatch({ type: 'SET_RENTALS', payload: rentalsData });
  }, []);

  React.useEffect(() => {
    saveToLocalStorage(LOCAL_STORAGE_KEYS.RENTALS, state.rentals);
  }, [state.rentals]);

  const addRental = useCallback((rentalData) => {
    try {
      const days = getDaysBetween(rentalData.startDate, rentalData.endDate);
      const newRental = {
        ...rentalData,
        id: generateId('r_'),
        createdDate: new Date().toISOString(),
        totalCost: rentalData.dailyRate * days,
        status: rentalData.status || RENTAL_STATUS.RESERVED
      };

      const updatedRentals = [...state.rentals, newRental];
      saveToLocalStorage(LOCAL_STORAGE_KEYS.RENTALS, updatedRentals);
      dispatch({ type: 'ADD_RENTAL', payload: newRental });

      success(
        NOTIFICATION_TYPES.RENTAL_CREATED,
        'New Rental Created',
        `Rental for ${newRental.equipmentName} has been created`
      );

      return { success: true, rental: newRental };
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to create rental' });
      return { success: false, error: 'Failed to create rental' };
    }
  }, [state.rentals, success]);

  const updateRental = useCallback((id, rentalData) => {
    try {
      const existingRental = state.rentals.find(r => r.id === id);
      if (!existingRental) {
        return { success: false, error: 'Rental not found' };
      }

      const updatedRental = { ...existingRental, ...rentalData };
      
      const updatedRentals = state.rentals.map(rental => 
        rental.id === id ? updatedRental : rental
      );
      
      saveToLocalStorage(LOCAL_STORAGE_KEYS.RENTALS, updatedRentals);
      dispatch({ type: 'UPDATE_RENTAL', payload: updatedRental });

      // Add notification for status changes
      if (rentalData.status && rentalData.status !== existingRental.status) {
        if (rentalData.status === RENTAL_STATUS.RETURNED) {
          success(
            NOTIFICATION_TYPES.RENTAL_RETURNED,
            'Rental Returned',
            `${existingRental.equipmentName} has been returned`
          );
        }
      }

      return { success: true };
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update rental' });
      return { success: false, error: 'Failed to update rental' };
    }
  }, [state.rentals, success]);

  const deleteRental = useCallback((id) => {
    try {
      const updatedRentals = state.rentals.filter(rental => rental.id !== id);
      saveToLocalStorage(LOCAL_STORAGE_KEYS.RENTALS, updatedRentals);
      dispatch({ type: 'DELETE_RENTAL', payload: id });

      return { success: true };
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete rental' });
      return { success: false, error: 'Failed to delete rental' };
    }
  }, [state.rentals]);

  const getRentalById = useCallback((id) => {
    return state.rentals.find(rental => rental.id === id);
  }, [state.rentals]);

  const getRentalsByCustomer = useCallback((customerId) => {
    return state.rentals.filter(rental => rental.customerId === customerId);
  }, [state.rentals]);

  const getRentalsByEquipment = useCallback((equipmentId) => {
    return state.rentals.filter(rental => rental.equipmentId === equipmentId);
  }, [state.rentals]);

  const getOverdueRentals = useCallback(() => {
    return state.rentals.filter(rental => 
      rental.status === RENTAL_STATUS.RENTED && isDatePast(rental.endDate)
    );
  }, [state.rentals]);

  const getActiveRentals = useCallback(() => {
    return state.rentals.filter(rental => 
      rental.status === RENTAL_STATUS.RENTED || rental.status === RENTAL_STATUS.RESERVED
    );
  }, [state.rentals]);

  const value = {
    rentals: state.rentals,
    loading: state.loading,
    error: state.error,
    addRental,
    updateRental,
    deleteRental,
    getRentalById,
    getRentalsByCustomer,
    getRentalsByEquipment,
    getOverdueRentals,
    getActiveRentals
  };

  return (
    <RentalsContext.Provider value={value}>
      {children}
    </RentalsContext.Provider>
  );
};

export const useRentals = () => {
  const context = useContext(RentalsContext);
  if (!context) {
    throw new Error('useRentals must be used within a RentalsProvider');
  }
  return context;
};

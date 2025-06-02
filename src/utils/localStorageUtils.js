import { LOCAL_STORAGE_KEYS, MOCK_DATA } from './constants';

export const initializeLocalStorage = () => {
  // Check if data already exists
  const existingUsers = localStorage.getItem(LOCAL_STORAGE_KEYS.USERS);
  
  if (!existingUsers) {
    // Initialize with mock data
    localStorage.setItem(LOCAL_STORAGE_KEYS.USERS, JSON.stringify(MOCK_DATA.users));
    localStorage.setItem(LOCAL_STORAGE_KEYS.EQUIPMENT, JSON.stringify(MOCK_DATA.equipment));
    localStorage.setItem(LOCAL_STORAGE_KEYS.RENTALS, JSON.stringify(MOCK_DATA.rentals));
    localStorage.setItem(LOCAL_STORAGE_KEYS.MAINTENANCE, JSON.stringify(MOCK_DATA.maintenance));
    localStorage.setItem(LOCAL_STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(MOCK_DATA.notifications));
  }
};

export const getFromLocalStorage = (key) => {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      // If no data exists, return mock data for the key
      switch (key) {
        case LOCAL_STORAGE_KEYS.USERS:
          return MOCK_DATA.users;
        case LOCAL_STORAGE_KEYS.EQUIPMENT:
          return MOCK_DATA.equipment;
        case LOCAL_STORAGE_KEYS.RENTALS:
          return MOCK_DATA.rentals;
        case LOCAL_STORAGE_KEYS.MAINTENANCE:
          return MOCK_DATA.maintenance;
        case LOCAL_STORAGE_KEYS.NOTIFICATIONS:
          return MOCK_DATA.notifications;
        default:
          return [];
      }
    }
    const parsedData = JSON.parse(item);
    
    // For these specific keys, ensure default items are preserved
    if ([LOCAL_STORAGE_KEYS.EQUIPMENT, LOCAL_STORAGE_KEYS.RENTALS, LOCAL_STORAGE_KEYS.MAINTENANCE].includes(key)) {
      return ensureDefaultItems(key, parsedData);
    }
    
    return parsedData;
  } catch (error) {
    console.error(`Error reading from localStorage: ${key}`, error);
    return getDefaultItems(key); // Return default items on error
  }
};

export const saveToLocalStorage = (key, data) => {
  try {
    // Ensure default items are preserved for equipment, rentals, and maintenance
    const itemsToSave = [LOCAL_STORAGE_KEYS.EQUIPMENT, LOCAL_STORAGE_KEYS.RENTALS, LOCAL_STORAGE_KEYS.MAINTENANCE].includes(key)
      ? ensureDefaultItems(key, data)
      : data;
    
    localStorage.setItem(key, JSON.stringify(itemsToSave));
    return true;
  } catch (error) {
    console.error(`Error saving to localStorage: ${key}`, error);
    return false;
  }
};

export const removeFromLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing from localStorage: ${key}`, error);
    return false;
  }
};

export const clearAllData = () => {
  // First clear all data
  Object.values(LOCAL_STORAGE_KEYS).forEach(key => {
    if (key === LOCAL_STORAGE_KEYS.USERS) {
      // For users, reset to mock data
      localStorage.setItem(key, JSON.stringify(MOCK_DATA.users));
    } else if ([LOCAL_STORAGE_KEYS.EQUIPMENT, LOCAL_STORAGE_KEYS.RENTALS, LOCAL_STORAGE_KEYS.MAINTENANCE].includes(key)) {
      // For these, preserve default items
      localStorage.setItem(key, JSON.stringify(getDefaultItems(key)));
    } else {
      // For others, just remove
    localStorage.removeItem(key);
    }
  });
};

// Function to explicitly reset to mock data
export const resetToMockData = () => {
  // Save mock data to localStorage
  localStorage.setItem(LOCAL_STORAGE_KEYS.USERS, JSON.stringify(MOCK_DATA.users));
  localStorage.setItem(LOCAL_STORAGE_KEYS.EQUIPMENT, JSON.stringify(MOCK_DATA.equipment));
  localStorage.setItem(LOCAL_STORAGE_KEYS.RENTALS, JSON.stringify(MOCK_DATA.rentals));
  localStorage.setItem(LOCAL_STORAGE_KEYS.MAINTENANCE, JSON.stringify(MOCK_DATA.maintenance));
  localStorage.setItem(LOCAL_STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(MOCK_DATA.notifications));
};

// Utility functions for specific data operations
export const generateId = (prefix = '') => {
  return `${prefix}${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Function to get default items that should always be preserved
export const getDefaultItems = (key) => {
  switch (key) {
    case LOCAL_STORAGE_KEYS.EQUIPMENT:
      return MOCK_DATA.equipment.slice(0, 6); // Keep first 6 equipment items as default
    case LOCAL_STORAGE_KEYS.RENTALS:
      return MOCK_DATA.rentals.slice(0, 4); // Keep first 4 rentals as default
    case LOCAL_STORAGE_KEYS.MAINTENANCE:
      return MOCK_DATA.maintenance.slice(0, 3); // Keep first 3 maintenance records as default
    default:
      return [];
  }
};

// Function to ensure default items are preserved
export const ensureDefaultItems = (key, currentItems) => {
  const defaultItems = getDefaultItems(key);
  const defaultIds = defaultItems.map(item => item.id);
  const nonDefaultItems = currentItems.filter(item => !defaultIds.includes(item.id));
  return [...defaultItems, ...nonDefaultItems];
};

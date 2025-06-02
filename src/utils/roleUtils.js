import { USER_ROLES } from './constants';

export const hasPermission = (userRole, requiredRoles) => {
  if (!userRole || !requiredRoles) return false;
  
  if (Array.isArray(requiredRoles)) {
    return requiredRoles.includes(userRole);
  }
  
  return userRole === requiredRoles;
};

export const isAdmin = (userRole) => {
  return userRole === USER_ROLES.ADMIN;
};

export const isStaff = (userRole) => {
  return userRole === USER_ROLES.STAFF;
};

export const isCustomer = (userRole) => {
  return userRole === USER_ROLES.CUSTOMER;
};

export const canManageEquipment = (userRole) => {
  return hasPermission(userRole, [USER_ROLES.ADMIN, USER_ROLES.STAFF]);
};

export const canManageRentals = (userRole) => {
  return hasPermission(userRole, [USER_ROLES.ADMIN, USER_ROLES.STAFF]);
};

export const canManageMaintenance = (userRole) => {
  return hasPermission(userRole, [USER_ROLES.ADMIN, USER_ROLES.STAFF]);
};

export const canViewAllRentals = (userRole) => {
  return hasPermission(userRole, [USER_ROLES.ADMIN, USER_ROLES.STAFF]);
};

export const canCreateRental = (userRole) => {
  return hasPermission(userRole, [USER_ROLES.ADMIN, USER_ROLES.STAFF, USER_ROLES.CUSTOMER]);
};

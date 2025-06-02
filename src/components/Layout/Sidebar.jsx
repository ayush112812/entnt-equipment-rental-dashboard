import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  useTheme,
  alpha
} from '@mui/material';
import {
  Dashboard,
  Construction,
  Assignment,
  Build,
  Person
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { canManageEquipment, canManageRentals, canManageMaintenance, USER_ROLES } from '../../utils/roleUtils';
import { DRAWER_WIDTH } from '../../utils/constants';

const Sidebar = ({ onClose }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const handleNavigation = (path) => {
    navigate(path);
    if (onClose) onClose();
  };

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <Dashboard />,
      path: '/dashboard'
    },
    ...(canManageEquipment(user?.role) ? [{
      text: 'Equipment',
      icon: <Construction />,
      path: '/equipment'
    }] : []),
    ...(canManageRentals(user?.role) ? [{
      text: 'Rentals',
      icon: <Assignment />,
      path: '/rentals'
    }] : []),
    ...(canManageMaintenance(user?.role) ? [{
      text: 'Maintenance',
      icon: <Build />,
      path: '/maintenance'
    }] : []),
    {
      text: 'Profile',
      icon: <Person />,
      path: '/profile'
    }
  ];

  return (
    <Box sx={{ width: DRAWER_WIDTH }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        padding: theme.spacing(2),
        justifyContent: 'space-between',
        px: [1],
      }}>
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 600 }}>
          ENTNT
        </Typography>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              selected={location.pathname === item.path}
              sx={{
                mx: 1,
                borderRadius: 1,
                mb: 0.5,
                '&.Mui-selected': {
                  backgroundColor: theme.palette.primary.main,
                  color: 'white',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                  },
                },
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                },
              }}
            >
              <ListItemIcon sx={{ 
                minWidth: 40,
                color: location.pathname === item.path ? 'white' : 'inherit'
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;

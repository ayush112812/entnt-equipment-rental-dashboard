import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Drawer,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  AccountCircle,
  Logout
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import NotificationCenter from '../Notifications/NotificationCenter';

const Header = ({ onMenuClick, isMobile }) => {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const { user, logout } = useAuth();
  const { notifications } = useNotification();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationDrawer, setNotificationDrawer] = useState(false);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
  };

  return (
    <>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={onMenuClick}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography 
            variant={isSmallMobile ? "h6" : "h5"} 
            noWrap 
            component="div" 
            sx={{ 
              flexGrow: 1,
              fontSize: isSmallMobile ? '1rem' : '1.25rem'
            }}
          >
            {isSmallMobile ? 'ENTNT' : 'ENTNT Equipment Rental'}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: isSmallMobile ? 0.5 : 1 }}>
            <IconButton
              color="inherit"
              onClick={() => setNotificationDrawer(true)}
            >
              <Badge badgeContent={notifications.length} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            <IconButton
              size={isSmallMobile ? "small" : "large"}
              edge="end"
              aria-label="account of current user"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <Avatar sx={{ width: isSmallMobile ? 28 : 32, height: isSmallMobile ? 28 : 32 }}>
                {user?.name?.charAt(0) || user?.email?.charAt(0)}
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem disabled>
          <Typography variant="body2">
            {user?.name || user?.email}
          </Typography>
        </MenuItem>
        <MenuItem disabled>
          <Typography variant="caption" color="textSecondary">
            {user?.role}
          </Typography>
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <Logout fontSize="small" sx={{ mr: 1 }} />
          Logout
        </MenuItem>
      </Menu>

      <Drawer
        anchor="right"
        open={notificationDrawer}
        onClose={() => setNotificationDrawer(false)}
      >
        <Box sx={{ 
          width: isSmallMobile ? '100vw' : isTablet ? 350 : 400, 
          p: isSmallMobile ? 1 : 2 
        }}>
          <NotificationCenter />
        </Box>
      </Drawer>
    </>
  );
};

export default Header;

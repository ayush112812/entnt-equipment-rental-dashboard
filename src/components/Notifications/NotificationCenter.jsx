import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Close as CloseIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  CheckCircle as SuccessIcon
} from '@mui/icons-material';
import { useNotification } from '../../contexts/NotificationContext';

const NotificationCenter = ({ onClose }) => {
  const theme = useTheme();
  const { notifications, removeNotification } = useNotification();

  const getIcon = (type) => {
    switch (type) {
      case 'warning':
        return <WarningIcon sx={{ color: theme.palette.warning.main }} />;
      case 'success':
        return <SuccessIcon sx={{ color: theme.palette.success.main }} />;
      case 'error':
        return <WarningIcon sx={{ color: theme.palette.error.main }} />;
      default:
        return <InfoIcon sx={{ color: theme.palette.info.main }} />;
    }
  };

  const handleRemove = (id) => {
    removeNotification(id);
  };

  if (notifications.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <NotificationsIcon 
          sx={{ 
            fontSize: 48, 
            color: alpha(theme.palette.text.secondary, 0.2),
            mb: 1
          }} 
        />
        <Typography color="text.secondary">
          No new notifications
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        borderBottom: `1px solid ${theme.palette.divider}`
      }}>
        <Typography variant="h6">Notifications</Typography>
        {onClose && (
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        )}
      </Box>
      <List sx={{ p: 0 }}>
        {notifications.map((notification, index) => (
          <React.Fragment key={notification.id}>
            <ListItem
              sx={{
                py: 2,
                px: 2,
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.04)
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {getIcon(notification.type)}
              </ListItemIcon>
              <ListItemText
                primary={notification.title}
                secondary={notification.message}
                primaryTypographyProps={{
                  variant: 'subtitle2',
                  gutterBottom: true
                }}
                secondaryTypographyProps={{
                  variant: 'body2',
                  color: 'text.secondary'
                }}
              />
              <IconButton 
                edge="end" 
                size="small"
                onClick={() => handleRemove(notification.id)}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </ListItem>
            {index < notifications.length - 1 && (
              <Divider component="li" />
            )}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default NotificationCenter; 
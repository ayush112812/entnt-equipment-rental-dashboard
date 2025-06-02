import React from 'react';
import { List, ListItem, ListItemText, ListItemIcon, Divider, Box, Typography, Chip } from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import BuildIcon from '@mui/icons-material/Build';
import { format } from 'date-fns';

const RecentActivityList = ({ rentals, maintenance, limit = 5 }) => {
  // Combine and sort activities (rentals and maintenance) by date
  const getActivityDate = item => {
    if ('startDate' in item) return new Date(item.startDate); // Rental
    return new Date(item.date); // Maintenance
  };
  
  const activities = [
    ...rentals.map(rental => ({ 
      ...rental, 
      type: 'rental',
      activityDate: rental.startDate
    })),
    ...maintenance.map(maint => ({ 
      ...maint, 
      type: 'maintenance',
      activityDate: maint.date
    }))
  ]
    .sort((a, b) => new Date(b.activityDate) - new Date(a.activityDate))
    .slice(0, limit);
  
  const getActivityDescription = (activity) => {
    if (activity.type === 'rental') {
      return `Rental: ${activity.equipmentName} by ${activity.customerName}`;
    } else {
      return `Maintenance: ${activity.equipmentName} - ${activity.type}`;
    }
  };
  
  const getStatusChip = (activity) => {
    if (activity.type === 'rental') {
      const colorMap = {
        'Reserved': 'info',
        'Rented': 'primary',
        'Returned': 'success',
        'Overdue': 'error',
        'Cancelled': 'default'
      };
      
      return (
        <Chip 
          label={activity.status} 
          color={colorMap[activity.status] || 'default'}
          size="small"
        />
      );
    }
    return null;
  };
  
  return (
    <Box>
      {activities.length > 0 ? (
        <List>
          {activities.map((activity, index) => (
            <React.Fragment key={activity.id}>
              {index > 0 && <Divider />}
              <ListItem 
                secondaryAction={getStatusChip(activity)}
              >
                <ListItemIcon>
                  {activity.type === 'rental' ? <InventoryIcon /> : <BuildIcon />}
                </ListItemIcon>
                <ListItemText
                  primary={getActivityDescription(activity)}
                  secondary={format(new Date(activity.activityDate), 'MMM dd, yyyy')}
                />
              </ListItem>
            </React.Fragment>
          ))}
        </List>
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
          No activity to display
        </Typography>
      )}
    </Box>
  );
};

export default RecentActivityList;

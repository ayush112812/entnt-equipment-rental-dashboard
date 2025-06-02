import React from 'react';
import { List, ListItem, ListItemText, ListItemIcon, Divider, Box, Typography } from '@mui/material';
import BuildIcon from '@mui/icons-material/Build';
import { format } from 'date-fns';

const MaintenanceScheduleCard = ({ maintenance }) => {
  // Sort maintenance by date and filter to show only upcoming
  const upcomingMaintenance = maintenance
    .filter(item => new Date(item.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5); // Limit to 5 items
  
  return (
    <Box>
      {upcomingMaintenance.length > 0 ? (
        <List>
          {upcomingMaintenance.map((item, index) => (
            <React.Fragment key={item.id}>
              {index > 0 && <Divider />}
              <ListItem>
                <ListItemIcon>
                  <BuildIcon />
                </ListItemIcon>
                <ListItemText
                  primary={item.equipmentName}
                  secondary={`${format(new Date(item.date), 'MMM dd, yyyy')} - ${item.type}`}
                />
              </ListItem>
            </React.Fragment>
          ))}
        </List>
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
          No upcoming maintenance scheduled
        </Typography>
      )}
    </Box>
  );
};

export default MaintenanceScheduleCard;

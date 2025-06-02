import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Divider
} from '@mui/material';
import {
  Warning as WarningIcon,
  Build as MaintenanceIcon,
  Assignment as RentalIcon
} from '@mui/icons-material';
import { formatDate } from '../../utils/dateUtils';
import { RENTAL_STATUS } from '../../utils/constants';

const DashboardOverview = ({ rentals, maintenance }) => {
  // Get overdue rentals
  const overdueRentals = rentals.filter(rental => {
    if (rental.status !== RENTAL_STATUS.RENTED) return false;
    return new Date(rental.endDate) < new Date();
  }).slice(0, 5); // Show only first 5

  // Get upcoming maintenance
  const upcomingMaintenance = maintenance.filter(m => {
    const maintenanceDate = new Date(m.date);
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return maintenanceDate >= today && maintenanceDate <= nextWeek;
  }).slice(0, 5); // Show only first 5

  // Get recent rentals
  const recentRentals = [...rentals]
    .sort((a, b) => new Date(b.createdDate || b.startDate) - new Date(a.createdDate || a.startDate))
    .slice(0, 5); // Show only first 5

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Dashboard Overview
      </Typography>

      {/* Overdue Rentals Alert */}
      {overdueRentals.length > 0 && (
        <Card sx={{ mb: 3, borderLeft: '4px solid #f44336' }}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <WarningIcon color="error" sx={{ mr: 1 }} />
              <Typography variant="h6" color="error">
                Overdue Rentals ({overdueRentals.length})
              </Typography>
            </Box>
            
            <List dense>
              {overdueRentals.map((rental) => (
                <ListItem key={rental.id}>
                  <ListItemText
                    primary={`${rental.equipmentName} - ${rental.customerName}`}
                    secondary={`Due: ${formatDate(rental.endDate)}`}
                  />
                  <Chip label="OVERDUE" color="error" size="small" />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}

      {/* Upcoming Maintenance */}
      {upcomingMaintenance.length > 0 && (
        <Card sx={{ mb: 3, borderLeft: '4px solid #ff9800' }}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <MaintenanceIcon color="warning" sx={{ mr: 1 }} />
              <Typography variant="h6" color="warning">
                Upcoming Maintenance ({upcomingMaintenance.length})
              </Typography>
            </Box>
            
            <List dense>
              {upcomingMaintenance.map((m) => (
                <ListItem key={m.id}>
                  <ListItemText
                    primary={`${m.equipmentName} - ${m.type}`}
                    secondary={`Scheduled: ${formatDate(m.date)}`}
                  />
                  {m.technician && (
                    <Chip label={m.technician} size="small" variant="outlined" />
                  )}
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      <Card>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <RentalIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6">
              Recent Rentals
            </Typography>
          </Box>
          
          {recentRentals.length > 0 ? (
            <List>
              {recentRentals.map((rental, index) => (
                <Box key={rental.id}>
                  <ListItem>
                    <ListItemText
                      primary={`${rental.equipmentName} - ${rental.customerName}`}
                      secondary={`${formatDate(rental.startDate)} to ${formatDate(rental.endDate)}`}
                    />
                    <Chip 
                      label={rental.status} 
                      size="small" 
                      color={rental.status === RENTAL_STATUS.RENTED ? 'success' : 'primary'}
                    />
                  </ListItem>
                  {index < recentRentals.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No recent rental activity
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default DashboardOverview;

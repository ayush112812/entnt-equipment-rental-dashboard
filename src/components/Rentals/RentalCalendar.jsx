import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  IconButton,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  Chip
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  Close as CloseIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';

import { formatDate, isDateToday } from '../../utils/dateUtils';
import { RENTAL_STATUS } from '../../utils/constants';

const RentalCalendar = ({ rentals }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedRentals, setSelectedRentals] = useState([]);

  const theme = useTheme();

  // Get calendar data for current month
  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    // Create calendar grid
    const weeks = [];
    let currentWeek = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      currentWeek.push(null);
    }
    
    // Add days of month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateString = date.toISOString().split('T')[0];
      
      // Find rentals for this date
      const dayRentals = rentals.filter(rental => {
        const start = new Date(rental.startDate);
        const end = new Date(rental.endDate);
        return date >= start && date <= end;
      });
      
      currentWeek.push({
        day,
        date: dateString,
        rentals: dayRentals,
        isToday: isDateToday(date)
      });
      
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }
    
    // Add remaining empty cells
    while (currentWeek.length < 7 && currentWeek.length > 0) {
      currentWeek.push(null);
    }
    
    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }
    
    return weeks;
  }, [currentDate, rentals]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (dayData) => {
    if (dayData && dayData.rentals.length > 0) {
      setSelectedDate(dayData.date);
      setSelectedRentals(dayData.rentals);
    }
  };

  const handleCloseDialog = () => {
    setSelectedDate(null);
    setSelectedRentals([]);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case RENTAL_STATUS.RESERVED:
        return '#2196f3';
      case RENTAL_STATUS.RENTED:
        return '#4caf50';
      case RENTAL_STATUS.OVERDUE:
        return '#f44336';
      default:
        return '#9e9e9e';
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Box sx={{ 
      maxWidth: '100%', 
      overflow: 'hidden',
      width: '100%'
    }}>
      <Paper 
        sx={{ 
          p: { xs: 2, md: 3 },
          borderRadius: 2,
          background: `linear-gradient(to bottom right, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
          boxShadow: theme.shadows[1],
          maxWidth: '100%',
          width: '100%'
        }}
      >
        {/* Calendar Header */}
        <Box 
          display="flex" 
          justifyContent="space-between" 
          alignItems="center" 
          mb={4}
          sx={{
            background: theme.palette.background.paper,
            borderRadius: 2,
            p: { xs: 1.5, md: 2 },
            border: `1px solid ${theme.palette.divider}`,
            width: '100%'
          }}
        >
          <IconButton 
            onClick={handlePrevMonth}
            sx={{ 
              '&:hover': { 
                backgroundColor: theme.palette.action.hover,
                transform: 'scale(1.1)'
              },
              transition: 'all 0.2s'
            }}
          >
            <ChevronLeft />
          </IconButton>
          
          <Typography variant="h5" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </Typography>
          
          <IconButton 
            onClick={handleNextMonth}
            sx={{ 
              '&:hover': { 
                backgroundColor: theme.palette.action.hover,
                transform: 'scale(1.1)'
              },
              transition: 'all 0.2s'
            }}
          >
            <ChevronRight />
          </IconButton>
        </Box>

        {/* Calendar Container */}
        <Box sx={{ width: '100%', overflow: 'auto', px: { xs: 1, md: 2 } }}>
          {/* Day Headers */}
          <Grid container spacing={2} sx={{ mb: 2, minWidth: 900, width: '100%' }}>
            {dayNames.map((day) => (
              <Grid item xs key={day} sx={{ flex: 1 }}>
                <Box 
                  textAlign="center" 
                  py={1.5}
                  sx={{
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: 1,
                    border: `1px solid ${theme.palette.divider}`,
                    minHeight: '48px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    boxShadow: theme.shadows[1]
                  }}
                >
                  <Typography 
                    variant="subtitle1" 
                    fontWeight="600"
                    color="text.primary"
                  >
                    {day}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

          {/* Calendar Grid */}
          <Box sx={{ minWidth: 900, width: '100%' }}>
            {calendarData.map((week, weekIndex) => (
              <Grid container spacing={2} key={weekIndex} sx={{ mb: 2, width: '100%' }}>
                {week.map((dayData, dayIndex) => (
                  <Grid item xs key={dayIndex} sx={{ flex: 1 }}>
                    <Paper
                      elevation={dayData ? 1 : 0}
                      sx={{
                        minHeight: { xs: 120, md: 150 },
                        height: '100%',
                        p: 2,
                        cursor: dayData?.rentals.length > 0 ? 'pointer' : 'default',
                        backgroundColor: dayData?.isToday 
                          ? alpha(theme.palette.primary.main, 0.1)
                          : theme.palette.background.paper,
                        border: dayData?.isToday 
                          ? `2px solid ${theme.palette.primary.main}` 
                          : `1px solid ${theme.palette.divider}`,
                        borderRadius: 2,
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': dayData?.rentals.length > 0 
                          ? {
                              transform: 'translateY(-2px)',
                              boxShadow: theme.shadows[3],
                              borderColor: theme.palette.primary.main
                            }
                          : {},
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        position: 'relative'
                      }}
                      onClick={() => handleDateClick(dayData)}
                    >
                      {dayData && (
                        <>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              fontWeight: dayData.isToday ? 600 : 500,
                              color: dayData.isToday 
                                ? theme.palette.primary.main 
                                : theme.palette.text.primary,
                              mb: 2,
                              textAlign: 'center'
                            }}
                          >
                            {dayData.day}
                          </Typography>
                          
                          <Box sx={{ flex: 1, overflow: 'auto' }}>
                            {dayData.rentals.slice(0, 3).map((rental, index) => (
                              <Box
                                key={rental.id}
                                sx={{
                                  p: 1,
                                  mb: 1,
                                  backgroundColor: alpha(getStatusColor(rental.status), 0.1),
                                  border: `1px solid ${getStatusColor(rental.status)}`,
                                  borderRadius: 1,
                                  fontSize: '0.875rem',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  minHeight: '32px',
                                  display: 'flex',
                                  alignItems: 'center'
                                }}
                              >
                                <Typography 
                                  variant="body2" 
                                  sx={{ 
                                    color: getStatusColor(rental.status),
                                    fontWeight: 500,
                                    width: '100%',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                  }}
                                >
                                  {rental.equipmentName}
                                </Typography>
                              </Box>
                            ))}
                            
                            {dayData.rentals.length > 3 && (
                              <Typography 
                                variant="caption" 
                                sx={{ 
                                  color: theme.palette.text.secondary,
                                  display: 'block',
                                  textAlign: 'center',
                                  mt: 1,
                                  backgroundColor: alpha(theme.palette.primary.main, 0.05),
                                  borderRadius: 1,
                                  py: 0.75,
                                  fontWeight: 500
                                }}
                              >
                                +{dayData.rentals.length - 3} more
                              </Typography>
                            )}
                          </Box>
                        </>
                      )}
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            ))}
          </Box>
        </Box>

        {/* Legend */}
        <Box 
          mt={4} 
          p={2.5} 
          display="flex" 
          gap={4} 
          flexWrap="wrap"
          justifyContent="center"
          sx={{
            background: theme.palette.background.paper,
            borderRadius: 2,
            border: `1px solid ${theme.palette.divider}`,
            width: '100%'
          }}
        >
          {Object.values(RENTAL_STATUS).map(status => (
            <Box key={status} display="flex" alignItems="center" gap={1.5}>
              <Box 
                sx={{ 
                  width: 20, 
                  height: 20, 
                  backgroundColor: alpha(getStatusColor(status), 0.1),
                  border: `2px solid ${getStatusColor(status)}`,
                  borderRadius: 1 
                }} 
              />
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                {status}
              </Typography>
            </Box>
          ))}
        </Box>
      </Paper>

      {/* Rental Details Dialog */}
      <Dialog 
        open={!!selectedDate} 
        onClose={handleCloseDialog} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            background: `linear-gradient(to bottom right, ${theme.palette.background.paper}, ${theme.palette.background.default})`
          }
        }}
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Rentals for {formatDate(selectedDate)}
            </Typography>
            <IconButton 
              onClick={handleCloseDialog}
              sx={{ 
                '&:hover': { 
                  backgroundColor: alpha(theme.palette.error.main, 0.1),
                  color: theme.palette.error.main
                }
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <List>
            {selectedRentals.map((rental, index) => (
              <ListItem 
                key={rental.id} 
                divider={index < selectedRentals.length - 1}
                sx={{ px: 0 }}
              >
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                      {rental.equipmentName}
                    </Typography>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Customer: {rental.customerName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(rental.startDate)} - {formatDate(rental.endDate)}
                      </Typography>
                      <Box mt={1}>
                        <Chip 
                          label={rental.status} 
                          size="small" 
                          sx={{ 
                            backgroundColor: alpha(getStatusColor(rental.status), 0.1),
                            color: getStatusColor(rental.status),
                            border: `1px solid ${getStatusColor(rental.status)}`,
                            fontWeight: 500
                          }}
                        />
                      </Box>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default RentalCalendar;

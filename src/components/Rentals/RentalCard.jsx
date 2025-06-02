import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  IconButton,
  Divider
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { RENTAL_STATUS } from '../../utils/constants';
import { formatDate, getDaysBetween } from '../../utils/dateUtils';
import { useAuth } from '../../contexts/AuthContext';
import { canManageRentals } from '../../utils/roleUtils';

const RentalCard = ({ rental, onView, onEdit, onDelete }) => {
  const { user } = useAuth();

  const getStatusColor = (status) => {
    switch (status) {
      case RENTAL_STATUS.RESERVED:
        return 'info';
      case RENTAL_STATUS.RENTED:
        return 'success';
      case RENTAL_STATUS.RETURNED:
        return 'default';
      case RENTAL_STATUS.OVERDUE:
        return 'error';
      case RENTAL_STATUS.CANCELLED:
        return 'warning';
      default:
        return 'default';
    }
  };

  const rentalDays = getDaysBetween(rental.startDate, rental.endDate);

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Typography variant="h6" component="h2">
            {rental.equipmentName}
          </Typography>
          <Chip
            label={rental.status}
            color={getStatusColor(rental.status)}
            size="small"
          />
        </Box>
        
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Customer: {rental.customerName}
        </Typography>

        <Divider sx={{ my: 1 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Start Date:
          </Typography>
          <Typography variant="body2">
            {formatDate(rental.startDate)}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            End Date:
          </Typography>
          <Typography variant="body2">
            {formatDate(rental.endDate)}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Duration:
          </Typography>
          <Typography variant="body2">
            {rentalDays} day{rentalDays !== 1 ? 's' : ''}
          </Typography>
        </Box>

        {rental.totalCost && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Typography variant="h6" color="primary">
              Total: ${rental.totalCost}
            </Typography>
          </Box>
        )}

        {rental.notes && (
          <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
            Notes: {rental.notes}
          </Typography>
        )}
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between' }}>
        <Button
          size="small"
          startIcon={<ViewIcon />}
          onClick={() => onView(rental)}
        >
          View
        </Button>

        {canManageRentals(user?.role) && (
          <Box>
            <IconButton
              size="small"
              onClick={() => onEdit(rental)}
              color="primary"
            >
              <EditIcon />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => onDelete(rental)}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        )}
      </CardActions>
    </Card>
  );
};

export default RentalCard;

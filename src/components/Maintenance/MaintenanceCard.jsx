import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Chip,
  useTheme,
  alpha,
  Tooltip
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Build as BuildIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  AttachMoney as CostIcon
} from '@mui/icons-material';
import { formatDate } from '../../utils/formatUtils';
import PropTypes from 'prop-types';

const MaintenanceCard = ({ maintenance = {}, onEdit, onDelete }) => {
  const theme = useTheme();

  // Provide default values for maintenance object
  const {
    id = '',
    equipmentName = 'Unknown Equipment',
    status = 'Unknown',
    type = 'Not Specified',
    date = '',
    technician = 'Not Assigned',
    cost = 0,
    notes = ''
  } = maintenance;

  const getStatusColor = (status) => {
    if (!status) return theme.palette.grey[500];

    switch (status.toLowerCase()) {
      case 'scheduled':
        return theme.palette.info.main;
      case 'in progress':
        return theme.palette.warning.main;
      case 'completed':
        return theme.palette.success.main;
      case 'cancelled':
        return theme.palette.error.main;
      default:
        return theme.palette.grey[500];
    }
  };

  return (
    <Card
      elevation={0}
      sx={{
        border: `1px solid ${theme.palette.divider}`,
        '&:hover': {
          boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.1)}`,
          borderColor: alpha(theme.palette.primary.main, 0.2),
        },
        transition: 'all 0.3s ease',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <CardContent sx={{ flex: 1, p: 2 }}>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              {equipmentName}
            </Typography>
            <Chip
              size="small"
              label={status}
              sx={{
                backgroundColor: alpha(getStatusColor(status), 0.1),
                color: getStatusColor(status),
                fontWeight: 500
              }}
            />
          </Box>
          <Box>
            <Tooltip title="Edit">
              <IconButton 
                size="small" 
                onClick={() => onEdit(maintenance)}
                sx={{ 
                  mr: 1,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1)
                  }
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton 
                size="small"
                onClick={() => onDelete(id)}
                sx={{
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.error.main, 0.1),
                    color: theme.palette.error.main
                  }
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BuildIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {type}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {formatDate(date)}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PersonIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {technician}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CostIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              ${cost}
            </Typography>
          </Box>
        </Box>

        {notes && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Notes: {notes}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

MaintenanceCard.propTypes = {
  maintenance: PropTypes.shape({
    id: PropTypes.string,
    equipmentName: PropTypes.string,
    status: PropTypes.string,
    type: PropTypes.string,
    date: PropTypes.string,
    technician: PropTypes.string,
    cost: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    notes: PropTypes.string
  }),
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default MaintenanceCard; 
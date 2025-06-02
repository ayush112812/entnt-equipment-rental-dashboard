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
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { EQUIPMENT_STATUS, EQUIPMENT_CONDITION } from '../../utils/constants';
import { useAuth } from '../../contexts/AuthContext';
import { canManageEquipment } from '../../utils/roleUtils';

const EquipmentCard = ({ equipment, onView, onEdit, onDelete }) => {
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const getStatusColor = (status) => {
    switch (status) {
      case EQUIPMENT_STATUS.AVAILABLE:
        return 'success';
      case EQUIPMENT_STATUS.RENTED:
        return 'primary';
      case EQUIPMENT_STATUS.MAINTENANCE:
        return 'warning';
      case EQUIPMENT_STATUS.OUT_OF_ORDER:
        return 'error';
      default:
        return 'default';
    }
  };

  const getConditionColor = (condition) => {
    switch (condition) {
      case EQUIPMENT_CONDITION.EXCELLENT:
        return 'success';
      case EQUIPMENT_CONDITION.GOOD:
        return 'primary';
      case EQUIPMENT_CONDITION.FAIR:
        return 'warning';
      case EQUIPMENT_CONDITION.POOR:
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      minHeight: isMobile ? 200 : 250
    }}>
      <CardContent sx={{ flexGrow: 1, p: isMobile ? 1.5 : 2 }}>
        <Typography 
          variant={isMobile ? "subtitle1" : "h6"} 
          component="h2" 
          gutterBottom
          sx={{
            fontSize: isMobile ? '1rem' : '1.25rem',
            lineHeight: 1.2
          }}
        >
          {equipment.name}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {equipment.category}
        </Typography>

        {equipment.description && (
          <Typography 
            variant="body2" 
            sx={{ 
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: isMobile ? 2 : 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {equipment.description}
          </Typography>
        )}

        <Box sx={{ 
          display: 'flex', 
          gap: 1, 
          mb: 2, 
          flexWrap: 'wrap',
          flexDirection: isMobile ? 'column' : 'row'
        }}>
          <Chip
            label={equipment.status}
            color={getStatusColor(equipment.status)}
            size="small"
            sx={{ alignSelf: 'flex-start' }}
          />
          <Chip
            label={equipment.condition}
            color={getConditionColor(equipment.condition)}
            size="small"
            variant="outlined"
            sx={{ alignSelf: 'flex-start' }}
          />
        </Box>

        {equipment.dailyRate && (
          <Typography 
            variant={isMobile ? "subtitle1" : "h6"} 
            color="primary"
            sx={{ fontSize: isMobile ? '1rem' : '1.25rem' }}
          >
            ${equipment.dailyRate}/day
          </Typography>
        )}
      </CardContent>

      <CardActions sx={{ 
        justifyContent: 'space-between',
        p: isMobile ? 1 : 2,
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? 1 : 0
      }}>
        <Button
          size="small"
          startIcon={<ViewIcon />}
          onClick={() => onView(equipment)}
          fullWidth={isMobile}
        >
          View
        </Button>

        {canManageEquipment(user?.role) && (
          <Box sx={{ 
            display: 'flex',
            width: isMobile ? '100%' : 'auto',
            justifyContent: isMobile ? 'space-around' : 'flex-end'
          }}>
            <IconButton
              size="small"
              onClick={() => onEdit(equipment)}
              color="primary"
            >
              <EditIcon />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => onDelete(equipment)}
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

export default EquipmentCard;

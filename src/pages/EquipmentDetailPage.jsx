import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import EquipmentForm from '../components/Equipment/EquipmentForm';
import { useEquipment } from '../contexts/EquipmentContext';
import { useRentals } from '../contexts/RentalsContext';
import { useMaintenance } from '../contexts/MaintenanceContext';
import { useAuth } from '../contexts/AuthContext';
import { canManageEquipment } from '../utils/roleUtils';
import { formatDate } from '../utils/dateUtils';
import { EQUIPMENT_STATUS, EQUIPMENT_CONDITION } from '../utils/constants';

const EquipmentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getEquipmentById, updateEquipment } = useEquipment();
  const { getRentalsByEquipment } = useRentals();
  const { getMaintenanceByEquipment } = useMaintenance();
  
  const [editFormOpen, setEditFormOpen] = useState(false);

  const equipment = getEquipmentById(id);
  const equipmentRentals = getRentalsByEquipment(id);
  const equipmentMaintenance = getMaintenanceByEquipment(id);

  if (!equipment) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <Alert severity="error">Equipment not found</Alert>
      </Box>
    );
  }

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

  const handleEdit = async (formData) => {
    const result = await updateEquipment(equipment.id, formData);
    if (result.success) {
      setEditFormOpen(false);
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/equipment')}
          >
            Back to Equipment
          </Button>
          <Typography variant="h4" component="h1">
            {equipment.name}
          </Typography>
        </Box>
        
        {canManageEquipment(user?.role) && (
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => setEditFormOpen(true)}
          >
            Edit Equipment
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        {/* Equipment Details */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Equipment Information
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Category
                </Typography>
                <Typography variant="body1">
                    {equipment.category}
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Status
                </Typography>
                <Chip
                  label={equipment.status}
                  color={getStatusColor(equipment.status)}
                  sx={{ mt: 0.5 }}
                />
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Condition
                </Typography>
                <Chip
                  label={equipment.condition}
                  color={getConditionColor(equipment.condition)}
                  variant="outlined"
                  sx={{ mt: 0.5 }}
                />
              </Box>

              {equipment.dailyRate && (
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Daily Rate
                  </Typography>
                  <Typography variant="h6" color="primary">
                    ${equipment.dailyRate}/day
                  </Typography>
                </Box>
              )}

              {equipment.description && (
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Description
                  </Typography>
                  <Typography variant="body1">
                    {equipment.description}
                  </Typography>
                </Box>
              )}

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Date Added
                </Typography>
                <Typography variant="body1">
                  {formatDate(equipment.dateAdded)}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Rental History */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Rental History ({equipmentRentals.length})
              </Typography>
              
              {equipmentRentals.length > 0 ? (
                <List>
                  {equipmentRentals.slice(0, 5).map((rental, index) => (
                    <Box key={rental.id}>
                      <ListItem>
                        <ListItemText
                          primary={rental.customerName}
                          secondary={
                            <Box>
                              <Typography variant="body2">
                                {formatDate(rental.startDate)} - {formatDate(rental.endDate)}
                              </Typography>
                              <Chip 
                                label={rental.status} 
                                size="small" 
                                sx={{ mt: 0.5 }}
                              />
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < Math.min(equipmentRentals.length, 5) - 1 && <Divider />}
                    </Box>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No rental history available
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Maintenance History */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Maintenance History ({equipmentMaintenance.length})
              </Typography>
              
              {equipmentMaintenance.length > 0 ? (
                <List>
                  {equipmentMaintenance.map((maintenance, index) => (
                    <Box key={maintenance.id}>
                      <ListItem>
                        <ListItemText
                          primary={
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                              <Typography variant="subtitle1">
                                {maintenance.type}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {formatDate(maintenance.date)}
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <Box>
                              {maintenance.notes && (
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                  {maintenance.notes}
                                </Typography>
                              )}
                              <Box display="flex" justifyContent="space-between" alignItems="center">
                                {maintenance.technician && (
                                  <Typography variant="caption">
                                    Technician: {maintenance.technician}
                                  </Typography>
                                )}
                                {maintenance.cost && (
                                  <Typography variant="caption" color="primary">
                                    Cost: ${maintenance.cost}
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < equipmentMaintenance.length - 1 && <Divider />}
                    </Box>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No maintenance history available
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Edit Form */}
      <EquipmentForm
        open={editFormOpen}
        onClose={() => setEditFormOpen(false)}
        onSubmit={handleEdit}
        equipment={equipment}
        title="Edit Equipment"
      />
    </Box>
  );
};

export default EquipmentDetailPage;
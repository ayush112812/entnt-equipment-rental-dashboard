import React, { useState, useMemo } from 'react';
import {
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  InputAdornment,
  Alert
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon
} from '@mui/icons-material';
import MaintenanceCard from './MaintenanceCard';
import MaintenanceForm from './MaintenanceForm';
import { MAINTENANCE_TYPES } from '../../utils/constants';
import { useAuth } from '../../contexts/AuthContext';
import { canManageMaintenance } from '../../utils/roleUtils';

const MaintenanceList = ({ 
  maintenance, 
  loading, 
  error, 
  onAdd, 
  onEdit, 
  onDelete, 
  onView 
}) => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingMaintenance, setEditingMaintenance] = useState(null);

  // Filter maintenance based on search and filters
  const filteredMaintenance = useMemo(() => {
    return maintenance.filter(m => {
      const matchesSearch = m.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (m.notes && m.notes.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           (m.technician && m.technician.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesType = !typeFilter || m.type === typeFilter;
      
      return matchesSearch && matchesType;
    });
  }, [maintenance, searchTerm, typeFilter]);

  const handleAddClick = () => {
    setEditingMaintenance(null);
    setFormOpen(true);
  };

  const handleEditClick = (maintenance) => {
    setEditingMaintenance(maintenance);
    setFormOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    let result;
    if (editingMaintenance) {
      result = await onEdit(editingMaintenance.id, formData);
    } else {
      result = await onAdd(formData);
    }
    
    if (result.success) {
      setFormOpen(false);
      setEditingMaintenance(null);
    }
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditingMaintenance(null);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <Typography>Loading maintenance records...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" component="h1">
          Maintenance Management
        </Typography>
        {canManageMaintenance(user?.role) && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddClick}
          >
            Add Maintenance Record
          </Button>
        )}
      </Box>

      {/* Filters */}
      <Box mb={3}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Search Maintenance"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Maintenance Type</InputLabel>
              <Select
                value={typeFilter}
                label="Maintenance Type"
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <MenuItem value="">All Types</MenuItem>
                {Object.values(MAINTENANCE_TYPES).map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Maintenance Grid */}
      {filteredMaintenance.length > 0 ? (
        <Grid container spacing={3}>
          {filteredMaintenance.map((m) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={m.id}>
              <MaintenanceCard
                maintenance={m}
                onView={onView}
                onEdit={handleEditClick}
                onDelete={onDelete}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary">
            {maintenance.length === 0 ? 'No maintenance records found' : 'No maintenance records match your filters'}
          </Typography>
        </Box>
      )}

      {/* Maintenance Form */}
      <MaintenanceForm
        open={formOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        maintenance={editingMaintenance}
      />
    </Box>
  );
};

export default MaintenanceList;

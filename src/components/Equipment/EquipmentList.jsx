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
import EquipmentCard from './EquipmentCard';
import EquipmentForm from './EquipmentForm';
import { EQUIPMENT_STATUS, EQUIPMENT_CONDITION } from '../../utils/constants';
import { useAuth } from '../../contexts/AuthContext';
import { canManageEquipment } from '../../utils/roleUtils';

const EquipmentList = ({ 
  equipment, 
  loading, 
  error, 
  onAdd, 
  onEdit, 
  onDelete, 
  onView 
}) => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [conditionFilter, setConditionFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState(null);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = [...new Set(equipment.map(eq => eq.category))];
    return cats.filter(Boolean);
  }, [equipment]);

  // Filter equipment based on search and filters
  const filteredEquipment = useMemo(() => {
    return equipment.filter(eq => {
      const matchesSearch = eq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           eq.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (eq.description && eq.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = !statusFilter || eq.status === statusFilter;
      const matchesCondition = !conditionFilter || eq.condition === conditionFilter;
      const matchesCategory = !categoryFilter || eq.category === categoryFilter;
      
      return matchesSearch && matchesStatus && matchesCondition && matchesCategory;
    });
  }, [equipment, searchTerm, statusFilter, conditionFilter, categoryFilter]);

  const handleAddClick = () => {
    setEditingEquipment(null);
    setFormOpen(true);
  };

  const handleEditClick = (equipment) => {
    setEditingEquipment(equipment);
    setFormOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    let result;
    if (editingEquipment) {
      result = await onEdit(editingEquipment.id, formData);
    } else {
      result = await onAdd(formData);
    }
    
    if (result.success) {
      setFormOpen(false);
      setEditingEquipment(null);
    }
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditingEquipment(null);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <Typography>Loading equipment...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" component="h1">
          Equipment Management
        </Typography>
        {canManageEquipment(user?.role) && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddClick}
          >
            Add Equipment
          </Button>
        )}
      </Box>

      {/* Filters */}
      <Box mb={3}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Search Equipment"
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
          
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="">All Statuses</MenuItem>
                {Object.values(EQUIPMENT_STATUS).map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Condition</InputLabel>
              <Select
                value={conditionFilter}
                label="Condition"
                onChange={(e) => setConditionFilter(e.target.value)}
              >
                <MenuItem value="">All Conditions</MenuItem>
                {Object.values(EQUIPMENT_CONDITION).map((condition) => (
                  <MenuItem key={condition} value={condition}>
                    {condition}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryFilter}
                label="Category"
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
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

      {/* Equipment Grid */}
      {filteredEquipment.length > 0 ? (
        <Grid container spacing={3}>
          {filteredEquipment.map((eq) => (
            <Grid item xs={12} sm={6} md={4} xl={3} key={eq.id}>
              <EquipmentCard
                equipment={eq}
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
            {equipment.length === 0 ? 'No equipment found' : 'No equipment matches your filters'}
          </Typography>
        </Box>
      )}

      {/* Equipment Form */}
      <EquipmentForm
        open={formOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        equipment={editingEquipment}
      />
    </Box>
  );
};

export default EquipmentList;

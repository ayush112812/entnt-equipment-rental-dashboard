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
  Alert,
  Tabs,
  Tab
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import RentalCard from './RentalCard';
import RentalForm from './RentalForm';
import RentalCalendar from './RentalCalendar';
import { RENTAL_STATUS } from '../../utils/constants';
import { useAuth } from '../../contexts/AuthContext';
import { canCreateRental } from '../../utils/roleUtils';

const RentalList = ({
  rentals,
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
  const [equipmentFilter, setEquipmentFilter] = useState('');
  const [customerFilter, setCustomerFilter] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingRental, setEditingRental] = useState(null);
  const [viewMode, setViewMode] = useState(0); // 0: List, 1: Calendar

  const filteredRentals = useMemo(() => {
    return rentals.filter((rental) => {
      const matchesSearch =
        rental.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rental.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (rental.notes && rental.notes.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = !statusFilter || rental.status === statusFilter;
      const matchesEquipment = !equipmentFilter || rental.equipmentName === equipmentFilter;
      const matchesCustomer = !customerFilter || rental.customerName === customerFilter;

      return matchesSearch && matchesStatus && matchesEquipment && matchesCustomer;
    });
  }, [rentals, searchTerm, statusFilter, equipmentFilter, customerFilter]);

  const handleAddClick = () => {
    setEditingRental(null);
    setFormOpen(true);
  };

  const handleEditClick = (rental) => {
    setEditingRental(rental);
    setFormOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    const result = editingRental
      ? await onEdit(editingRental.id, formData)
      : await onAdd(formData);

    if (result.success) {
      setFormOpen(false);
      setEditingRental(null);
    }
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditingRental(null);
  };

  const handleTabChange = (event, newValue) => {
    setViewMode(newValue);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <Typography>Loading rentals...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" component="h1">
          Rental Management
        </Typography>
        {canCreateRental(user?.role) && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddClick}
          >
            Create Rental
          </Button>
        )}
      </Box>

      {/* View Mode Tabs */}
      <Box mb={3}>
        <Tabs value={viewMode} onChange={handleTabChange}>
          <Tab label="List View" />
          <Tab label="Calendar View" icon={<CalendarIcon />} />
        </Tabs>
      </Box>

      {/* Filters */}
      {viewMode === 0 && (
        <Box mb={3}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Search Rentals"
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

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="">All Statuses</MenuItem>
                  {Object.values(RENTAL_STATUS).map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Equipment</InputLabel>
                <Select
                  value={equipmentFilter}
                  label="Equipment"
                  onChange={(e) => setEquipmentFilter(e.target.value)}
                >
                  <MenuItem value="">All Equipment</MenuItem>
                  {[...new Set(rentals.map((r) => r.equipmentName))].map((name) => (
                    <MenuItem key={name} value={name}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Customer</InputLabel>
                <Select
                  value={customerFilter}
                  label="Customer"
                  onChange={(e) => setCustomerFilter(e.target.value)}
                >
                  <MenuItem value="">All Customers</MenuItem>
                  {[...new Set(rentals.map((r) => r.customerName))].map((name) => (
                    <MenuItem key={name} value={name}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Error */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Rentals */}
      {viewMode === 0 ? (
        filteredRentals.length > 0 ? (
          <Grid container spacing={3}>
            {filteredRentals.map((rental) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={rental.id}>
                <RentalCard
                  rental={rental}
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
              {rentals.length === 0
                ? 'No rentals found'
                : 'No rentals match your filters'}
            </Typography>
          </Box>
        )
      ) : (
        <RentalCalendar rentals={rentals} />
      )}

      <RentalForm
        open={formOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        rental={editingRental}
      />
    </Box>
  );
};

export default RentalList;

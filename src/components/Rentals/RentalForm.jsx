import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  Typography
} from '@mui/material';
import { RENTAL_STATUS, EQUIPMENT_STATUS, LOCAL_STORAGE_KEYS } from '../../utils/constants';
import { getFromLocalStorage } from '../../utils/localStorageUtils';
import { formatDateForInput, getDaysBetween } from '../../utils/dateUtils';

const RentalForm = ({ open, onClose, onSubmit, rental, title }) => {
  const [formData, setFormData] = useState({
    equipmentId: '',
    customerId: '',
    startDate: '',
    endDate: '',
    status: RENTAL_STATUS.RESERVED,
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [equipment, setEquipment] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState(null);

  useEffect(() => {
    // Load equipment and customers
    const equipmentData = getFromLocalStorage(LOCAL_STORAGE_KEYS.EQUIPMENT);
    const usersData = getFromLocalStorage(LOCAL_STORAGE_KEYS.USERS);
    
    setEquipment(equipmentData.filter(eq => eq.status === EQUIPMENT_STATUS.AVAILABLE));
    setCustomers(usersData.filter(user => user.role === 'Customer'));
  }, []);

  useEffect(() => {
    if (rental) {
      setFormData({
        equipmentId: rental.equipmentId || '',
        customerId: rental.customerId || '',
        startDate: formatDateForInput(rental.startDate) || '',
        endDate: formatDateForInput(rental.endDate) || '',
        status: rental.status || RENTAL_STATUS.RESERVED,
        notes: rental.notes || ''
      });
    } else {
      setFormData({
        equipmentId: '',
        customerId: '',
        startDate: '',
        endDate: '',
        status: RENTAL_STATUS.RESERVED,
        notes: ''
      });
    }
    setErrors({});
  }, [rental, open]);

  useEffect(() => {
    if (formData.equipmentId) {
      const eq = equipment.find(e => e.id === formData.equipmentId);
      setSelectedEquipment(eq);
    } else {
      setSelectedEquipment(null);
    }
  }, [formData.equipmentId, equipment]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.equipmentId) {
      newErrors.equipmentId = 'Equipment selection is required';
    }
    
    if (!formData.customerId) {
      newErrors.customerId = 'Customer selection is required';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }
    
    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      
      if (endDate <= startDate) {
        newErrors.endDate = 'End date must be after start date';
      }
      
      if (startDate < new Date().setHours(0, 0, 0, 0)) {
        newErrors.startDate = 'Start date cannot be in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateTotal = () => {
    if (selectedEquipment && formData.startDate && formData.endDate) {
      const days = getDaysBetween(formData.startDate, formData.endDate);
      return selectedEquipment.dailyRate * days;
    }
    return 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const selectedCustomer = customers.find(c => c.id === formData.customerId);
    const totalCost = calculateTotal();

    const submitData = {
      ...formData,
      equipmentName: selectedEquipment?.name,
      customerName: selectedCustomer?.name || selectedCustomer?.email,
      dailyRate: selectedEquipment?.dailyRate || 0,
      totalCost
    };

    onSubmit(submitData);
  };

  const handleClose = () => {
    setFormData({
      equipmentId: '',
      customerId: '',
      startDate: '',
      endDate: '',
      status: RENTAL_STATUS.RESERVED,
      notes: ''
    });
    setErrors({});
    onClose();
  };

  const totalCost = calculateTotal();
  const rentalDays = formData.startDate && formData.endDate ? getDaysBetween(formData.startDate, formData.endDate) : 0;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>{title || (rental ? 'Edit Rental' : 'Create Rental')}</DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal" error={!!errors.equipmentId}>
                <InputLabel>Equipment</InputLabel>
                <Select
                  name="equipmentId"
                  value={formData.equipmentId}
                  label="Equipment"
                  onChange={handleChange}
                  disabled={!!rental} // Disable editing equipment in edit mode
                >
                  {equipment.map((eq) => (
                    <MenuItem key={eq.id} value={eq.id}>
                      {eq.name} - ${eq.dailyRate}/day
                    </MenuItem>
                  ))}
                </Select>
                {errors.equipmentId && (
                  <Typography variant="caption" color="error">
                    {errors.equipmentId}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal" error={!!errors.customerId}>
                <InputLabel>Customer</InputLabel>
                <Select
                  name="customerId"
                  value={formData.customerId}
                  label="Customer"
                  onChange={handleChange}
                >
                  {customers.map((customer) => (
                    <MenuItem key={customer.id} value={customer.id}>
                      {customer.name || customer.email}
                    </MenuItem>
                  ))}
                </Select>
                {errors.customerId && (
                  <Typography variant="caption" color="error">
                    {errors.customerId}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Start Date"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                error={!!errors.startDate}
                helperText={errors.startDate}
                required
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="End Date"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleChange}
                error={!!errors.endDate}
                helperText={errors.endDate}
                required
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  label="Status"
                  onChange={handleChange}
                >
                  {Object.values(RENTAL_STATUS).map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              {totalCost > 0 && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  Duration: {rentalDays} day{rentalDays !== 1 ? 's' : ''}<br />
                  Daily Rate: ${selectedEquipment?.dailyRate}<br />
                  <strong>Total Cost: ${totalCost}</strong>
                </Alert>
              )}
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                multiline
                rows={3}
                margin="normal"
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {rental ? 'Update' : 'Create'} Rental
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default RentalForm;

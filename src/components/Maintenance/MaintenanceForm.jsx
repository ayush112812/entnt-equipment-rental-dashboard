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
  useTheme,
  alpha
} from '@mui/material';
import { useEquipment } from '../../contexts/EquipmentContext';

const MaintenanceForm = ({ open, onClose, onSubmit, maintenance = null }) => {
  const theme = useTheme();
  const { equipment } = useEquipment();
  const [formData, setFormData] = useState({
    equipmentId: '',
    equipmentName: '',
    type: '',
    date: '',
    technician: '',
    status: 'Scheduled',
    cost: '',
    notes: ''
  });

  useEffect(() => {
    if (maintenance) {
      setFormData({
        ...maintenance,
        date: maintenance.date.split('T')[0] // Format date for input
      });
    } else {
      setFormData({
        equipmentId: '',
        equipmentName: '',
        type: '',
        date: '',
        technician: '',
        status: 'Scheduled',
        cost: '',
        notes: ''
      });
    }
  }, [maintenance]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'equipmentId') {
      const selectedEquipment = equipment.find(eq => eq.id === value);
      setFormData(prev => ({
        ...prev,
        [name]: value,
        equipmentName: selectedEquipment ? selectedEquipment.name : ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        elevation: 0,
        sx: {
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`
        }
      }}
    >
      <DialogTitle sx={{ 
        pb: 2,
        borderBottom: `1px solid ${theme.palette.divider}`
      }}>
        {maintenance ? 'Edit Maintenance Record' : 'Schedule Maintenance'}
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ mt: 2 }}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Equipment</InputLabel>
            <Select
              name="equipmentId"
              value={formData.equipmentId}
              onChange={handleChange}
              required
              label="Equipment"
            >
              {equipment.map((eq) => (
                <MenuItem key={eq.id} value={eq.id}>
                  {eq.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Type</InputLabel>
            <Select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              label="Type"
            >
              <MenuItem value="Preventive">Preventive</MenuItem>
              <MenuItem value="Corrective">Corrective</MenuItem>
              <MenuItem value="Inspection">Inspection</MenuItem>
              <MenuItem value="Emergency">Emergency</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            margin="normal"
            label="Date"
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Technician"
            name="technician"
            value={formData.technician}
            onChange={handleChange}
            required
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              label="Status"
            >
              <MenuItem value="Scheduled">Scheduled</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            margin="normal"
            label="Cost"
            name="cost"
            type="number"
            value={formData.cost}
            onChange={handleChange}
            required
            InputProps={{
              startAdornment: '$'
            }}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            multiline
            rows={3}
          />
        </DialogContent>

        <DialogActions sx={{ 
          p: 2,
          pt: 0,
          gap: 1
        }}>
          <Button 
            onClick={onClose}
            variant="outlined"
            sx={{
              borderColor: alpha(theme.palette.primary.main, 0.3),
              '&:hover': {
                borderColor: theme.palette.primary.main,
                backgroundColor: alpha(theme.palette.primary.main, 0.05)
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            variant="contained"
            sx={{
              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
              '&:hover': {
                boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.3)}`,
              }
            }}
          >
            {maintenance ? 'Update' : 'Schedule'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default MaintenanceForm; 
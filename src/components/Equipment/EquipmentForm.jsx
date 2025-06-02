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
  alpha,
  Box,
  Tabs,
  Tab,
  Divider,
  Grid
} from '@mui/material';
import { EQUIPMENT_STATUS, EQUIPMENT_CONDITION, MOCK_DATA } from '../../utils/constants';

const EquipmentForm = ({ open, onClose, onSubmit, equipment, title }) => {
  const [formMode, setFormMode] = useState('manual'); // 'manual' or 'template'
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    condition: EQUIPMENT_CONDITION.GOOD,
    status: EQUIPMENT_STATUS.AVAILABLE,
    description: '',
    dailyRate: ''
  });
  const [errors, setErrors] = useState({});
  const [selectedTemplate, setSelectedTemplate] = useState('');

  useEffect(() => {
    if (equipment) {
      setFormData({
        name: equipment.name || '',
        category: equipment.category || '',
        condition: equipment.condition || EQUIPMENT_CONDITION.GOOD,
        status: equipment.status || EQUIPMENT_STATUS.AVAILABLE,
        description: equipment.description || '',
        dailyRate: equipment.dailyRate || ''
      });
    } else {
      setFormData({
        name: '',
        category: '',
        condition: EQUIPMENT_CONDITION.GOOD,
        status: EQUIPMENT_STATUS.AVAILABLE,
        description: '',
        dailyRate: ''
      });
    }
    setErrors({});
    setFormMode('manual');
    setSelectedTemplate('');
  }, [equipment, open]);

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

  const handleTemplateChange = (e) => {
    const selectedEquipment = MOCK_DATA.equipment.find(eq => eq.id === e.target.value);
    if (selectedEquipment) {
      setSelectedTemplate(e.target.value);
      setFormData({
        name: selectedEquipment.name,
        category: selectedEquipment.category,
        condition: selectedEquipment.condition,
        status: EQUIPMENT_STATUS.AVAILABLE,
        description: selectedEquipment.description,
        dailyRate: selectedEquipment.dailyRate
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Equipment name is required';
    }
    
    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }
    
    if (formData.dailyRate && (isNaN(formData.dailyRate) || Number(formData.dailyRate) <= 0)) {
      newErrors.dailyRate = 'Daily rate must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const submitData = {
      ...formData,
      dailyRate: formData.dailyRate ? Number(formData.dailyRate) : 0
    };

    onSubmit(submitData);
  };

  const handleClose = () => {
    setFormData({
      name: '',
      category: '',
      condition: EQUIPMENT_CONDITION.GOOD,
      status: EQUIPMENT_STATUS.AVAILABLE,
      description: '',
      dailyRate: ''
    });
    setErrors({});
    setFormMode('manual');
    setSelectedTemplate('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>{title || (equipment ? 'Edit Equipment' : 'Add Equipment')}</DialogTitle>
      
      {!equipment && (
        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}>
          <Tabs
            value={formMode}
            onChange={(e, newValue) => setFormMode(newValue)}
            aria-label="equipment form mode"
          >
            <Tab label="Manual Entry" value="manual" />
            <Tab label="From Template" value="template" />
          </Tabs>
        </Box>
      )}
      
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {formMode === 'template' && !equipment && (
            <>
              <FormControl fullWidth margin="normal">
                <InputLabel>Select Equipment Template</InputLabel>
                <Select
                  value={selectedTemplate}
                  onChange={handleTemplateChange}
                  label="Select Equipment Template"
                >
                  {MOCK_DATA.equipment.map((eq) => (
                    <MenuItem key={eq.id} value={eq.id}>
                      {eq.name} - {eq.category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Divider sx={{ my: 2 }} />
            </>
          )}
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Equipment Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                required
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                error={!!errors.category}
                helperText={errors.category}
                required
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Condition</InputLabel>
                <Select
                  name="condition"
                  value={formData.condition}
                  label="Condition"
                  onChange={handleChange}
                >
                  {Object.values(EQUIPMENT_CONDITION).map((condition) => (
                    <MenuItem key={condition} value={condition}>
                      {condition}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
                  {Object.values(EQUIPMENT_STATUS).map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Daily Rate ($)"
                name="dailyRate"
                type="number"
                value={formData.dailyRate}
                onChange={handleChange}
                error={!!errors.dailyRate}
                helperText={errors.dailyRate}
                margin="normal"
                InputProps={{
                  inputProps: { min: 0, step: 0.01 }
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
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
            {equipment ? 'Update' : 'Add'} Equipment
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EquipmentForm;

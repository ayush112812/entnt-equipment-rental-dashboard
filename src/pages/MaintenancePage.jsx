import React from 'react';
import MaintenanceList from '../components/Maintenance/MaintenanceList';
import { useMaintenance } from '../contexts/MaintenanceContext';

const MaintenancePage = () => {
  const { 
    maintenance, 
    loading, 
    error, 
    addMaintenance, 
    updateMaintenance, 
    deleteMaintenance 
  } = useMaintenance();

  const handleView = (maintenance) => {
    // For now, just log the maintenance. In a real app, you might navigate to a detail page
    console.log('View maintenance:', maintenance);
  };

  const handleDelete = async (maintenance) => {
    if (window.confirm(`Are you sure you want to delete the maintenance record for ${maintenance.equipmentName}?`)) {
      await deleteMaintenance(maintenance.id);
    }
  };

  return (
    <MaintenanceList
      maintenance={maintenance}
      loading={loading}
      error={error}
      onAdd={addMaintenance}
      onEdit={updateMaintenance}
      onDelete={handleDelete}
      onView={handleView}
    />
  );
};

export default MaintenancePage;

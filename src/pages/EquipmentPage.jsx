import React from 'react';
import { useNavigate } from 'react-router-dom';
import EquipmentList from '../components/Equipment/EquipmentList';
import { useEquipment } from '../contexts/EquipmentContext';

const EquipmentPage = () => {
  const navigate = useNavigate();
  const { 
    equipment, 
    loading, 
    error, 
    addEquipment, 
    updateEquipment, 
    deleteEquipment 
  } = useEquipment();

  const handleView = (equipment) => {
    navigate(`/equipment/${equipment.id}`);
  };

  const handleDelete = async (equipment) => {
    if (window.confirm(`Are you sure you want to delete ${equipment.name}?`)) {
      await deleteEquipment(equipment.id);
    }
  };

  return (
    <EquipmentList
      equipment={equipment}
      loading={loading}
      error={error}
      onAdd={addEquipment}
      onEdit={updateEquipment}
      onDelete={handleDelete}
      onView={handleView}
    />
  );
};

export default EquipmentPage;

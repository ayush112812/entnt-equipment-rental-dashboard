import React from 'react';
import RentalList from '../components/Rentals/RentalList';
import { useRentals } from '../contexts/RentalsContext';

const RentalsPage = () => {
  const { 
    rentals, 
    loading, 
    error, 
    addRental, 
    updateRental, 
    deleteRental 
  } = useRentals();

  const handleView = (rental) => {
    // For now, just log the rental. In a real app, you might navigate to a detail page
    console.log('View rental:', rental);
  };

  const handleDelete = async (rental) => {
    if (window.confirm(`Are you sure you want to delete the rental for ${rental.equipmentName}?`)) {
      await deleteRental(rental.id);
    }
  };

  return (
    <RentalList
      rentals={rentals}
      loading={loading}
      error={error}
      onAdd={addRental}
      onEdit={updateRental}
      onDelete={handleDelete}
      onView={handleView}
    />
  );
};

export default RentalsPage;

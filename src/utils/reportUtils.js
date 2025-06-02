// Function to convert data to CSV format
const convertToCSV = (data, headers) => {
  const headerRow = headers.join(',');
  const rows = data.map(item => 
    headers.map(header => 
      typeof item[header] === 'object' ? JSON.stringify(item[header]) : item[header]
    ).join(',')
  );
  return [headerRow, ...rows].join('\n');
};

// Function to download CSV file
const downloadCSV = (csvContent, fileName) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('link');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Export equipment report
export const exportEquipmentReport = (equipment) => {
  const headers = ['id', 'name', 'description', 'condition', 'available', 'rentalRate'];
  const csvContent = convertToCSV(equipment, headers);
  downloadCSV(csvContent, 'equipment_report.csv');
};

// Export rental history report
export const exportRentalReport = (rentals) => {
  const headers = ['id', 'equipmentId', 'customerId', 'startDate', 'endDate', 'status', 'totalCost'];
  const csvContent = convertToCSV(rentals, headers);
  downloadCSV(csvContent, 'rental_history_report.csv');
};

// Export maintenance report
export const exportMaintenanceReport = (maintenance) => {
  const headers = ['id', 'equipmentId', 'description', 'date', 'cost', 'status'];
  const csvContent = convertToCSV(maintenance, headers);
  downloadCSV(csvContent, 'maintenance_report.csv');
}; 
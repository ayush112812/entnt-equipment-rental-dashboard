import { exportRentalReport } from '../utils/reportUtils';
import { Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { useRentals } from '../contexts/RentalsContext';

function RentalHistory() {
  const { rentals } = useRentals();
  
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Rental History</h1>
        <Button
          variant="contained"
          color="primary"
          onClick={() => exportRentalReport(rentals)}
          startIcon={<DownloadIcon />}
        >
          Export Report
        </Button>
      </div>
      // ... existing code ...
    </div>
  );
}

export default RentalHistory; 
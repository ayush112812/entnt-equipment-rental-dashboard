import { exportMaintenanceReport } from '../utils/reportUtils';
import { Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { useMaintenance } from '../contexts/MaintenanceContext';

function MaintenanceRecords() {
  const { maintenance } = useMaintenance();
  
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Maintenance Records</h1>
        <Button
          variant="contained"
          color="primary"
          onClick={() => exportMaintenanceReport(maintenance)}
          startIcon={<DownloadIcon />}
        >
          Export Report
        </Button>
      </div>
      // ... existing code ...
    </div>
  );
}

export default MaintenanceRecords; 
import { exportEquipmentReport } from '../utils/reportUtils';
import { Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { useEquipment } from '../contexts/EquipmentContext';

function EquipmentManagement() {
  const { equipment } = useEquipment();
  
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Equipment Management</h1>
        <div className="space-x-2">
          <Button
            variant="contained"
            color="primary"
            onClick={() => exportEquipmentReport(equipment)}
            startIcon={<DownloadIcon />}
          >
            Export Report
          </Button>
        </div>
      </div>
    </div>
  );
}

export default EquipmentManagement; 
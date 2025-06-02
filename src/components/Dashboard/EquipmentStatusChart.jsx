import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const EquipmentStatusChart = ({ equipment }) => {
  const [chartData, setChartData] = useState([]);
  
  const COLORS = ['#4caf50', '#f44336', '#ff9800', '#2196f3'];

  useEffect(() => {
    // Count equipment by status
    const statusCounts = {};
    equipment.forEach(item => {
      statusCounts[item.status] = (statusCounts[item.status] || 0) + 1;
    });
    
    // Convert to chart data format
    const data = Object.keys(statusCounts).map(status => ({
      name: status,
      value: statusCounts[status]
    }));
    
    setChartData(data);
  }, [equipment]);
  
  // If no equipment data, show message
  if (equipment.length === 0) {
    return <div>No equipment data available</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value} items`, 'Count']} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default EquipmentStatusChart;

import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const RentalOverviewChart = ({ rentals }) => {
  const [chartData, setChartData] = useState([]);
  
  useEffect(() => {
    // Group rentals by status
    const statusCounts = {};
    rentals.forEach(rental => {
      statusCounts[rental.status] = (statusCounts[rental.status] || 0) + 1;
    });
    
    // Convert to chart data format
    const data = Object.keys(statusCounts).map(status => ({
      name: status,
      count: statusCounts[status]
    }));
    
    setChartData(data);
  }, [rentals]);
  
  // If no rental data, show message
  if (rentals.length === 0) {
    return <div>No rental data available</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={chartData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" name="Number of Rentals" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default RentalOverviewChart;

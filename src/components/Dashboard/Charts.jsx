import React, { useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
  alpha,
  IconButton,
  Tooltip,
  Chip
} from '@mui/material';
import {
  FullscreenOutlined as FullscreenIcon,
  RefreshOutlined as RefreshIcon,
  GetAppOutlined as ExportIcon
} from '@mui/icons-material';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar
} from 'recharts';
import { EQUIPMENT_STATUS, RENTAL_STATUS, MAINTENANCE_TYPES } from '../../utils/constants';

const EnhancedCharts = ({ equipment, rentals, maintenance }) => {
  const theme = useTheme();
  const [chartView, setChartView] = useState('overview');

  // Enhanced color palette
  const COLORS = {
    primary: [
      theme.palette.primary.main,
      theme.palette.primary.light,
      theme.palette.primary.dark,
    ],
    success: [
      theme.palette.success.main,
      theme.palette.success.light,
      theme.palette.success.dark,
    ],
    warning: [
      theme.palette.warning.main,
      theme.palette.warning.light,
      theme.palette.warning.dark,
    ],
    error: [
      theme.palette.error.main,
      theme.palette.error.light,
      theme.palette.error.dark,
    ],
    gradient: [
      '#667eea', '#764ba2', '#f093fb', '#f5576c',
      '#4facfe', '#00f2fe', '#43e97b', '#38f9d7'
    ]
  };

  // Enhanced data processing
  const equipmentStatusData = Object.values(EQUIPMENT_STATUS).map((status, index) => ({
    name: status,
    value: equipment.filter(eq => eq.status === status).length,
    color: COLORS.gradient[index],
    percentage: ((equipment.filter(eq => eq.status === status).length / Math.max(equipment.length, 1)) * 100).toFixed(1)
  })).filter(item => item.value > 0);

  const rentalStatusData = Object.values(RENTAL_STATUS).map((status, index) => ({
    name: status,
    value: rentals.filter(r => r.status === status).length,
    color: COLORS.gradient[index + 2],
    percentage: ((rentals.filter(r => r.status === status).length / Math.max(rentals.length, 1)) * 100).toFixed(1)
  })).filter(item => item.value > 0);

  // Equipment categories with enhanced data
  const categoryData = equipment.reduce((acc, eq) => {
    const category = eq.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = { count: 0, revenue: 0, utilization: 0 };
    }
    acc[category].count += 1;
    
    // Calculate revenue and utilization for this category
    const categoryRentals = rentals.filter(r => r.equipmentName && 
      equipment.find(e => e.id === r.equipmentId && e.category === category)
    );
    acc[category].revenue = categoryRentals.reduce((sum, r) => sum + (r.totalCost || 0), 0);
    acc[category].utilization = categoryRentals.length;
    
    return acc;
  }, {});

  const equipmentCategoryData = Object.entries(categoryData).map(([category, data]) => ({
    category,
    count: data.count,
    revenue: data.revenue,
    utilization: data.utilization,
    color: COLORS.gradient[Object.keys(categoryData).indexOf(category)]
  }));

  // Monthly trend data with more detail
  const getMonthlyTrendData = () => {
    const months = [];
    const today = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      
      const monthRentals = rentals.filter(rental => {
        const rentalDate = new Date(rental.createdDate || rental.startDate);
        return rentalDate.getMonth() === date.getMonth() && 
               rentalDate.getFullYear() === date.getFullYear();
      });
      
      const monthRevenue = monthRentals.reduce((sum, r) => sum + (r.totalCost || 0), 0);
      
      months.push({
        month: monthName,
        rentals: monthRentals.length,
        revenue: monthRevenue,
        equipmentAdded: equipment.filter(eq => {
          const addedDate = new Date(eq.dateAdded);
          return addedDate.getMonth() === date.getMonth() && 
                 addedDate.getFullYear() === date.getFullYear();
        }).length
      });
    }
    
    return months;
  };

  const monthlyTrendData = getMonthlyTrendData();

  // Utilization data for radial chart
  const utilizationData = equipmentCategoryData.map((cat, index) => ({
    name: cat.category,
    utilization: cat.utilization,
    total: cat.count,
    percentage: ((cat.utilization / Math.max(cat.count, 1)) * 100).toFixed(1),
    fill: COLORS.gradient[index]
  }));

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Card sx={{ p: 2, minWidth: 200 }}>
          <Typography variant="subtitle2" gutterBottom>
            {label}
          </Typography>
          {payload.map((entry, index) => (
            <Box key={index} display="flex" alignItems="center" gap={1}>
              <Box 
                width={12} 
                height={12} 
                bgcolor={entry.color} 
                borderRadius="50%" 
              />
              <Typography variant="body2">
                {entry.name}: {entry.value}
                {entry.payload.percentage && ` (${entry.payload.percentage}%)`}
              </Typography>
            </Box>
          ))}
        </Card>
      );
    }
    return null;
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const ChartCard = ({ title, children, actions }) => (
    <Card 
      sx={{ 
        height: '100%',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[8],
        }
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight={600}>
            {title}
          </Typography>
          <Box display="flex" gap={1}>
            {actions}
            <Tooltip title="Refresh Data">
              <IconButton size="small">
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Export Chart">
              <IconButton size="small">
                <ExportIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        {children}
      </CardContent>
    </Card>
  );

  return (
    <Box>
      {/* Chart View Toggle */}
      <Box mb={3} display="flex" justifyContent="center">
        <ToggleButtonGroup
          value={chartView}
          exclusive
          onChange={(e, newView) => newView && setChartView(newView)}
          aria-label="chart view"
        >
          <ToggleButton value="overview">Overview</ToggleButton>
          <ToggleButton value="analytics">Analytics</ToggleButton>
          <ToggleButton value="trends">Trends</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Grid container spacing={3}>
        {chartView === 'overview' && (
          <>
            {/* Equipment Status Distribution */}
            <Grid item xs={12} md={6}>
              <ChartCard title="Equipment Status Distribution">
                <Box height={350}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={equipmentStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        animationBegin={0}
                        animationDuration={1500}
                      >
                        {equipmentStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip content={<CustomTooltip />} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </ChartCard>
            </Grid>

            {/* Rental Status Distribution */}
            <Grid item xs={12} md={6}>
              <ChartCard title="Rental Status Distribution">
                <Box height={350}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={rentalStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        animationBegin={200}
                        animationDuration={1500}
                      >
                        {rentalStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip content={<CustomTooltip />} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </ChartCard>
            </Grid>
          </>
        )}

        {chartView === 'analytics' && (
          <>
            {/* Equipment by Category */}
            <Grid item xs={12} md={8}>
              <ChartCard title="Equipment Analytics by Category">
                <Box height={350}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={equipmentCategoryData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.3)} />
                      <XAxis 
                        dataKey="category" 
                        stroke={theme.palette.text.secondary}
                        fontSize={12}
                      />
                      <YAxis stroke={theme.palette.text.secondary} fontSize={12} />
                      <RechartsTooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar 
                        dataKey="count" 
                        name="Equipment Count"
                        fill={COLORS.primary[0]}
                        radius={[4, 4, 0, 0]}
                        animationBegin={0}
                        animationDuration={1500}
                      />
                      <Bar 
                        dataKey="utilization" 
                        name="Utilization"
                        fill={COLORS.success[0]}
                        radius={[4, 4, 0, 0]}
                        animationBegin={200}
                        animationDuration={1500}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </ChartCard>
            </Grid>

            {/* Utilization Radial Chart */}
            <Grid item xs={12} md={4}>
              <ChartCard title="Category Utilization">
                <Box height={350}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart 
                      cx="50%" 
                      cy="50%" 
                      innerRadius="10%" 
                      outerRadius="80%" 
                      barSize={10} 
                      data={utilizationData}
                    >
                      <RadialBar
                        minAngle={15}
                        label={{ position: 'insideStart', fill: '#fff' }}
                        background
                        clockWise
                        dataKey="utilization"
                      />
                      <Legend iconSize={10} width={120} height={140} layout="vertical" verticalAlign="middle" />
                      <RechartsTooltip content={<CustomTooltip />} />
                    </RadialBarChart>
                  </ResponsiveContainer>
                </Box>
              </ChartCard>
            </Grid>
          </>
        )}

        {chartView === 'trends' && (
          <>
            {/* Monthly Trends */}
            <Grid item xs={12}>
              <ChartCard title="Monthly Performance Trends">
                <Box height={400}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyTrendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <defs>
                        <linearGradient id="colorRentals" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={COLORS.primary[0]} stopOpacity={0.8}/>
                          <stop offset="95%" stopColor={COLORS.primary[0]} stopOpacity={0.1}/>
                        </linearGradient>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={COLORS.success[0]} stopOpacity={0.8}/>
                          <stop offset="95%" stopColor={COLORS.success[0]} stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.3)} />
                      <XAxis 
                        dataKey="month" 
                        stroke={theme.palette.text.secondary}
                        fontSize={12}
                      />
                      <YAxis stroke={theme.palette.text.secondary} fontSize={12} />
                      <RechartsTooltip content={<CustomTooltip />} />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="rentals"
                        stroke={COLORS.primary[0]}
                        fillOpacity={1}
                        fill="url(#colorRentals)"
                        name="Rentals"
                        animationBegin={0}
                        animationDuration={2000}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke={COLORS.success[0]}
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                        name="Revenue ($)"
                        animationBegin={300}
                        animationDuration={2000}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
              </ChartCard>
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  );
};

export default EnhancedCharts;

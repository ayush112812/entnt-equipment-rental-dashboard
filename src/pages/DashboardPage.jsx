import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  Tooltip,
  useTheme,
  CircularProgress,
  Paper,
  Tab,
  Tabs,
} from '@mui/material';
import {
  Build as BuildIcon,
  Construction as ConstructionIcon,
  Warning as WarningIcon,
  CalendarMonth as CalendarIcon,
  Info as InfoIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, Area, AreaChart, LabelList } from 'recharts';
import { useEquipment } from '../contexts/EquipmentContext';
import { useRentals } from '../contexts/RentalsContext';
import { useMaintenance } from '../contexts/MaintenanceContext';
import { alpha } from '@mui/material/styles';

const DashboardPage = () => {
  const theme = useTheme();
  const { equipment = [], loading: equipmentLoading } = useEquipment();
  const { rentals = [], loading: rentalsLoading } = useRentals();
  const { maintenance: maintenanceRecords = [], loading: maintenanceLoading } = useMaintenance();
  const [selectedTab, setSelectedTab] = React.useState(0);

  // Show loading state if any data is still loading
  if (equipmentLoading || rentalsLoading || maintenanceLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Calculate KPIs
  const totalEquipment = equipment.length;
  const availableEquipment = equipment.filter(eq => eq.status === 'Available').length;
  const rentedEquipment = equipment.filter(eq => eq.status === 'Rented').length;
  const overdueRentals = rentals.filter(rental => 
    new Date(rental.endDate) < new Date() && rental.status === 'Rented'
  ).length;
  const upcomingMaintenance = maintenanceRecords.filter(record => 
    new Date(record.date) > new Date() && 
    new Date(record.date) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  ).length;

  // Data for Equipment Status Distribution
  const equipmentStatusData = [
    { name: 'Available', value: availableEquipment, color: theme.palette.success.main },
    { name: 'Rented', value: rentedEquipment, color: theme.palette.primary.main },
  ];

  // Data for Equipment by Category
  const equipmentByCategory = equipment.reduce((acc, eq) => {
    acc[eq.category] = (acc[eq.category] || 0) + 1;
    return acc;
  }, {});

  const categoryData = Object.entries(equipmentByCategory).map(([category, count]) => ({
    category,
    count,
  }));

  // Monthly rental trends data (mock data for demonstration)
  const monthlyTrendsData = [
    { month: 'Jan', rentals: 12, revenue: 2400 },
    { month: 'Feb', rentals: 15, revenue: 3000 },
    { month: 'Mar', rentals: 18, revenue: 3600 },
    { month: 'Apr', rentals: 22, revenue: 4400 },
    { month: 'May', rentals: 25, revenue: 5000 },
    { month: 'Jun', rentals: 30, revenue: 6000 },
  ];

  const KPICard = ({ title, value, icon: Icon, color, tooltip, trend, trendValue }) => (
    <Card 
      elevation={0}
      sx={{ 
        height: '100%',
        background: `linear-gradient(135deg, ${color}15 0%, ${theme.palette.background.paper} 100%)`,
        border: `1px solid ${color}30`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 4px 20px ${color}20`,
        }
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 2,
              width: 48,
              height: 48,
              backgroundColor: `${color}20`,
            }}
          >
            <Icon sx={{ color }} />
          </Box>
          {tooltip && (
            <Tooltip title={tooltip} placement="top">
              <IconButton size="small" sx={{ ml: 'auto' }}>
                <InfoIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Typography variant="h3" sx={{ mb: 1, color: theme.palette.text.primary }}>
          {value}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography color="text.secondary" variant="body2">
            {title}
          </Typography>
          {trend && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {trend === 'up' ? (
                <TrendingUpIcon fontSize="small" sx={{ color: theme.palette.success.main }} />
              ) : (
                <TrendingDownIcon fontSize="small" sx={{ color: theme.palette.error.main }} />
              )}
              <Typography
                variant="body2"
                sx={{
                  color: trend === 'up' ? theme.palette.success.main : theme.palette.error.main,
                }}
              >
                {trendValue}
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ 
      p: { xs: 2, md: 3 }, 
      maxWidth: '100%',
      width: '100%'
    }}>
      <Box sx={{ 
        mb: 4, 
        maxWidth: '100%',
        width: '100%',
        px: { xs: 1, md: 2 }
      }}>
        <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
          Dashboard Overview
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Monitor your equipment rental business performance
        </Typography>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={2} sx={{ mb: 4, width: '100%', mx: 0 }}>
        <Grid item xs={12} sm={6} lg={3} sx={{ pl: { xs: 1, md: 2 }, pr: { xs: 1, md: 2 } }}>
          <KPICard
            title="Total Equipment"
            value={totalEquipment}
            icon={ConstructionIcon}
            color={theme.palette.primary.main}
            tooltip="Total number of equipment items in inventory"
            trend="up"
            trendValue="+5%"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3} sx={{ pl: { xs: 1, md: 2 }, pr: { xs: 1, md: 2 } }}>
          <KPICard
            title="Active Rentals"
            value={rentedEquipment}
            icon={CalendarIcon}
            color={theme.palette.success.main}
            tooltip="Number of equipment items currently rented out"
            trend="up"
            trendValue="+12%"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3} sx={{ pl: { xs: 1, md: 2 }, pr: { xs: 1, md: 2 } }}>
          <KPICard
            title="Overdue Rentals"
            value={overdueRentals}
            icon={WarningIcon}
            color={theme.palette.error.main}
            tooltip="Number of rentals past their due date"
            trend="down"
            trendValue="-2%"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3} sx={{ pl: { xs: 1, md: 2 }, pr: { xs: 1, md: 2 } }}>
          <KPICard
            title="Upcoming Maintenance"
            value={upcomingMaintenance}
            icon={BuildIcon}
            color={theme.palette.warning.main}
            tooltip="Maintenance tasks scheduled for the next 7 days"
            trend="up"
            trendValue="+3%"
          />
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: { xs: 2, md: 3 },
          mb: 4, 
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
          background: `linear-gradient(to bottom right, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
          maxWidth: '100%',
          width: '100%',
          overflow: 'hidden'
        }}
      >
        <Tabs
          value={selectedTab}
          onChange={(e, newValue) => setSelectedTab(newValue)}
          sx={{ 
            mb: 4,
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTabs-indicator': {
              height: 3,
              borderRadius: '3px 3px 0 0'
            },
            width: '100%'
          }}
        >
          <Tab label="Equipment Overview" />
          <Tab label="Rental Analytics" />
        </Tabs>

        {selectedTab === 0 && (
          <Box sx={{ width: '100%', display: 'flex', gap: 2, flexDirection: { xs: 'column', lg: 'row' } }}>
            {/* Equipment Overview */}
            <Box sx={{ 
              flex: '1.2',
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column'
            }}>
              <Card sx={{ 
                height: '100%', 
                p: 3,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                background: theme.palette.background.paper,
                boxShadow: `0 0 20px ${alpha(theme.palette.primary.main, 0.08)}`
              }}>
                <Box sx={{ 
                  mb: 3, 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  pb: 2
                }}>
                  <Box>
                    <Typography variant="h6" fontWeight={600}>Equipment by Category</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      Distribution across {categoryData.length} categories
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    p: 1,
                    borderRadius: 1
                  }}>
                    <ConstructionIcon color="primary" fontSize="small" />
                    <Typography variant="body2" color="primary" fontWeight={500}>
                      Total: {totalEquipment}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ height: 400, width: '100%' }}>
                  <ResponsiveContainer>
                    <BarChart 
                      data={categoryData}
                      layout="vertical"
                      margin={{ top: 5, right: 45, bottom: 5, left: 0 }}
                    >
                      <XAxis
                        type="number"
                        tickMargin={10}
                        domain={[0, dataMax => Math.ceil(dataMax * 1.2)]}
                        tick={{ fill: theme.palette.text.secondary }}
                        axisLine={{ stroke: theme.palette.divider }}
                      />
                      <YAxis
                        type="category"
                        dataKey="category"
                        width={150}
                        tickMargin={10}
                        tick={{ fill: theme.palette.text.primary }}
                        axisLine={{ stroke: theme.palette.divider }}
                      />
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke={alpha(theme.palette.divider, 0.5)} />
                      <Bar 
                        dataKey="count" 
                        fill={theme.palette.primary.main}
                        radius={[0, 4, 4, 0]}
                        barSize={25}
                      >
                        <LabelList
                          dataKey="count"
                          position="right"
                          fill={theme.palette.text.primary}
                          formatter={value => `${value}`}
                          offset={5}
                        />
                      </Bar>
                      <RechartsTooltip
                        cursor={{ fill: alpha(theme.palette.primary.main, 0.1) }}
                        content={({ active, payload }) => {
                          if (active && payload?.[0]) {
                            return (
                              <Box sx={{
                                bgcolor: 'background.paper',
                                p: 1.5,
                                boxShadow: theme.shadows[3],
                                borderRadius: 1,
                                border: `1px solid ${theme.palette.divider}`
                              }}>
                                <Typography variant="body2" fontWeight={500} color="primary">
                                  {payload[0].payload.category}
                                </Typography>
                                <Box sx={{ 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  gap: 0.5,
                                  mt: 0.5 
                                }}>
                                  <Typography variant="body2" color="text.secondary">
                                    Items:
                                  </Typography>
                                  <Typography variant="body2" fontWeight={500}>
                                    {payload[0].value}
                                  </Typography>
                                </Box>
                              </Box>
                            );
                          }
                          return null;
                        }}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Card>
            </Box>

            {/* Equipment Status */}
            <Box sx={{ 
              flex: '0.8',
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column'
            }}>
              <Card sx={{ 
                height: '100%', 
                p: 3,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                background: theme.palette.background.paper,
                boxShadow: `0 0 20px ${alpha(theme.palette.primary.main, 0.08)}`
              }}>
                <Box sx={{ 
                  mb: 3, 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  pb: 2
                }}>
                  <Box>
                    <Typography variant="h6" fontWeight={600}>Equipment Status</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      Current availability overview
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ height: 400, width: '100%', position: 'relative' }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={equipmentStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={85}
                        outerRadius={125}
                        paddingAngle={3}
                        dataKey="value"
                        startAngle={90}
                        endAngle={450}
                      >
                        {equipmentStatusData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`}
                            fill={entry.color}
                            stroke={theme.palette.background.paper}
                            strokeWidth={2}
                          />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        content={({ active, payload }) => {
                          if (active && payload?.[0]) {
                            const percentage = ((payload[0].value / totalEquipment) * 100).toFixed(1);
                            return (
                              <Box sx={{
                                bgcolor: 'background.paper',
                                p: 1.5,
                                boxShadow: theme.shadows[3],
                                borderRadius: 1,
                                border: `1px solid ${theme.palette.divider}`
                              }}>
                                <Typography variant="body2" fontWeight={500} sx={{ color: payload[0].payload.color }}>
                                  {payload[0].name}
                                </Typography>
                                <Box sx={{ mt: 0.5 }}>
                                  <Typography variant="body2" color="text.secondary">
                                    {payload[0].value} items ({percentage}%)
                                  </Typography>
                                </Box>
                              </Box>
                            );
                          }
                          return null;
                        }}
                      />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        content={({ payload }) => (
                          <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'center', 
                            gap: 3,
                            mt: 2
                          }}>
                            {payload.map((entry, index) => (
                              <Box 
                                key={index} 
                                sx={{ 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  gap: 1,
                                  p: 1,
                                  borderRadius: 1,
                                  backgroundColor: alpha(entry.color, 0.1)
                                }}
                              >
                                <Box sx={{ 
                                  width: 10, 
                                  height: 10, 
                                  borderRadius: '50%',
                                  backgroundColor: entry.color 
                                }} />
                                <Typography 
                                  variant="body2" 
                                  fontWeight={500}
                                  sx={{ color: entry.color }}
                                >
                                  {entry.value}: {equipmentStatusData[index].value}
                                </Typography>
                              </Box>
                            ))}
                          </Box>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </Card>
            </Box>
          </Box>
        )}

        {selectedTab === 1 && (
          <Card 
            elevation={0} 
            sx={{ 
              width: '100%',
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
              background: theme.palette.background.paper,
              transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme.shadows[4]
              }
            }}
          >
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Monthly Rental Trends
              </Typography>
              <Box sx={{ height: 450, mt: 3, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyTrendsData}>
                    <defs>
                      <linearGradient id="colorRentals" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={theme.palette.success.main} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={theme.palette.success.main} stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                    <XAxis 
                      dataKey="month" 
                      stroke={theme.palette.text.secondary}
                      fontSize={12}
                      tickLine={false}
                      axisLine={{ stroke: theme.palette.divider }}
                    />
                    <YAxis 
                      stroke={theme.palette.text.secondary} 
                      fontSize={12}
                      tickLine={false}
                      axisLine={{ stroke: theme.palette.divider }}
                    />
                    <RechartsTooltip 
                      contentStyle={{ 
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 8,
                        boxShadow: theme.shadows[3]
                      }} 
                    />
                    <Area
                      type="monotone"
                      dataKey="rentals"
                      stroke={theme.palette.primary.main}
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorRentals)"
                      name="Rentals"
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke={theme.palette.success.main}
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                      name="Revenue"
                    />
                    <Legend 
                      verticalAlign="top" 
                      height={36}
                      iconSize={10}
                      iconType="circle"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        )}
      </Paper>
    </Box>
  );
};

export default DashboardPage;

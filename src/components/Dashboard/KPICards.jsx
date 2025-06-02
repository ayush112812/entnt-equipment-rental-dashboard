import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  LinearProgress,
  useTheme,
  useMediaQuery,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Construction as EquipmentIcon,
  Assignment as RentalIcon,
  Warning as WarningIcon,
  Build as MaintenanceIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { EQUIPMENT_STATUS, RENTAL_STATUS } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatUtils';

const EnhancedKPICards = ({ equipment, rentals, maintenance }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Enhanced KPI calculations
  const totalEquipment = equipment.length;
  const availableEquipment = equipment.filter(eq => eq.status === EQUIPMENT_STATUS.AVAILABLE).length;
  const rentedEquipment = equipment.filter(eq => eq.status === EQUIPMENT_STATUS.RENTED).length;
  const maintenanceEquipment = equipment.filter(eq => eq.status === EQUIPMENT_STATUS.MAINTENANCE).length;
  
  const activeRentals = rentals.filter(r => 
    r.status === RENTAL_STATUS.RENTED || r.status === RENTAL_STATUS.RESERVED
  ).length;
  
  const overdueRentals = rentals.filter(r => {
    if (r.status !== RENTAL_STATUS.RENTED) return false;
    return new Date(r.endDate) < new Date();
  }).length;
  
  const upcomingMaintenance = maintenance.filter(m => {
    const maintenanceDate = new Date(m.date);
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return maintenanceDate >= today && maintenanceDate <= nextWeek;
  }).length;

  // Calculate utilization rate
  const utilizationRate = totalEquipment > 0 ? (rentedEquipment / totalEquipment) * 100 : 0;
  
  // Calculate revenue
  const totalRevenue = rentals
    .filter(r => r.status === RENTAL_STATUS.RENTED || r.status === RENTAL_STATUS.RETURNED)
    .reduce((sum, r) => sum + (r.totalCost || 0), 0);

  const kpiData = [
    {
      title: 'Total Equipment',
      value: totalEquipment,
      icon: <EquipmentIcon />,
      color: theme.palette.primary.main,
      bgColor: theme.palette.primary.light + '20',
      subtitle: `${availableEquipment} available`,
      progress: (availableEquipment / Math.max(totalEquipment, 1)) * 100,
      trend: '+2.5%',
      trendDirection: 'up',
      details: [
        { label: 'Available', value: availableEquipment, color: 'success' },
        { label: 'Rented', value: rentedEquipment, color: 'info' },
        { label: 'Maintenance', value: maintenanceEquipment, color: 'warning' }
      ]
    },
    {
      title: 'Active Rentals',
      value: activeRentals,
      icon: <RentalIcon />,
      color: theme.palette.success.main,
      bgColor: theme.palette.success.light + '20',
      subtitle: `${utilizationRate.toFixed(1)}% utilization`,
      progress: utilizationRate,
      trend: '+12.3%',
      trendDirection: 'up',
      details: [
        { label: 'Reserved', value: rentals.filter(r => r.status === RENTAL_STATUS.RESERVED).length, color: 'info' },
        { label: 'Active', value: rentals.filter(r => r.status === RENTAL_STATUS.RENTED).length, color: 'success' }
      ]
    },
    {
      title: 'Overdue Rentals',
      value: overdueRentals,
      icon: <WarningIcon />,
      color: theme.palette.error.main,
      bgColor: theme.palette.error.light + '20',
      subtitle: overdueRentals > 0 ? 'Requires attention' : 'All on track',
      progress: overdueRentals > 0 ? 100 : 0,
      trend: overdueRentals > 0 ? '+5.2%' : '0%',
      trendDirection: overdueRentals > 0 ? 'up' : 'neutral',
      urgent: overdueRentals > 0
    },
    {
      title: 'Revenue This Month',
      value: formatCurrency(totalRevenue),
      icon: <TrendingUpIcon />,
      color: theme.palette.info.main,
      bgColor: theme.palette.info.light + '20',
      subtitle: 'Current month earnings',
      progress: 75, // Mock progress towards monthly goal
      trend: '+18.7%',
      trendDirection: 'up',
      isRevenue: true
    }
  ];

  return (
    <Grid container spacing={3}>
      {kpiData.map((kpi, index) => (
        <Grid item xs={12} sm={6} lg={3} key={index}>
          <Card 
            sx={{ 
              height: '100%',
              background: `linear-gradient(135deg, ${kpi.bgColor} 0%, ${theme.palette.background.paper} 100%)`,
              border: `1px solid ${kpi.color}20`,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
              overflow: 'hidden',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: `0 12px 40px ${kpi.color}30`,
                border: `1px solid ${kpi.color}40`,
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: `linear-gradient(90deg, ${kpi.color}, ${kpi.color}80)`,
              }
            }}
          >
            <CardContent sx={{ p: 3, position: 'relative' }}>
              {/* Header */}
              <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                <Box>
                  <Typography 
                    variant="h3" 
                    component="div" 
                    sx={{ 
                      color: kpi.color,
                      fontWeight: 700,
                      fontSize: isMobile ? '1.8rem' : '2.5rem',
                      lineHeight: 1,
                      mb: 0.5
                    }}
                  >
                    {kpi.isRevenue ? kpi.value : kpi.value.toLocaleString()}
                  </Typography>
                  <Typography 
                    variant="h6" 
                    component="div" 
                    sx={{ 
                      fontWeight: 600,
                      fontSize: isMobile ? '0.9rem' : '1.1rem',
                      color: 'text.primary',
                      mb: 0.5
                    }}
                  >
                    {kpi.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ fontSize: '0.85rem' }}
                  >
                    {kpi.subtitle}
                  </Typography>
                </Box>
                
                <Box display="flex" flexDirection="column" alignItems="center">
                  <Avatar 
                    sx={{ 
                      bgcolor: kpi.color,
                      width: isMobile ? 48 : 56, 
                      height: isMobile ? 48 : 56,
                      mb: 1,
                      boxShadow: `0 8px 16px ${kpi.color}40`
                    }}
                  >
                    {kpi.icon}
                  </Avatar>
                  
                  {/* Trend Indicator */}
                  <Chip
                    size="small"
                    icon={kpi.trendDirection === 'up' ? <TrendingUpIcon fontSize="small" /> : 
                          kpi.trendDirection === 'down' ? <TrendingDownIcon fontSize="small" /> : null}
                    label={kpi.trend}
                    color={kpi.trendDirection === 'up' ? 'success' : 
                           kpi.trendDirection === 'down' ? 'error' : 'default'}
                    variant="outlined"
                    sx={{ fontSize: '0.75rem', height: 24 }}
                  />
                </Box>
              </Box>

              {/* Progress Bar */}
              <Box mb={2}>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(kpi.progress || 0, 100)}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: `${kpi.color}20`,
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: kpi.color,
                      borderRadius: 4,
                    },
                  }}
                />
                <Typography 
                  variant="caption" 
                  color="text.secondary"
                  sx={{ mt: 0.5, display: 'block' }}
                >
                  {kpi.progress?.toFixed(1)}% {kpi.isRevenue ? 'of monthly goal' : 'capacity'}
                </Typography>
              </Box>

              {/* Details Chips */}
              {kpi.details && (
                <Box display="flex" gap={1} flexWrap="wrap">
                  {kpi.details.map((detail, idx) => (
                    <Chip
                      key={idx}
                      label={`${detail.label}: ${detail.value}`}
                      size="small"
                      color={detail.color}
                      variant="outlined"
                      sx={{ fontSize: '0.7rem', height: 20 }}
                    />
                  ))}
                </Box>
              )}

              {/* Urgent Indicator */}
              {kpi.urgent && (
                <Box 
                  position="absolute" 
                  top={16} 
                  right={16}
                  sx={{
                    animation: 'pulse 2s infinite',
                    '@keyframes pulse': {
                      '0%': { opacity: 1 },
                      '50%': { opacity: 0.5 },
                      '100%': { opacity: 1 },
                    },
                  }}
                >
                  <Tooltip title="Requires immediate attention">
                    <IconButton size="small" sx={{ color: 'error.main' }}>
                      <InfoIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default EnhancedKPICards;

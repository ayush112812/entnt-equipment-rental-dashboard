import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { hasPermission } from '../../utils/roleUtils';
import { Box, Typography, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRoles = null }) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return navigate('/login');
  }

  if (requiredRoles && !hasPermission(user?.role, requiredRoles)) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="50vh"
        sx={{ p: 3 }}
      >
        <Paper elevation={3} sx={{ padding: 4, textAlign: 'center', maxWidth: 400 }}>
          <Typography variant="h5" color="error" gutterBottom>
            Access Denied
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            You don't have permission to access this page. This area is restricted to {requiredRoles.join(' or ')} users.
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/dashboard')}
          >
            Return to Dashboard
          </Button>
        </Paper>
      </Box>
    );
  }

  return children;
};

export default ProtectedRoute;

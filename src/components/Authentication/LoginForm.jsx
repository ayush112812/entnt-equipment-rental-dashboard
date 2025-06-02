import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  useTheme,
  alpha,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const LoginForm = forwardRef((props, ref) => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, error, clearError } = useAuth();

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    fillDemoCredentials: (role) => {
      const credentials = {
        admin: { email: 'admin@entnt.in', password: 'admin123' },
        staff: { email: 'staff@entnt.in', password: 'staff123' },
        customer: { email: 'customer@entnt.in', password: 'cust123' }
      };
      
      if (credentials[role]) {
        setFormData(credentials[role]);
      }
    }
  }), []); // Empty dependency array since these values never change

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      return;
    }

    setIsSubmitting(true);
    await login(formData.email, formData.password);
    setIsSubmitting(false);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3,
            backgroundColor: alpha(theme.palette.error.main, 0.1),
            color: theme.palette.error.main,
            '& .MuiAlert-icon': {
              color: theme.palette.error.main
            }
          }}
        >
          {error}
        </Alert>
      )}

      <TextField
        fullWidth
        id="email"
        name="email"
        label="Email Address"
        value={formData.email}
        onChange={handleChange}
        margin="normal"
        variant="outlined"
        required
        autoComplete="email"
        autoFocus
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <EmailIcon color="action" />
            </InputAdornment>
          ),
        }}
        sx={{
          mb: 2,
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: alpha(theme.palette.primary.main, 0.2),
            },
            '&:hover fieldset': {
              borderColor: alpha(theme.palette.primary.main, 0.5),
            },
            '&.Mui-focused fieldset': {
              borderColor: theme.palette.primary.main,
            },
          },
        }}
      />

      <TextField
        fullWidth
        id="password"
        name="password"
        label="Password"
        type={showPassword ? 'text' : 'password'}
        value={formData.password}
        onChange={handleChange}
        margin="normal"
        variant="outlined"
        required
        autoComplete="current-password"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LockIcon color="action" />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
                size="large"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          mb: 3,
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: alpha(theme.palette.primary.main, 0.2),
            },
            '&:hover fieldset': {
              borderColor: alpha(theme.palette.primary.main, 0.5),
            },
            '&.Mui-focused fieldset': {
              borderColor: theme.palette.primary.main,
            },
          },
        }}
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={isSubmitting}
        sx={{
          mt: 2,
          mb: 2,
          py: 1.5,
          fontSize: '1rem',
          fontWeight: 600,
          textTransform: 'none',
          borderRadius: '10px',
          boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.15)}`,
          '&:hover': {
            boxShadow: `0 12px 32px ${alpha(theme.palette.primary.main, 0.18)}`,
          },
          position: 'relative'
        }}
      >
        {isSubmitting ? (
          <CircularProgress
            size={24}
            sx={{
              color: theme.palette.primary.contrastText,
              position: 'absolute',
              top: '50%',
              left: '50%',
              marginTop: '-12px',
              marginLeft: '-12px',
            }}
          />
        ) : (
          'Sign In'
        )}
      </Button>

      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Need a demo account?{' '}
          <Button
            variant="text"
            size="small"
            onClick={() => {
              const credentials = {
                admin: { email: 'admin@entnt.in', password: 'admin123' },
                staff: { email: 'staff@entnt.in', password: 'staff123' },
                customer: { email: 'customer@entnt.in', password: 'cust123' }
              };
              setFormData(credentials.customer);
            }}
            sx={{ 
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.05)
              }
            }}
          >
            Try Customer Demo
          </Button>
        </Typography>
      </Box>
    </Box>
  );
});

LoginForm.displayName = 'LoginForm';

export default LoginForm;

import React, { useRef } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  useTheme,
  alpha,
  Button,
  Divider,
  IconButton
} from '@mui/material';
import LoginForm from '../components/Authentication/LoginForm';
import { Construction as ConstructionIcon } from '@mui/icons-material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useThemeMode } from '../contexts/ThemeContext';

const LoginPage = () => {
  const theme = useTheme();
  const { darkMode, toggleDarkMode } = useThemeMode();
  const loginFormRef = useRef(null);

  const handleDemoLogin = (role) => {
    if (loginFormRef.current) {
      loginFormRef.current.fillDemoCredentials(role);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`,
        py: 4,
        position: 'relative'
      }}
    >
      {/* Dark Mode Toggle */}
      <IconButton
        onClick={toggleDarkMode}
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          backgroundColor: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: 'blur(8px)',
          '&:hover': {
            backgroundColor: alpha(theme.palette.background.paper, 0.9),
          }
        }}
      >
        {darkMode ? <Brightness7 /> : <Brightness4 />}
      </IconButton>

      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 3,
            border: `1px solid ${theme.palette.divider}`,
            background: theme.palette.background.paper,
            boxShadow: `0 10px 40px ${alpha(theme.palette.primary.main, 0.1)}`,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Background Pattern */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '150px',
              height: '150px',
              background: `radial-gradient(circle at top right, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 70%)`,
              pointerEvents: 'none'
            }}
          />

          {/* Logo and Title */}
          <Box sx={{ textAlign: 'center', mb: 4, position: 'relative' }}>
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: '20px',
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                mb: 2
              }}
            >
              <ConstructionIcon
                color="primary"
                sx={{ fontSize: 32 }}
              />
            </Box>
            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom
              sx={{ 
                fontWeight: 700,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              ENTNT
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{ mb: 3 }}
            >
              Equipment Rental Management System
            </Typography>
            <Divider sx={{ mb: 4 }} />
          </Box>

          {/* Login Form */}
          <LoginForm ref={loginFormRef} />

          {/* Demo Account Info */}
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Try our demo accounts:
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              gap: 1, 
              justifyContent: 'center',
              flexWrap: 'wrap',
              mt: 1
            }}>
              <Button
                size="small"
                variant="outlined"
                onClick={() => handleDemoLogin('admin')}
                sx={{
                  borderColor: alpha(theme.palette.primary.main, 0.3),
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    backgroundColor: alpha(theme.palette.primary.main, 0.05)
                  }
                }}
              >
                Admin Demo
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={() => handleDemoLogin('staff')}
                sx={{
                  borderColor: alpha(theme.palette.primary.main, 0.3),
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    backgroundColor: alpha(theme.palette.primary.main, 0.05)
                  }
                }}
              >
                Staff Demo
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={() => handleDemoLogin('customer')}
                sx={{
                  borderColor: alpha(theme.palette.primary.main, 0.3),
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    backgroundColor: alpha(theme.palette.primary.main, 0.05)
                  }
                }}
              >
                Customer Demo
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;

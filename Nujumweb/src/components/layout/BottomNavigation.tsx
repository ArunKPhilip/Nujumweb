import React from 'react';
import {
  BottomNavigation as MuiBottomNavigation,
  BottomNavigationAction,
  Paper,
  Badge,
} from '@mui/material';
import {
  Home as HomeIcon,
  LocalHospital as CareIcon,
  LocalHospital,
  People as CommunityIcon,
  Business as ProgramsIcon,
  ShoppingCart as MarketplaceIcon,
  School as EducationIcon,
  Assignment as ServiceRequestIcon,
  Person as ProfileIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

export const BottomNavigation: React.FC = () => {
  const { state } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Hide bottom navigation on non-authenticated pages or if screen is desktop-sized
  if (!state.isAuthenticated) {
    return null;
  }

  const navigationItems = [
    {
      label: state.language === 'en' ? 'Dashboard' : 'لوحة التحكم',
      value: '/dashboard',
      icon: <HomeIcon />,
      aria: state.language === 'en' ? 'Go to Dashboard' : 'الذهاب إلى لوحة التحكم',
    },
    {
      label: state.language === 'en' ? 'Find Care' : 'العثور على الرعاية',
      value: '/find-care',
      icon: <CareIcon />,
      aria: state.language === 'en' ? 'Healthcare Provider Search' : 'البحث عن مقدمي الرعاية الصحية',
      badge: 0,
    },
    {
      label: state.language === 'en' ? 'Care' : 'الرعاية',
      value: '/care',
      icon: <LocalHospital />,
      aria: state.language === 'en' ? 'Healthcare Access' : 'الوصول إلى الرعاية الصحية',
      badge: 0,
    },
    {
      label: state.language === 'en' ? 'Marketplace' : 'السوق',
      value: '/marketplace',
      icon: <MarketplaceIcon />,
      aria: state.language === 'en' ? 'Assistive Devices' : 'الأجهزة المساعدة',
    },
    {
      label: state.language === 'en' ? 'Services' : 'الخدمات',
      value: '/services',
      icon: <ServiceRequestIcon />,
      aria: state.language === 'en' ? 'Service Requests' : 'طلبات الخدمة',
      badge: 2,
    },
    {
      label: state.language === 'en' ? 'Profile' : 'الملف الشخصي',
      value: '/profile',
      icon: <ProfileIcon />,
      aria: state.language === 'en' ? 'Profile Settings' : 'إعدادات الملف الشخصي',
    },
  ];

  // Simplified navigation for better UX
  const simplifiedItems = [
    {
      label: state.language === 'en' ? 'Home' : 'الرئيسية',
      value: '/dashboard',
      icon: <HomeIcon />,
    },
    {
      label: state.language === 'en' ? 'Find Care' : 'العثور على الرعاية',
      value: '/find-care',
      icon: <CareIcon />,
    },
    {
      label: state.language === 'en' ? 'Market' : 'السوق',
      value: '/marketplace',
      icon: <MarketplaceIcon />,
    },
    {
      label: state.language === 'en' ? 'Profile' : 'الملف',
      value: '/profile',
      icon: <ProfileIcon />,
    },
  ];

  // Determine current value based on pathname
  const getCurrentValue = () => {
    for (const item of navigationItems) {
      if (location.pathname.startsWith(item.value)) {
        return item.value;
      }
    }
    return '/dashboard'; // Default to dashboard
  };

  const handleNavigationChange = (_event: React.SyntheticEvent, newValue: string) => {
    navigate(newValue);
  };

  // Use simplified navigation for retained bottom nav
  const useItems = simplifiedItems;

  return (
    <>
      {/* Mobile retained navigation */}
      <Paper
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1100,
          display: { xs: 'block', sm: 'block' }, // Retained on all screens
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
        elevation={8}
      >
        <MuiBottomNavigation
          showLabels
          value={getCurrentValue()}
          onChange={handleNavigationChange}
          sx={{
            height: { xs: 70, sm: 60 },
            backgroundColor: (theme) => theme.palette.background.paper,
            '& .MuiBottomNavigationAction-root': {
              minWidth: 0,
              maxWidth: 'none',
              flex: '1',
              padding: '4px 2px',
              fontSize: { xs: '0.7rem', sm: '0.75rem' },
              '& .MuiBottomNavigationAction-label': {
                fontSize: { xs: '0.7rem', sm: '0.75rem' },
                mt: '2px',
                fontWeight: 'medium',
              },
              '&.Mui-selected': {
                color: (theme) => theme.palette.primary.main,
                '& .MuiBottomNavigationAction-label': {
                  fontSize: { xs: '0.7rem', sm: '0.75rem' },
                  fontWeight: 'bold',
                },
              },
            },
          }}
        >
          {useItems.map((item) => (
            <BottomNavigationAction
              key={item.value}
              label={item.label}
              value={item.value}
              icon={item.icon}
              aria-label={item.label}
              sx={{
                minWidth: 'auto',
                padding: '6px 2px',
                '& .MuiBottomNavigationAction-icon': {
                  fontSize: { xs: '1.25rem', sm: '1.5rem' },
                },
              }}
            />
          ))}
        </MuiBottomNavigation>
      </Paper>
    </>
  );
};

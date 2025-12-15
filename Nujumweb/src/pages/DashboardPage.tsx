import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Avatar,
  Fab,
} from '@mui/material';
import {
  WbSunny as SunnyIcon,
  LocationOn as LocationIcon,
  Home as HomeIcon,
  Explore as ExploreIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  LocalHospital as CareIcon,
  CalendarMonth as AppointmentsIcon,
  CardGiftcard as BenefitsIcon,
  ShoppingBag as MarketplaceIcon,
  Work as JobsIcon,
  Groups as CommunityIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const { state } = useAuth();
  const navigate = useNavigate();
  const [currentNavIndex, setCurrentNavIndex] = useState(0);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const userName = state.user?.username || 'User';

  const services = [
    {
      icon: CareIcon,
      title: state.language === 'en' ? 'Find Care' : 'البحث عن الرعاية',
      subtitle: state.language === 'en' ? 'Healthcare providers' : 'مقدمي الرعاية الصحية',
      route: '/care',
      color: '#F44336',
    },
    {
      icon: AppointmentsIcon,
      title: state.language === 'en' ? 'Appointments' : 'المواعيد',
      subtitle: state.language === 'en' ? 'Manage bookings' : 'إدارة الحجوزات',
      route: '/care',
      color: '#2196F3',
    },
    {
      icon: BenefitsIcon,
      title: state.language === 'en' ? 'Benefits' : 'المزايا',
      subtitle: state.language === 'en' ? 'Support programs' : 'برامج الدعم',
      route: '/programs',
      color: '#4CAF50',
    },
    {
      icon: MarketplaceIcon,
      title: state.language === 'en' ? 'Marketplace' : 'السوق',
      subtitle: state.language === 'en' ? 'Buy & sell items' : 'شراء وبيع العناصر',
      route: '/marketplace',
      color: '#E91E63',
    },
    {
      icon: JobsIcon,
      title: state.language === 'en' ? 'Jobs & Training' : 'الوظائف والتدريب',
      subtitle: state.language === 'en' ? 'Career opportunities' : 'فرص التوظيف',
      route: '/education',
      color: '#FF9800',
    },
    {
      icon: CommunityIcon,
      title: state.language === 'en' ? 'Community' : 'المجتمع',
      subtitle: state.language === 'en' ? 'Connect & share' : 'تواصل ومشاركة',
      route: '/community',
      color: '#9C27B0',
    },
  ];

  const navigationItems = [
    { icon: HomeIcon, label: state.language === 'en' ? 'Home' : 'الرئيسية' },
    { icon: ExploreIcon, label: state.language === 'en' ? 'Explore' : 'استكشف' },
    { icon: NotificationsIcon, label: state.language === 'en' ? 'Alerts' : 'التنبيهات' },
    { icon: PersonIcon, label: state.language === 'en' ? 'Profile' : 'الملف الشخصي', route: '/profile' },
  ];

  const handleNavigate = (route: string) => {
    navigate(route);
  };

  const handleNavTap = (index: number) => {
    setCurrentNavIndex(index);
    if (index === 3) { // Profile
      navigate('/profile');
    }
  };

  const renderServiceCard = (service: any) => (
    <Card
      sx={{
        height: 120,
        cursor: 'pointer',
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
        },
        transition: 'all 0.3s ease',
      }}
      onClick={() => handleNavigate(service.route)}
    >
      <CardContent sx={{ p: 3, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{
          width: 48,
          height: 48,
          borderRadius: 2,
          bgcolor: service.color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 1,
        }}>
          {React.createElement(service.icon, { sx: { color: 'white', fontSize: 24 } })}
        </Box>
        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 0.5 }}>
          {service.title}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {service.subtitle}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{
      minHeight: '100vh',
      background: `
        radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 40% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
        linear-gradient(135deg, #667eea 0%, #764ba2 100%)
      `,
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Animated background particles */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
      }}>
        {[...Array(100)].map((_, i) => (
          <Box
            key={i}
            sx={{
              position: 'absolute',
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `twinkle ${Math.random() * 3 + 2}s infinite`,
            }}
          />
        ))}
      </Box>

      <Container maxWidth="lg" sx={{ py: 4, position: 'relative', zIndex: 1 }}>
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h4"
                fontWeight={500}
                sx={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  mb: 1,
                  fontSize: { xs: '1.75rem', md: '2.25rem' }
                }}
              >
                {state.language === 'en'
                  ? `Marhaba, ${userName} 🌙`
                  : `مرحبا، ${userName} 🌙`
                }
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  lineHeight: 1.6,
                  maxWidth: 400,
                }}
              >
                {state.language === 'en'
                  ? 'Every star has a story. What\'s yours today?'
                  : 'كل نجم له قصة. ما هي قصتك اليوم؟'
                }
              </Typography>
            </Box>
            <Avatar
              sx={{
                width: 64,
                height: 64,
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
              }}
            >
              {userName.charAt(0).toUpperCase()}
            </Avatar>
          </Box>

          {/* Weather Widget */}
          <Card
            sx={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: 3,
              mb: 4,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2,
                }}>
                  <SunnyIcon sx={{ color: '#FFD700', fontSize: 28 }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                    {state.language === 'en' ? 'Dubai, UAE' : 'دبي، الإمارات'}
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    28°C • {state.language === 'en' ? 'Sunny' : 'مشمس'}
                  </Typography>
                </Box>
                <LocationIcon sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 24 }} />
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Services Grid */}
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)'
          },
          gap: 3,
          mb: 4,
        }}>
          {services.map((service, index) => (
            <Box key={index}>
              {renderServiceCard(service)}
            </Box>
          ))}
        </Box>
      </Container>

      {/* Quick Stats Cards */}
      <Card
        sx={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: 3,
          mb: 4,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 2 }}>
            {state.language === 'en' ? 'Quick Stats' : 'الإحصائيات السريعة'}
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            <Box>
              <Typography variant="h4" sx={{ color: '#4CAF50', fontWeight: 700 }}>
                3
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                {state.language === 'en' ? 'Active Services' : 'خدمات نشطة'}
              </Typography>
            </Box>
            <Box>
              <Typography variant="h4" sx={{ color: '#2196F3', fontWeight: 700 }}>
                2
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                {state.language === 'en' ? 'Appointments' : 'مواعيد'}
              </Typography>
            </Box>
            <Box>
              <Typography variant="h4" sx={{ color: '#FF9800', fontWeight: 700 }}>
                5
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                {state.language === 'en' ? 'Community Posts' : 'منشورات المجتمع'}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <style>
        {`
          @keyframes twinkle {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 1; }
          }
        `}
      </style>
    </Box>
  );
};

export default DashboardPage;

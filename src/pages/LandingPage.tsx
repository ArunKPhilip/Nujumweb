import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useAuth();
  const theme = useTheme();

  const handleGetStarted = () => {
    if (state.isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <Box sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: 'calc(100vh - 64px)', py: 4 }}>
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', color: 'white', mb: 8 }}>
          <Typography
            variant="h2"
            component="h1"
            fontWeight={700}
            sx={{
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              mb: 3,
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            NUJJUM
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontSize: { xs: '1.25rem', md: '1.5rem' },
              mb: 4,
              opacity: 0.9,
            }}
          >
            Empowering Persons with Disabilities through Accessibility, Care, and Opportunity
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mb: 6,
              maxWidth: 600,
              mx: 'auto',
              lineHeight: 1.6,
            }}
          >
            Access healthcare, verified benefits, assistive technology, education, community support,
            and emergency services - all from one adaptive platform designed for accessibility.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={handleGetStarted}
            sx={{
              py: 2,
              px: 6,
              fontSize: '1.2rem',
              fontWeight: 600,
              borderRadius: 3,
              bgcolor: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: '2px solid rgba(255,255,255,0.3)',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.3)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            {state.isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
          </Button>
        </Box>

        {/* Features Grid */}
        <Box sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)'
          },
        }}>
          {[
            {
              title: 'Healthcare Access',
              description: 'Connect with verified healthcare providers, schedule appointments, and manage medical records.',
              color: '#4CAF50',
            },
            {
              title: 'Benefit Programs',
              description: 'Discover and apply for government and private programs tailored to your needs.',
              color: '#2196F3',
            },
            {
              title: 'Assistive Technology',
              description: 'Browse and purchase assistive devices with subsidy support and expert guidance.',
              color: '#FF9800',
            },
            {
              title: 'Education & Career',
              description: 'Access courses, certifications, job opportunities, and career counseling.',
              color: '#E91E63',
            },
            {
              title: 'Community Support',
              description: 'Connect with peers, share experiences, and build a supportive network.',
              color: '#9C27B0',
            },
            {
              title: 'Emergency Services',
              description: '24/7 emergency support with one-tap access to critical services.',
              color: '#F44336',
            },
          ].map((feature, index) => (
            <Card
              key={index}
              sx={{
                height: '100%',
                textAlign: 'center',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                },
                border: `2px solid ${feature.color}20`,
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    bgcolor: feature.color,
                    mx: 'auto',
                    mb: 3,
                  }}
                />
                <Typography variant="h6" component="h3" fontWeight={600} sx={{ mb: 2 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default LandingPage;

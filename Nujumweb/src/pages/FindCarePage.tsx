import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Chip,
  Card,
  CardContent,
  Avatar,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Snackbar,
  Alert,
  Rating,
  Divider,
} from '@mui/material';
import {
  Search as SearchIcon,
  LocationOn as LocationIcon,
  Star as StarIcon,
  AccessTime as TimeIcon,
  Phone as PhoneIcon,
  Verified as VerifiedIcon,
  Map as MapIcon,
  List as ListIcon,
  AttachMoney as MoneyIcon,
  LocalHospital as HospitalIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Mock clinic data (matching Flutter exactly)
const mockClinics = [
  {
    id: '1',
    name: 'Hope Springs Clinic',
    distance: 1.8,
    rating: 4.2,
    slot: 'Today, 3:00 PM',
    verified: true,
    free: false,
    type: 'Physio',
    phone: '+971 50 123 4567',
    address: 'Dubai Healthcare City',
    services: ['Physical Therapy', 'Occupational Therapy', 'Speech Therapy', 'Counseling']
  },
  {
    id: '2',
    name: 'Serene Minds Therapy',
    distance: 3.2,
    rating: 5.0,
    slot: 'Tomorrow, 10:00 AM',
    verified: true,
    free: true,
    type: 'Mental Health',
    phone: '+971 50 234 5678',
    address: 'Virtual Meeting',
    services: ['Counseling', 'Mental Health Therapy', 'Group Sessions']
  },
  {
    id: '3',
    name: 'Wellness Recovery Center',
    distance: 2.5,
    rating: 4.8,
    slot: 'Tomorrow, 2:30 PM',
    verified: true,
    free: false,
    type: 'Physio',
    phone: '+971 50 345 6789',
    address: 'Abu Dhabi, Al Reem Island',
    services: ['Physical Therapy', 'Rehabilitation', 'Fitness Training']
  },
  {
    id: '4',
    name: 'Bright Future Rehabilitation',
    distance: 4.1,
    rating: 4.5,
    slot: 'Today, 5:00 PM',
    verified: false,
    free: true,
    type: 'Occupational',
    phone: '+971 50 456 7890',
    address: 'Sharjah Social Center',
    services: ['Occupational Therapy', 'Daily Living Skills', 'Home Adaptation']
  },
];

const FindCarePage: React.FC = () => {
  const { state } = useAuth();
  const navigate = useNavigate();
  const [isMapView, setIsMapView] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [clinicDetailsOpen, setClinicDetailsOpen] = useState<{ open: boolean; clinic?: any }>({ open: false });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({ open: false, message: '', severity: 'success' });

  const getFilteredClinics = () => {
    let clinics = mockClinics;

    if (selectedFilter === 'All') return clinics;
    if (selectedFilter === 'Govt-Approved') {
      clinics = clinics.filter(clinic => clinic.verified);
    } else if (selectedFilter === 'Free') {
      clinics = clinics.filter(clinic => clinic.free);
    } else if (selectedFilter === 'Physio') {
      clinics = clinics.filter(clinic => clinic.type === 'Physio');
    }

    if (searchQuery.trim()) {
      clinics = clinics.filter(clinic =>
        clinic.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return clinics;
  };

  const handleBookAppointment = (clinicName: string) => {
    setSnackbar({ open: true, message: `Booking ${clinicName}...`, severity: 'info' });
  };

  const handleTeleconsult = (clinicName: string) => {
    setSnackbar({ open: true, message: `Starting teleconsult with ${clinicName}...`, severity: 'info' });
  };

  const handleSnackBarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const renderClinicCard = (clinic: any) => (
    <Card
      sx={{
        mb: 2,
        cursor: 'pointer',
        '&:hover': { boxShadow: 3 },
        border: '1px solid',
        borderColor: 'divider',
      }}
      onClick={() => setClinicDetailsOpen({ open: true, clinic })}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: 'primary.main',
              mr: 2,
              borderRadius: 2,
            }}
          >
            <HospitalIcon sx={{ fontSize: 36, color: 'white' }} />
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" fontWeight={600}>
                  {clinic.name}
                </Typography>
                {clinic.verified && (
                  <Chip
                    icon={<VerifiedIcon sx={{ fontSize: 16 }} />}
                    label={state.language === 'en' ? 'Verified' : 'موثوق'}
                    size="small"
                    sx={{
                      bgcolor: 'success.main',
                      color: 'white',
                      fontWeight: 600,
                      mt: 0.5,
                    }}
                  />
                )}
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {clinic.distance} km away
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Rating value={clinic.rating} readOnly size="small" sx={{ mr: 1 }} />
              <Typography variant="body2" sx={{ mr: 2 }}>
                {clinic.rating}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TimeIcon sx={{ fontSize: 16, mr: 0.5, color: 'success.main' }} />
              <Typography variant="body2" color="success.main">
                {clinic.slot}
              </Typography>
            </Box>

            {clinic.free && (
              <Box sx={{
                bgcolor: 'success.main',
                color: 'white',
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
                display: 'inline-block',
                mb: 2,
              }}>
                <Typography variant="caption" fontWeight={700}>
                  FREE
                </Typography>
              </Box>
            )}<Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {clinic.distance} km away
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Rating value={clinic.rating} readOnly size="small" sx={{ mr: 1 }} />
              <Typography variant="body2" sx={{ mr: 2 }}>
                {clinic.rating}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TimeIcon sx={{ fontSize: 16, mr: 0.5, color: 'success.main' }} />
              <Typography variant="body2" color="success.main">
                {clinic.slot}
              </Typography>
            </Box>

            {clinic.free && (
              <Box sx={{
                bgcolor: 'success.main',
                color: 'white',
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
                display: 'inline-block',
                mb: 2,
              }}>
                <Typography variant="caption" fontWeight={700}>
                  FREE
                </Typography>
              </Box>
            )}

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                onClick={(e) => {
                  e.stopPropagation();
                  handleBookAppointment(clinic.name);
                }}
                fullWidth
              >
                {state.language === 'en' ? 'Book' : 'حجز'}
              </Button>
              <Button
                variant="outlined"
                onClick={(e) => {
                  e.stopPropagation();
                  handleTeleconsult(clinic.name);
                }}
                fullWidth
              >
                {state.language === 'en' ? 'Teleconsult' : 'الاستشارة عن بعد'}
              </Button>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const renderMapView = () => (
    <Box sx={{ textAlign: 'center', py: 8 }}>
      <MapIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
      <Typography variant="h5" sx={{ mb: 2 }}>
        {state.language === 'en' ? 'Map View' : 'عرض الخريطة'}
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
        {state.language === 'en' ? 'Google Maps integration required' : 'يتطلب تكامل خرائط جوجل'}
      </Typography>
      <Button
        variant="contained"
        startIcon={<ListIcon />}
        onClick={() => setIsMapView(false)}
      >
        {state.language === 'en' ? 'Switch to List View' : 'التبديل إلى عرض القائمة'}
      </Button>
    </Box>
  );

  const renderEmptyState = (title: string, message: string) => (
    <Box sx={{ textAlign: 'center', py: 8 }}>
      <SearchIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
      <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
        {title}
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary' }}>
        {message}
      </Typography>
    </Box>
  );

  const filteredClinics = getFilteredClinics();

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" fontWeight={600}>
            {state.language === 'en' ? 'Find Care' : 'العثور على الرعاية'}
          </Typography>
          <IconButton onClick={() => setIsMapView(!isMapView)}>
            {isMapView ? <ListIcon /> : <MapIcon />}
          </IconButton>
        </Box>

        {/* Search and Filters */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder={state.language === 'en' ? 'Search for clinics, therapists...' : 'البحث عن العيادات، المعالجين...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              endAdornment: searchQuery && (
                <IconButton onClick={() => setSearchQuery('')} size="small">
                  <span style={{ fontSize: '18px' }}>×</span>
                </IconButton>
              ),
            }}
            sx={{ mb: 2 }}
          />

          <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 1 }}>
            {['All', 'Govt-Approved', 'Free', 'Physio'].map(filter => (
              <Chip
                key={filter}
                label={filter.replace('-', ' ')}
                clickable
                variant={selectedFilter === filter ? 'filled' : 'outlined'}
                color={selectedFilter === filter ? 'primary' : 'default'}
                onClick={() => setSelectedFilter(filter)}
                sx={{ flexShrink: 0 }}
              />
            ))}
          </Box>
        </Box>

        {/* Content */}
        {isMapView ? renderMapView() : (
          filteredClinics.length > 0 ? (
            filteredClinics.map(clinic => renderClinicCard(clinic))
          ) : (
            renderEmptyState(
              'No clinics found',
              'Try adjusting your filters'
            )
          )
        )}

        {/* Clinic Details Dialog */}
        <Dialog
          open={clinicDetailsOpen.open}
          onClose={() => setClinicDetailsOpen({ open: false })}
          maxWidth="sm"
          fullWidth
          sx={{
            '& .MuiDialog-paper': {
              borderRadius: '16px 16px 0 0',
            },
          }}
        >
          <DialogTitle sx={{
            display: 'flex',
            alignItems: 'center',
            px: 3,
            py: 2,
          }}>
            <Box sx={{
              width: 4,
              height: 4,
              bgcolor: 'text.secondary',
              borderRadius: '50%',
              opacity: 0.3,
              mx: 'auto',
            }} />
          </DialogTitle>
          <DialogContent sx={{ p: 0 }}>
            {clinicDetailsOpen.clinic && (
              <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    sx={{
                      width: 60,
                      height: 60,
                      bgcolor: 'primary.main',
                      mr: 2,
                      borderRadius: 2,
                    }}
                  >
                    <HospitalIcon sx={{ fontSize: 32, color: 'white' }} />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h5" fontWeight={600}>
                      {clinicDetailsOpen.clinic.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {clinicDetailsOpen.clinic.verified && (
                        <VerifiedIcon sx={{ fontSize: 16, color: 'success.main', mr: 0.5 }} />
                      )}
                      <Typography variant="body2" color="text.secondary">
                        {clinicDetailsOpen.clinic.distance} km away
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
                    <StarIcon sx={{ color: 'warning.main', mb: 0.5 }} />
                    <Typography variant="h6" fontWeight={700}>{clinicDetailsOpen.clinic.rating}/5.0</Typography>
                    <Typography variant="caption" color="text.secondary">Rating</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
                    <TimeIcon sx={{ color: 'success.main', mb: 0.5 }} />
                    <Typography variant="body2" fontWeight={600}>{clinicDetailsOpen.clinic.slot}</Typography>
                    <Typography variant="caption" color="text.secondary">Next Slot</Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    {state.language === 'en' ? 'Services' : 'الخدمات'}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {clinicDetailsOpen.clinic.services.map((service: string) => (
                      <Chip
                        key={service}
                        label={service}
                        variant="outlined"
                        size="small"
                      />
                    ))}
                  </Box>
                </Box>

                <Box sx={{ display: 'grid', gap: 1, mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PhoneIcon sx={{ mr: 2, color: 'text.secondary', fontSize: 20 }} />
                    <Typography variant="body2">{clinicDetailsOpen.clinic.phone}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocationIcon sx={{ mr: 2, color: 'text.secondary', fontSize: 20 }} />
                    <Typography variant="body2">{clinicDetailsOpen.clinic.address}</Typography>
                  </Box>
                  {clinicDetailsOpen.clinic.free && (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <MoneyIcon sx={{ mr: 2, color: 'success.main', fontSize: 20 }} />
                      <Typography variant="body2" color="success.main" fontWeight={600}>FREE</Typography>
                    </Box>
                  )}
                </Box>

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={() => setClinicDetailsOpen({ open: false })}
                    fullWidth
                  >
                    {state.language === 'en' ? 'Close' : 'إغلاق'}
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => {
                      handleBookAppointment(clinicDetailsOpen.clinic.name);
                      navigate('/care');
                    }}
                    fullWidth
                  >
                    {state.language === 'en' ? 'Book Appointment' : 'حجز موعد'}
                  </Button>
                </Box>
              </Box>
            )}
          </DialogContent>
        </Dialog>

        {/* Snackbar */}
        <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleSnackBarClose}>
          <Alert onClose={handleSnackBarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default FindCarePage;

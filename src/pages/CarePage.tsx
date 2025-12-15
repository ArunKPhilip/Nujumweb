import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Button,
  Fab,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Rating,
  DialogContentText,
  Snackbar,
  Alert,
  Avatar,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  LocalHospital as HospitalIcon,
  Person as PersonIcon,
  MedicalServices as MedicalIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  VideoCall as VideoIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  EditCalendar as EditCalendarIcon,
  Cancel as CancelIcon,
  Star as StarIcon,
  Refresh as RefreshIcon,
  Directions as DirectionsIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  WarningAmber as WarningIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

// Mock appointment data (matching Flutter data)
const upcomingAppointments = [
  {
    id: 1,
    clinicName: 'Hope Springs Clinic',
    doctorName: 'Dr. Sarah Ahmed',
    specialty: 'Physical Therapist',
    date: '2025-11-15',
    time: '10:00 AM',
    duration: '45 mins',
    type: 'In-Person' as const,
    status: 'confirmed' as const,
    address: 'Dubai Healthcare City, Building 27',
    phone: '+971 50 123 4567',
    color: '#4CAF50',
  },
  {
    id: 2,
    clinicName: 'Serene Minds Therapy',
    doctorName: 'Dr. Mohammed Hassan',
    specialty: 'Clinical Psychologist',
    date: '2025-11-18',
    time: '2:30 PM',
    duration: '60 mins',
    type: 'Teleconsult' as const,
    status: 'confirmed' as const,
    address: 'Virtual Meeting',
    phone: '+971 50 234 5678',
    color: '#2196F3',
  },
];

const pastAppointments = [
  {
    id: 3,
    clinicName: 'Hope Springs Clinic',
    doctorName: 'Dr. Sarah Ahmed',
    specialty: 'Physical Therapist',
    date: '2024-10-15',
    time: '10:00 AM',
    duration: '45 mins',
    type: 'In-Person' as const,
    status: 'completed' as const,
    rating: 5,
    address: 'Dubai Healthcare City, Building 27',
    phone: '+971 50 123 4567',
    color: '#4CAF50',
  },
  {
    id: 4,
    clinicName: 'Bright Future Center',
    doctorName: 'Dr. Ali Rahman',
    specialty: 'Speech Therapist',
    date: '2024-10-08',
    time: '3:00 PM',
    duration: '30 mins',
    type: 'Teleconsult' as const,
    status: 'completed' as const,
    rating: 4,
    address: 'Virtual Meeting',
    phone: '+971 50 456 7890',
    color: '#9C27B0',
  },
];

const CarePage: React.FC = () => {
  const { state } = useAuth();
  const [selectedTab, setSelectedTab] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [bookDialogOpen, setBookDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'warning' | 'info' }>({ open: false, message: '', severity: 'success' });

  const [rescheduleDialog, setRescheduleDialog] = useState<{ open: boolean; appointment: any; newDate: string; newTime: string }>({ open: false, appointment: null, newDate: '', newTime: '' });
  const [cancelDialog, setCancelDialog] = useState<{ open: boolean; appointment: any }>({ open: false, appointment: null });
  const [ratingDialog, setRatingDialog] = useState<{ open: boolean; appointment: any; rating: number }>({ open: false, appointment: null, rating: 5 });
  const [detailsDialog, setDetailsDialog] = useState<{ open: boolean; appointment: any }>({ open: false, appointment: null });

  const [filterOptions, setFilterOptions] = useState({
    inPersonOnly: false,
    teleconsultOnly: false,
    thisWeek: false,
  });

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleSnackBarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return '#4CAF50';
      case 'pending': return '#FF9800';
      case 'cancelled': return '#F44336';
      case 'completed': return '#2196F3';
      default: return '#757575';
    }
  };

  const getTypeIcon = (type: string) => {
    return type === 'Teleconsult' ? VideoIcon : LocationIcon;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  const renderAppointmentCard = (appointment: any, isUpcoming = false) => {
    return (
      <Card
        sx={{
          mb: 2,
          cursor: 'pointer',
          '&:hover': { boxShadow: 3 },
          border: `1px solid ${appointment.color}20`,
        }}
        onClick={() => setDetailsDialog({ open: true, appointment })}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', mb: 2 }}>
            <Avatar sx={{ bgcolor: appointment.color, mr: 2 }}>
              <HospitalIcon sx={{ color: 'white' }} />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" fontWeight={600}>
                {appointment.clinicName}
              </Typography>
              <Typography variant="body2" color="primary" fontWeight={500}>
                {appointment.doctorName}
              </Typography>
            </Box>
            <Chip
              label={appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
              sx={{
                bgcolor: `${getStatusColor(appointment.status)}20`,
                color: getStatusColor(appointment.status),
                fontWeight: 600,
              }}
            />
          </Box>

          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
            gap: 1,
            mb: 1
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <MedicalIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 18 }} />
              <Typography variant="body2">{appointment.specialty}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <CalendarIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 18 }} />
              <Typography variant="body2">{formatDate(appointment.date)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <TimeIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 18 }} />
              <Typography variant="body2">{appointment.time} ({appointment.duration})</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              {React.createElement(getTypeIcon(appointment.type), { sx: { mr: 1, color: 'text.secondary', fontSize: 18 } })}
              <Typography variant="body2">{appointment.type}</Typography>
            </Box>
          </Box>

          {appointment.rating && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating value={appointment.rating} readOnly size="small" sx={{ mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                {appointment.rating}.0
              </Typography>
            </Box>
          )}

          {isUpcoming ? (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<EditCalendarIcon />}
                onClick={(e) => {
                  e.stopPropagation();
                  setRescheduleDialog({ open: true, appointment, newDate: '', newTime: '' });
                }}
                fullWidth
              >
                {state.language === 'en' ? 'Reschedule' : 'إعادة جدولة'}
              </Button>
              <Button
                variant="contained"
                size="small"
                startIcon={<CancelIcon />}
                color="error"
                onClick={(e) => {
                  e.stopPropagation();
                  setCancelDialog({ open: true, appointment });
                }}
                fullWidth
              >
                {state.language === 'en' ? 'Cancel' : 'إلغاء'}
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<RefreshIcon />}
                onClick={(e) => {
                  e.stopPropagation();
                  setBookDialogOpen(true);
                }}
                fullWidth
              >
                {state.language === 'en' ? 'Book Again' : 'حجز مرة أخرى'}
              </Button>
              {!appointment.rating && (
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<StarIcon />}
                  onClick={(e) => {
                    e.stopPropagation();
                    setRatingDialog({ open: true, appointment, rating: 5 });
                  }}
                  fullWidth
                >
                  {state.language === 'en' ? 'Rate' : 'تقييم'}
                </Button>
              )}
            </Box>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderDetailTile = (IconComponent: React.ElementType, label: string, value: string) => (
    <Box sx={{ display: 'flex', mb: 2 }}>
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: 2,
          bgcolor: 'primary.main',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mr: 2,
          flexShrink: 0,
        }}
      >
        {React.createElement(IconComponent, { sx: { color: 'white', fontSize: 20 } })}
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {label}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 500, mt: 0.5 }}>
          {value}
        </Typography>
      </Box>
    </Box>
  );

  const renderEmptyState = (icon: React.ElementType, title: string, message: string) => (
    <Box sx={{ textAlign: 'center', py: 8 }}>
      <Box sx={{
        width: 120,
        height: 120,
        bgcolor: 'grey.100',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mx: 'auto',
        mb: 3,
      }}>
        {React.createElement(icon, { sx: { fontSize: 48, color: 'grey.400' } })}
      </Box>
      <Typography variant="h6" sx={{ mb: 2, color: 'text.secondary' }}>
        {title}
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
        {state.language === 'en' ? message : 'البيانات '}
      </Typography>
      <Button variant="contained" onClick={() => setBookDialogOpen(true)}>
        {state.language === 'en' ? 'Book Appointment' : 'حجز موعد'}
      </Button>
    </Box>
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" fontWeight={600}>
            {state.language === 'en' ? 'My Appointments' : 'مواعيدي'}
          </Typography>
          <Box>
            <IconButton onClick={() => setSearchOpen(true)}>
              <SearchIcon />
            </IconButton>
            <IconButton onClick={() => setFilterOpen(true)}>
              <FilterIcon />
            </IconButton>
          </Box>
        </Box>

        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label={state.language === 'en' ? 'Upcoming' : 'قادمة'} />
          <Tab label={state.language === 'en' ? 'Past' : 'سابقة'} />
          <Tab label={state.language === 'en' ? 'Cancelled' : 'ملغاة'} />
        </Tabs>

        {selectedTab === 0 && (
          upcomingAppointments.length > 0 ? (
            upcomingAppointments.map(appointment => renderAppointmentCard(appointment, true))
          ) : (
            renderEmptyState(ScheduleIcon, 'No Upcoming Appointments', 'Book your first appointment')
          )
        )}

        {selectedTab === 1 && (
          pastAppointments.length > 0 ? (
            pastAppointments.map(appointment => renderAppointmentCard(appointment, false))
          ) : (
            renderEmptyState(CheckCircleIcon, 'No Past Appointments', 'Your completed appointments will appear here')
          )
        )}

        {selectedTab === 2 && (
          renderEmptyState(CancelIcon, 'No Cancelled Appointments', 'Cancelled appointments will appear here')
        )}

        {/* Appointment Details Dialog */}
        <Dialog open={detailsDialog.open} onClose={() => setDetailsDialog({ open: false, appointment: null })} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{
              width: 4,
              height: 4,
              bgcolor: 'text.secondary',
              borderRadius: '50%',
              opacity: 0.3,
              mx: 'auto',
            }} />
          </DialogTitle>
          <DialogContent>
            {detailsDialog.appointment && (
              <Box>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                  {state.language === 'en' ? 'Appointment Details' : 'تفاصيل الموعد'}
                </Typography>

                {renderDetailTile(HospitalIcon, state.language === 'en' ? 'Clinic' : 'العيادة', detailsDialog.appointment.clinicName)}
                {renderDetailTile(PersonIcon, state.language === 'en' ? 'Doctor' : 'الطبيب', detailsDialog.appointment.doctorName)}
                {renderDetailTile(MedicalIcon, state.language === 'en' ? 'Specialty' : 'التخصص', detailsDialog.appointment.specialty)}
                {renderDetailTile(CalendarIcon, state.language === 'en' ? 'Date' : 'التاريخ', formatDate(detailsDialog.appointment.date))}
                {renderDetailTile(TimeIcon, state.language === 'en' ? 'Time' : 'الوقت', `${detailsDialog.appointment.time} (${detailsDialog.appointment.duration})`)}
                {renderDetailTile(getTypeIcon(detailsDialog.appointment.type), state.language === 'en' ? 'Type' : 'النوع', detailsDialog.appointment.type)}
                {renderDetailTile(LocationIcon, state.language === 'en' ? 'Address' : 'العنوان', detailsDialog.appointment.address)}
                {renderDetailTile(PhoneIcon, state.language === 'en' ? 'Contact' : 'الاتصال', detailsDialog.appointment.phone)}

                <Divider sx={{ my: 3 }} />

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    onClick={() => setDetailsDialog({ open: false, appointment: null })}
                    fullWidth
                  >
                    {state.language === 'en' ? 'Close' : 'إغلاق'}
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<DirectionsIcon />}
                    onClick={() => {
                      setDetailsDialog({ open: false, appointment: null });
                      setSnackbar({ open: true, message: 'Opening Google Maps...', severity: 'info' });
                    }}
                    fullWidth
                  >
                    {state.language === 'en' ? 'Directions' : 'التوجيهات'}
                  </Button>
                </Box>
              </Box>
            )}
          </DialogContent>
        </Dialog>

        {/* Reschedule Dialog */}
        <Dialog
          open={rescheduleDialog.open}
          onClose={() => setRescheduleDialog({ open: false, appointment: null, newDate: '', newTime: '' })}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {state.language === 'en' ? 'Reschedule Appointment' : 'إعادة جدولة الموعد'}
          </DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ mb: 3 }}>
              {state.language === 'en'
                ? `Would you like to reschedule your appointment with ${rescheduleDialog.appointment?.doctorName}?`
                : `هل تريد إعادة جدولة موعدك مع ${rescheduleDialog.appointment?.doctorName}؟`
              }
            </DialogContentText>

            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              {state.language === 'en' ? 'Current Appointment:' : 'الموعد الحالي:'}
            </Typography>
            <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1, mb: 3 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {rescheduleDialog.appointment?.clinicName}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {rescheduleDialog.appointment ? formatDate(rescheduleDialog.appointment.date) : ''}
              </Typography>
              <Typography variant="body2">
                {rescheduleDialog.appointment?.time} ({rescheduleDialog.appointment?.duration})
              </Typography>
            </Box>

            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              {state.language === 'en' ? 'Choose New Date & Time:' : 'اختر التاريخ والوقت الجديد:'}
            </Typography>

            <TextField
              fullWidth
              type="date"
              label={state.language === 'en' ? 'New Date' : 'التاريخ الجديد'}
              value={rescheduleDialog.newDate}
              onChange={(e) => setRescheduleDialog({ ...rescheduleDialog, newDate: e.target.value })}
              InputLabelProps={{
                shrink: true,
              }}
              sx={{ mb: 2 }}
              inputProps={{
                min: new Date().toISOString().split('T')[0] // Prevent past dates
              }}
            />

            <TextField
              fullWidth
              type="time"
              label={state.language === 'en' ? 'New Time' : 'الوقت الجديد'}
              value={rescheduleDialog.newTime}
              onChange={(e) => setRescheduleDialog({ ...rescheduleDialog, newTime: e.target.value })}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                step: 900 // 15 minute intervals
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setRescheduleDialog({ open: false, appointment: null, newDate: '', newTime: '' })}>
              {state.language === 'en' ? 'Cancel' : 'إلغاء'}
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                if (!rescheduleDialog.newDate || !rescheduleDialog.newTime) {
                  setSnackbar({ open: true, message: 'Please select both date and time', severity: 'warning' });
                  return;
                }

                // Simulate API call to reschedule
                setTimeout(() => {
                  setRescheduleDialog({ open: false, appointment: null, newDate: '', newTime: '' });
                  setSnackbar({
                    open: true,
                    message: `Appointment rescheduled to ${rescheduleDialog.newDate} at ${rescheduleDialog.newTime}`,
                    severity: 'success'
                  });
                }, 1500);
              }}
              disabled={!rescheduleDialog.newDate || !rescheduleDialog.newTime}
            >
              {state.language === 'en' ? 'Reschedule' : 'إعادة جدولة'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Cancel Dialog */}
        <Dialog open={cancelDialog.open} onClose={() => setCancelDialog({ open: false, appointment: null })}>
          <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
            <WarningIcon sx={{ mr: 1, color: 'warning.main' }} />
            {state.language === 'en' ? 'Cancel Appointment' : 'إلغاء الموعد'}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {state.language === 'en'
                ? 'Are you sure you want to cancel this appointment? This action cannot be undone.'
                : 'هل أنت متأكد من رغبتك في إلغاء هذا الموعد؟ لا يمكن التراجع عن هذا الإجراء.'
              }
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCancelDialog({ open: false, appointment: null })}>
              {state.language === 'en' ? 'Keep Appointment' : 'الاحتفاظ بالموعد'}
            </Button>
            <Button variant="contained" color="error" onClick={() => {
              setCancelDialog({ open: false, appointment: null });
              setSnackbar({ open: true, message: 'Appointment cancelled successfully', severity: 'success' });
            }}>
              {state.language === 'en' ? 'Cancel Appointment' : 'إلغاء الموعد'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Rating Dialog */}
        <Dialog open={ratingDialog.open} onClose={() => setRatingDialog({ open: false, appointment: null, rating: 5 })}>
          <DialogTitle>
            {state.language === 'en' ? 'Rate Your Experience' : 'تقييم تجربتك'}
          </DialogTitle>
          <DialogContent>
            <Typography sx={{ mb: 2 }}>
              {state.language === 'en'
                ? `How was your appointment with ${ratingDialog.appointment?.doctorName}?`
                : 'كيف كان موعدك؟'
              }
            </Typography>
            <Rating
              value={ratingDialog.rating}
              onChange={(_, newValue) => setRatingDialog({ ...ratingDialog, rating: newValue || 5 })}
              size="large"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setRatingDialog({ open: false, appointment: null, rating: 5 })}>
              {state.language === 'en' ? 'Skip' : 'تخطي'}
            </Button>
            <Button variant="contained" onClick={() => {
              setRatingDialog({ open: false, appointment: null, rating: 5 });
              setSnackbar({ open: true, message: 'Thank you for your feedback!', severity: 'success' });
            }}>
              {state.language === 'en' ? 'Submit Rating' : 'إرسال التقييم'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Book Appointment Dialog */}
        <Dialog open={bookDialogOpen} onClose={() => setBookDialogOpen(false)}>
          <DialogTitle>
            {state.language === 'en' ? 'Book New Appointment' : 'حجز موعد جديد'}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {state.language === 'en'
                ? 'This will navigate to the Find Care screen where you can search and book appointments with healthcare providers.'
                : 'سيتم التنقل إلى شاشة البحث عن الرعاية حيث يمكنك البحث وحجز المواعيد.'
              }
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setBookDialogOpen(false)}>
              {state.language === 'en' ? 'Cancel' : 'إلغاء'}
            </Button>
            <Button variant="contained" onClick={() => {
              setBookDialogOpen(false);
              setSnackbar({ open: true, message: 'Opening Find Care...', severity: 'info' });
            }}>
              {state.language === 'en' ? 'Continue' : 'متابعة'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Search Dialog */}
        <Dialog open={searchOpen} onClose={() => setSearchOpen(false)}>
          <DialogTitle>
            {state.language === 'en' ? 'Search Appointments' : 'البحث في المواعيد'}
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              fullWidth
              label={state.language === 'en' ? 'Search' : 'بحث'}
              placeholder={state.language === 'en' ? 'Search by doctor, clinic, or specialty' : 'البحث حسب الطبيب أو العيادة أو التخصص'}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSearchOpen(false)}>
              {state.language === 'en' ? 'Cancel' : 'إلغاء'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Filter Dialog */}
        <Dialog open={filterOpen} onClose={() => setFilterOpen(false)}>
          <DialogTitle>
            {state.language === 'en' ? 'Filter Appointments' : 'تصفية المواعيد'}
          </DialogTitle>
          <DialogContent sx={{ minWidth: 300 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <label style={{ display: 'flex', alignItems: 'center' }}>
                <input type="checkbox" checked={filterOptions.inPersonOnly} onChange={(e) => setFilterOptions({ ...filterOptions, inPersonOnly: e.target.checked })} />
                {state.language === 'en' ? ' In-Person Only' : ' الحضور الشخصي فقط'}
              </label>
              <label style={{ display: 'flex', alignItems: 'center' }}>
                <input type="checkbox" checked={filterOptions.teleconsultOnly} onChange={(e) => setFilterOptions({ ...filterOptions, teleconsultOnly: e.target.checked })} />
                {state.language === 'en' ? ' Teleconsult Only' : ' الاستشارة عن بعد فقط'}
              </label>
              <label style={{ display: 'flex', alignItems: 'center' }}>
                <input type="checkbox" checked={filterOptions.thisWeek} onChange={(e) => setFilterOptions({ ...filterOptions, thisWeek: e.target.checked })} />
                {state.language === 'en' ? ' This Week' : ' هذا الأسبوع'}
              </label>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setFilterOpen(false)}>
              {state.language === 'en' ? 'Reset' : 'إعادة تعيين'}
            </Button>
            <Button variant="contained" onClick={() => {
              setFilterOpen(false);
              setSnackbar({ open: true, message: 'Filters applied', severity: 'info' });
            }}>
              {state.language === 'en' ? 'Apply' : 'تطبيق'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Book Appointment FAB */}
        <Fab
          color="primary"
          aria-label={state.language === 'en' ? 'Book Appointment' : 'حجز موعد'}
          onClick={() => setBookDialogOpen(true)}
          sx={{
            position: 'fixed',
            bottom: { xs: 100, sm: 24 },
            right: 24,
            zIndex: 1000,
          }}
        >
          <AddIcon />
        </Fab>

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

export default CarePage;

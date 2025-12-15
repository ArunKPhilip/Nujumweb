import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Chip,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  TextField,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Fab,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  MyLocation as LocationIcon,
  Phone as PhoneIcon,
  DirectionsCar as CarIcon,
  LocalHospital as HospitalIcon,
  Support as SupportIcon,
  AccessTime as TimeIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

// Mock service request data
const mockServiceRequests = [
  {
    id: '1',
    type: 'airport_assistance',
    title: 'Airport Wheelchair Assistance',
    description: 'Need wheelchair assistance for departure flight EK456 from Dubai International Airport.',
    urgency: 'high',
    status: 'completed',
    location: 'Dubai International Airport',
    preferredTime: '2025-12-20T10:30:00Z',
    createdAt: '2025-12-18T08:30:00Z',
    assignedTo: 'Ahmed Hassan',
    contactNumber: '+971 50 123 4567',
  },
  {
    id: '2',
    type: 'transportation',
    title: 'Accessible Taxi Required',
    description: 'Need accessible taxi from Dubai Mall to Jumeirah Beach Hotel.',
    urgency: 'medium',
    status: 'assigned',
    location: 'Dubai Mall to Jumeirah Beach Hotel',
    preferredTime: '2025-12-19T14:00:00Z',
    createdAt: '2025-12-19T09:15:00Z',
    assignedTo: 'Mohammed Al Khalifa',
    contactNumber: '+971 50 234 5678',
  },
  {
    id: '3',
    type: 'medical_assistance',
    title: 'Medical Equipment Transport',
    description: 'Request assistance to transport medical equipment to healthcare center.',
    urgency: 'high',
    status: 'pending',
    location: 'Al Barsha, Dubai',
    preferredTime: '2025-12-20T16:00:00Z',
    createdAt: '2025-12-19T14:20:00Z',
    assignedTo: null,
    contactNumber: '+971 50 345 6789',
  },
];

const serviceTypes = [
  {
    id: 'airport_assistance',
    title: 'Airport Assistance',
    icon: <LocationIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
    description: 'Wheelchair assistance and airport navigation support',
    examples: ['Terminal navigation', 'Check-in assistance', 'Boarding support'],
  },
  {
    id: 'mobility_support',
    title: 'Mobility Support',
    icon: <SupportIcon sx={{ fontSize: 48, color: 'secondary.main' }} />,
    description: 'Personal mobility assistance and daily living support',
    examples: ['Home assistance', 'Shopping support', 'Appointment escort'],
  },
  {
    id: 'transportation',
    title: 'Transportation',
    icon: <CarIcon sx={{ fontSize: 48, color: 'info.main' }} />,
    description: 'Accessible transportation and vehicle assistance',
    examples: ['Accessible taxis', 'Medical transport', 'Inter-city travel'],
  },
  {
    id: 'medical_assistance',
    title: 'Medical Assistance',
    icon: <HospitalIcon sx={{ fontSize: 48, color: 'success.main' }} />,
    description: 'Medical equipment handling and healthcare support',
    examples: ['Equipment transport', 'Home nursing', 'Therapy support'],
  },
  {
    id: 'general_support',
    title: 'General Support',
    icon: <PhoneIcon sx={{ fontSize: 48, color: 'warning.main' }} />,
    description: 'General assistance and support services',
    examples: ['Consultation calls', 'Information support', 'Complaint assistance'],
  },
];

const urgencyLevels = [
  { value: 'low', label: 'Low (Within 72 hours)', color: 'success' },
  { value: 'medium', label: 'Medium (Within 24 hours)', color: 'warning' },
  { value: 'high', label: 'High (Within 6 hours)', color: 'error' },
  { value: 'emergency', label: 'Emergency (Immediate)', color: 'error' },
];

const ServiceRequestPage: React.FC = () => {
  const { state } = useAuth();
  const [selectedTab, setSelectedTab] = useState(0);
  const [createRequestOpen, setCreateRequestOpen] = useState(false);
  const [viewRequestOpen, setViewRequestOpen] = useState(false);
  const [selectedServiceType, setSelectedServiceType] = useState<any>(null);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({ open: false, message: '', severity: 'success' });

  const [serviceRequests, setServiceRequests] = useState(mockServiceRequests);

  const [requestForm, setRequestForm] = useState({
    type: '',
    title: '',
    description: '',
    urgency: 'medium',
    location: '',
    preferredTime: '',
    contactNumber: '',
    emergencyContact: '',
    specialInstructions: '',
  });

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleCreateRequest = (serviceType: any) => {
    setSelectedServiceType(serviceType);
    setRequestForm({
      ...requestForm,
      type: serviceType.id,
      title: serviceType.title,
    });
    setCreateRequestOpen(true);
  };

  const handleSubmitRequest = () => {
    // Create new service request
    const newRequest = {
      id: Date.now().toString(),
      type: requestForm.type,
      title: requestForm.title,
      description: requestForm.description,
      urgency: requestForm.urgency,
      status: 'pending',
      location: requestForm.location,
      preferredTime: requestForm.preferredTime,
      createdAt: new Date().toISOString(),
      assignedTo: null,
      contactNumber: requestForm.contactNumber,
    };

    // Add to service requests
    setServiceRequests(prev => [newRequest, ...prev]);

    // Reset form
    setRequestForm({
      type: '',
      title: '',
      description: '',
      urgency: 'medium',
      location: '',
      preferredTime: '',
      contactNumber: '',
      emergencyContact: '',
      specialInstructions: '',
    });

    setCreateRequestOpen(false);
    setSelectedServiceType(null);
    setSnackbar({
      open: true,
      message: state.language === 'en' ? 'Service request submitted successfully!' : 'تم تقديم طلب الخدمة بنجاح!',
      severity: 'success'
    });
  };

  const handleViewRequest = (request: any) => {
    setSelectedRequest(request);
    setViewRequestOpen(true);
  };

  const handleCancelRequest = (requestId: string) => {
    // Update request status to cancelled
    setServiceRequests(prev => prev.map(req =>
      req.id === requestId ? { ...req, status: 'cancelled' } : req
    ));

    setSnackbar({
      open: true,
      message: state.language === 'en' ? 'Service request cancelled successfully!' : 'تم إلغاء طلب الخدمة بنجاح!',
      severity: 'info'
    });
    setViewRequestOpen(false);
  };

  const handleSnackBarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'assigned': return 'primary';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircleIcon color="success" />;
      case 'assigned': return <ScheduleIcon color="primary" />;
      case 'pending': return <TimeIcon color="warning" />;
      case 'cancelled': return <CancelIcon color="error" />;
      default: return <TimeIcon />;
    }
  };

  const formatTime = (dateTime: string) => {
    try {
      const date = new Date(dateTime);
      return date.toLocaleString();
    } catch (e) {
      return dateTime;
    }
  };

  const filteredRequests = serviceRequests.filter(request => {
    if (selectedTab === 0) return true; // All
    if (selectedTab === 1) return request.status === 'pending' || request.status === 'assigned' || (request.status !== 'cancelled' && request.status !== 'completed');
    if (selectedTab === 2) return request.status === 'completed' || request.status === 'cancelled';
    return false;
  });

  const renderServiceTypeCard = (serviceType: any) => (
    <Card
      key={serviceType.id}
      sx={{
        cursor: 'pointer',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
      onClick={() => handleCreateRequest(serviceType)}
    >
      <CardContent sx={{ p: 4, textAlign: 'center' }}>
        {serviceType.icon}
        <Typography variant="h6" fontWeight={700} sx={{ mt: 2, mb: 1 }}>
          {serviceType.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {serviceType.description}
        </Typography>
        <Box sx={{ mb: 2 }}>
          {serviceType.examples.slice(0, 2).map((example: string, index: number) => (
            <Chip
              key={index}
              label={example}
              size="small"
              variant="outlined"
              sx={{ mr: 0.5, mb: 0.5 }}
            />
          ))}
        </Box>
        <Button variant="contained" fullWidth>
          {state.language === 'en' ? 'Request Service' : 'طلب خدمة'}
        </Button>
      </CardContent>
    </Card>
  );

  const renderRequestCard = (request: any) => (
    <Card
      key={request.id}
      sx={{
        mb: 2,
        cursor: 'pointer',
        transition: 'transform 0.3s ease',
        '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 },
      }}
      onClick={() => handleViewRequest(request)}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight={700}>
              {request.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {request.type.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
            <Chip
              icon={getStatusIcon(request.status)}
              label={request.status.charAt(0).toUpperCase() + request.status.slice(1)}
              color={getStatusColor(request.status) as any}
              variant="filled"
              size="small"
            />
            <Chip
              label={`${request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1)} Priority`}
              color={urgencyLevels.find(l => l.value === request.urgency)?.color as any}
              size="small"
            />
          </Box>
        </Box>

        <Typography variant="body2" sx={{ mb: 2 }}>
          {request.description}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="caption" color="text.secondary">
              {state.language === 'en' ? 'Requested:' : 'مطلوب:'} {formatTime(request.createdAt)}
            </Typography>
            {request.assignedTo && (
              <Typography variant="caption" color="primary">
                {state.language === 'en' ? 'Assigned to:' : 'مخصص ل:'} {request.assignedTo}
              </Typography>
            )}
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="caption" color="text.secondary">
              {state.language === 'en' ? 'Location:' : 'الموقع:'}
            </Typography>
            <Typography variant="body2" color="primary" fontWeight={600}>
              {request.location}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1" fontWeight={600}>
            {state.language === 'en' ? 'Service Requests' : 'طلبات الخدمة'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {state.language === 'en'
              ? 'Request assistance and support services tailored for persons with disabilities'
              : 'اطلب المساعدة وخدمات الدعم المصممة خصيصاً للأشخاص ذوي الإعاقة'
            }
          </Typography>
        </Box>

        {/* Tabs */}
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label={state.language === 'en' ? 'Request Services' : 'طلب خدمات'} />
          <Tab label={state.language === 'en' ? 'Active Requests' : 'الطلبات النشطة'} />
          <Tab label={state.language === 'en' ? 'Completed' : 'المكتملة'} />
        </Tabs>

        {/* Content */}
        {selectedTab === 0 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {state.language === 'en' ? 'Choose a Service Type' : 'اختر نوع الخدمة'}
            </Typography>
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
              gap: 2,
            }}>
              {serviceTypes.map(renderServiceTypeCard)}
            </Box>
          </Box>
        )}

        {(selectedTab === 1 || selectedTab === 2) && (
          <Box>
            {filteredRequests.length > 0 ? (
              filteredRequests.map(renderRequestCard)
            ) : (
              <Card sx={{ textAlign: 'center', py: 8 }}>
                <CardContent>
                  <SupportIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    {selectedTab === 1
                      ? (state.language === 'en' ? 'No active requests' : 'لا توجد طلبات نشطة')
                      : (state.language === 'en' ? 'No completed requests' : 'لا توجد طلبات مكتملة')
                    }
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {state.language === 'en'
                      ? 'Your service requests will appear here'
                      : 'ستظهر طلبات خدمك هنا'
                    }
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Box>
        )}

        {/* Create Request Dialog */}
        <Dialog open={createRequestOpen} onClose={() => setCreateRequestOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            {state.language === 'en' ? 'Request Service' : 'طلب خدمة'}
          </DialogTitle>
          <DialogContent>
            {selectedServiceType && (
              <Box sx={{ pt: 2 }}>
                <Card sx={{ mb: 2, backgroundColor: 'primary.light', color: 'primary.contrastText' }}>
                  <CardContent sx={{ p: 2 }}>
                    {selectedServiceType.icon}
                    <Typography variant="h6" sx={{ mt: 1 }}>
                      {selectedServiceType.title}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      {selectedServiceType.description}
                    </Typography>
                  </CardContent>
                </Card>

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>
                    {state.language === 'en' ? 'Urgency Level' : 'مستوى الإلحاح'}
                  </InputLabel>
                  <Select
                    value={requestForm.urgency}
                    onChange={(e) => setRequestForm({ ...requestForm, urgency: e.target.value })}
                    label={state.language === 'en' ? 'Urgency Level' : 'مستوى الإلحاح'}
                  >
                    {urgencyLevels.map(level => (
                      <MenuItem key={level.value} value={level.value}>
                        {level.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  label={state.language === 'en' ? 'Service Title' : 'عنوان الخدمة'}
                  value={requestForm.title}
                  onChange={(e) => setRequestForm({ ...requestForm, title: e.target.value })}
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label={state.language === 'en' ? 'Description' : 'الوصف'}
                  multiline
                  rows={3}
                  value={requestForm.description}
                  onChange={(e) => setRequestForm({ ...requestForm, description: e.target.value })}
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label={state.language === 'en' ? 'Location' : 'الموقع'}
                  value={requestForm.location}
                  onChange={(e) => setRequestForm({ ...requestForm, location: e.target.value })}
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label={state.language === 'en' ? 'Preferred Time' : 'الوقت المفضل'}
                  type="datetime-local"
                  value={requestForm.preferredTime}
                  onChange={(e) => setRequestForm({ ...requestForm, preferredTime: e.target.value })}
                  sx={{ mb: 2 }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />

                <TextField
                  fullWidth
                  label={state.language === 'en' ? 'Contact Number' : 'رقم الاتصال'}
                  value={requestForm.contactNumber}
                  onChange={(e) => setRequestForm({ ...requestForm, contactNumber: e.target.value })}
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label={state.language === 'en' ? 'Emergency Contact' : 'الاتصال الطارئ'}
                  value={requestForm.emergencyContact}
                  onChange={(e) => setRequestForm({ ...requestForm, emergencyContact: e.target.value })}
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label={state.language === 'en' ? 'Special Instructions' : 'تعليمات خاصة'}
                  multiline
                  rows={2}
                  value={requestForm.specialInstructions}
                  onChange={(e) => setRequestForm({ ...requestForm, specialInstructions: e.target.value })}
                  sx={{ mb: 2 }}
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCreateRequestOpen(false)}>
              {state.language === 'en' ? 'Cancel' : 'إلغاء'}
            </Button>
            <Button variant="contained" onClick={handleSubmitRequest}>
              {state.language === 'en' ? 'Submit Request' : 'إرسال الطلب'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* View Request Dialog */}
        <Dialog open={viewRequestOpen} onClose={() => setViewRequestOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            {state.language === 'en' ? 'Service Request Details' : 'تفاصيل طلب الخدمة'}
          </DialogTitle>
          <DialogContent>
            {selectedRequest && (
              <Box>
                <Card sx={{ mb: 2 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                      {selectedRequest.title}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <Chip
                        icon={getStatusIcon(selectedRequest.status)}
                        label={selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                        color={getStatusColor(selectedRequest.status) as any}
                        variant="filled"
                      />
                      <Chip
                        label={`${selectedRequest.urgency.charAt(0).toUpperCase() + selectedRequest.urgency.slice(1)} Priority`}
                        color={urgencyLevels.find(l => l.value === selectedRequest.urgency)?.color as any}
                      />
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {selectedRequest.type.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                    </Typography>

                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {selectedRequest.description}
                    </Typography>

                    <Typography variant="subtitle2" color="text.secondary">
                      {state.language === 'en' ? 'Location:' : 'الموقع:'} {selectedRequest.location}
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                      {state.language === 'en' ? 'Preferred Time:' : 'الوقت المفضل:'} {formatTime(selectedRequest.preferredTime)}
                    </Typography>

                    {selectedRequest.assignedTo && (
                      <Typography variant="subtitle2" color="primary">
                        {state.language === 'en' ? 'Assigned to:' : 'مخصص ل:'} {selectedRequest.assignedTo}
                      </Typography>
                    )}

                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                      {state.language === 'en' ? 'Requested on:' : 'مطلوب في:'} {formatTime(selectedRequest.createdAt)}
                    </Typography>
                  </CardContent>
                </Card>

                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  {state.language === 'en' ? 'Contact Information' : 'معلومات الاتصال'}
                </Typography>
                <TextField
                  fullWidth
                  label={state.language === 'en' ? 'Contact Number' : 'رقم الاتصال'}
                  value={selectedRequest.contactNumber}
                  InputProps={{ readOnly: true }}
                  sx={{ mb: 2 }}
                />

                {selectedRequest.status !== 'cancelled' && (
                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <Button
                      variant="outlined"
                      onClick={() => handleCancelRequest(selectedRequest.id)}
                      color="error"
                      fullWidth
                    >
                      {state.language === 'en' ? 'Cancel Request' : 'إلغاء الطلب'}
                    </Button>
                  </Box>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewRequestOpen(false)}>
              {state.language === 'en' ? 'Close' : 'إغلاق'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Floating Action Button */}
        <Fab
          color="primary"
          aria-label={state.language === 'en' ? 'Request Service' : 'طلب خدمة'}
          onClick={() => setCreateRequestOpen(true)}
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

export default ServiceRequestPage;

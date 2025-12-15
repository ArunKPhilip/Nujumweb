import React, { useState } from 'react';
import {
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Alert,
  Box,
} from '@mui/material';
import {
  Warning as WarningIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Message as MessageIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  isPrimary: boolean;
}

export const SOSButton: React.FC = () => {
  const { state } = useAuth();
  const [openDialog, setOpenDialog] = useState(false);
  const [sendingAlert, setSendingAlert] = useState(false);
  const [alertSent, setAlertSent] = useState(false);

  // Mock emergency contacts - would normally come from user profile
  const emergencyContacts: EmergencyContact[] = [
    { id: '1', name: 'Emergency Services', phone: '911', relationship: 'Emergency', isPrimary: true },
    { id: '2', name: 'John Smith', phone: '+1234567890', relationship: 'Family', isPrimary: false },
    { id: '3', name: 'Jane Doe', phone: '+1234567891', relationship: 'Friend', isPrimary: false },
  ];

  const handleSOSClick = () => {
    setOpenDialog(true);
  };

  const handleConfirmEmergency = async () => {
    setSendingAlert(true);

    try {
      // Simulate sending emergency alert
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Here you would normally:
      // 1. Get user's current location
      // 2. Send SMS/emails to emergency contacts
      // 3. Call emergency services automatically
      // 4. Log the emergency in the system

      console.log('Emergency alert triggered for user:', state.user?.id);

      setAlertSent(true);
    } catch (error) {
      console.error('Failed to send emergency alert:', error);
    }

    setSendingAlert(false);
    setOpenDialog(false);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleAlertClose = () => {
    setAlertSent(false);
  };

  const getAlertMessage = () => ({
    en: {
      title: 'Emergency Alert',
      message: 'Stay calm. Emergency services have been notified.',
      description: 'Location shared: Help is on the way.',
    },
    ar: {
      title: 'تنبيه طوارئ',
      message: 'ابق هادئاً. تم إبلاغ خدمات الطوارئ.',
      description: 'تم مشاركة الموقع: المساعدة في الطريق.',
    }
  }[state.language || 'en']);

  const dialogContent = () => ({
    en: {
      title: 'EMERGENCY ALERT',
      warning: 'This will send an immediate alert to emergency services and your emergency contacts.',
      message: 'Emergency message will include your current location.',
      confirm: 'Send Emergency Alert',
      cancel: 'Cancel',
    },
    ar: {
      title: 'تنبيه طوارئ',
      warning: 'سيرسل هذا تنبيهاً فورياً إلى خدمات الطوارئ وجهات الاتصال الطارئة.',
      message: 'سيشمل الرسالة الطارئة موقعك الحالي.',
      confirm: 'إرسال تنبيه طوارئ',
      cancel: 'إلغاء',
    }
  }[state.language || 'en']);

  const content = dialogContent();

  return (
    <>
      {/* SOS Floating Button */}
      <Fab
        color="error"
        aria-label={state.language === 'en' ? 'SOS Emergency Alert' : 'تنبيه طوارئ SOS'}
        onClick={handleSOSClick}
        sx={{
          position: 'fixed',
          bottom: { xs: 100, sm: 24 }, // Leave room for bottom navigation on mobile
          right: 24,
          zIndex: 1200,
          width: { xs: 64, sm: 56 },
          height: { xs: 64, sm: 56 },
          fontSize: '1.5rem',
          fontWeight: 'bold',
          boxShadow: '0 4px 12px rgba(211, 47, 47, 0.3)',
          '&:hover': {
            boxShadow: '0 6px 16px rgba(211, 47, 47, 0.4)',
            transform: 'scale(1.05)',
          },
          '&:active': {
            transform: 'scale(0.95)',
          },
        }}
      >
        SOS
      </Fab>

      {/* Emergency Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="emergency-dialog-title"
        aria-describedby="emergency-dialog-description"
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            minHeight: 400,
          }
        }}
      >
        <DialogTitle
          id="emergency-dialog-title"
          sx={{
            bgcolor: 'error.main',
            color: 'white',
            textAlign: 'center',
            py: 3,
          }}
        >
          <WarningIcon sx={{ fontSize: 48, mb: 1 }} />
          <Typography variant="h5" component="div" fontWeight="bold">
            {content.title}
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          {/* Warning Message */}
          <Box sx={{ mb: 3 }}>
            <Typography
              id="emergency-dialog-description"
              variant="body1"
              sx={{
                mb: 2,
                fontSize: '1.1rem',
                textAlign: 'center',
                color: 'error.main',
                fontWeight: 500,
              }}
            >
              {content.warning}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                textAlign: 'center',
                color: 'text.secondary',
                mb: 3,
              }}
            >
              {content.message}
            </Typography>
          </Box>

          {/* Emergency Contacts List */}
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            {state.language === 'en' ? 'Emergency Contacts:' : 'جهات الاتصال الطارئة:'}
          </Typography>
          <List sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
            {emergencyContacts.map((contact) => (
              <ListItem key={contact.id} sx={{ py: 1 }}>
                <ListItemIcon>
                  {contact.isPrimary ? (
                    <PhoneIcon color="error" />
                  ) : (
                    <MessageIcon color="primary" />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={`${contact.name} (${contact.relationship})`}
                  secondary={contact.phone}
                  primaryTypographyProps={{ fontWeight: contact.isPrimary ? 600 : 400 }}
                />
              </ListItem>
            ))}
          </List>

          {/* Additional Info */}
          <Box sx={{
            mt: 3,
            p: 2,
            bgcolor: 'warning.light',
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
          }}>
            <LocationIcon sx={{ mr: 1, color: 'warning.dark' }} />
            <Typography variant="body2" color="warning.dark">
              {state.language === 'en'
                ? 'Your current location will be shared automatically.'
                : 'سيتم مشاركة موقعك الحالي تلقائياً.'
              }
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={handleCloseDialog}
            disabled={sendingAlert}
            variant="outlined"
            fullWidth
            size="large"
          >
            {content.cancel}
          </Button>
          <Button
            onClick={handleConfirmEmergency}
            disabled={sendingAlert}
            variant="contained"
            color="error"
            fullWidth
            size="large"
            sx={{
              ml: 2,
              fontWeight: 'bold',
              fontSize: '1rem',
            }}
          >
            {sendingAlert ? (
              state.language === 'en' ? 'Sending...' : 'جارٍ الإرسال...'
            ) : (
              content.confirm
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Alert */}
      <Snackbar
        open={alertSent}
        autoHideDuration={6000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleAlertClose}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
          icon={<WarningIcon fontSize="inherit" />}
        >
          {getAlertMessage().message}
        </Alert>
      </Snackbar>
    </>
  );
};

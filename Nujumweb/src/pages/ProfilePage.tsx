import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  TextField,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Fab,
  Snackbar,
  Alert,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Security as SecurityIcon,
  PrivacyTip as PrivacyIcon,
  Palette as PaletteIcon,
  Language as LanguageIcon,
  Notifications as NotificationsIcon,
  CloudDownload as CloudDownloadIcon,
  Delete as DeleteIcon,
  Logout as LogoutIcon,
  QrCode as QrCodeIcon,
  Share as ShareIcon,
  MedicalInformation as MedicalInfoIcon,
  Help as HelpIcon,
  Favorite as FavoriteIcon,
  CalendarMonth as CalendarIcon,
  CheckCircle as CheckCircleIcon,
  Phone as PhoneIcon,
  LocationOn as LocationOnIcon,
  Bloodtype as BloodtypeIcon,
  Android as BiometricIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { User } from '../types';

const ProfilePage: React.FC = () => {
  const { state, logout, setThemeMode } = useAuth();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [medicalIdOpen, setMedicalIdOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [deleteAccountDialog, setDeleteAccountDialog] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({ open: false, message: '', severity: 'success' });

  const [editData, setEditData] = useState({
    fullName: '',
    bio: '',
    phone: '',
    bloodGroup: '',
  });

  // Settings state
  const [settings, setSettings] = useState({
    notificationsEnabled: true,
    emailNotifications: true,
    smsNotifications: false,
    locationServices: true,
    biometricLogin: false,
    darkMode: state.themeMode === 'dark',
    autoBackup: true,
    offlineMode: false,
    selectedLanguage: 'English',
  });

  const languages = ['English', 'Arabic', 'French', 'Spanish', 'Urdu', 'Hindi'];

  useEffect(() => {
    if (state.user) {
      setEditData({
        fullName: state.user.fullName,
        bio: state.user.bio || '',
        phone: state.user.phone,
        bloodGroup: state.user.bloodGroup || '',
      });
    }
  }, [state.user]);

  const handleSaveProfile = () => {
    // In a real app, this would update the backend
    console.log('Saving profile:', editData);
    setEditProfileOpen(false);
    setSnackbar({ open: true, message: 'Profile updated successfully!', severity: 'success' });
  };

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));

    // Handle theme mode change
    if (key === 'darkMode') {
      setThemeMode(value ? 'dark' : 'light');
      setSnackbar({
        open: true,
        message: value ? 'Dark mode enabled!' : 'Light mode enabled!',
        severity: 'success'
      });
    }

    // In a real app, other settings would also save to backend
    console.log(`Setting ${key} changed to:`, value);
  };

  const handleShareProfile = () => {
    const shareText = `Check out my NUJJUM profile: ${state.user?.fullName} - Healthcare accessibility platform`;
    if (navigator.share) {
      navigator.share({ text: shareText });
    } else {
      navigator.clipboard.writeText(shareText);
      setSnackbar({ open: true, message: 'Profile link copied to clipboard!', severity: 'success' });
    }
  };

  const handleLogout = () => {
    logout();
    setSnackbar({ open: true, message: 'Logged out successfully', severity: 'success' });
  };

  const handleSnackBarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const userName = state.user?.username || 'user';

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 3 }}>
        {/* Header with Avatar */}
        <Card
          sx={{
            mb: 3,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Avatar
                src={state.user?.profilePicture}
                sx={{
                  width: 120,
                  height: 120,
                  mx: 'auto',
                  mb: 3,
                  border: '4px solid rgba(255, 255, 255, 0.3)',
                  fontSize: '3rem'
                }}
              >
                {state.user?.fullName.charAt(0)}
              </Avatar>

              <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
                {state.user?.fullName}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  @{userName}
                </Typography>
                <Chip
                  label={state.language === 'en' ? 'Premium Member' : 'عضو مميز'}
                  sx={{
                    ml: 2,
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    borderRadius: 1,
                  }}
                  size="small"
                />
              </Box>

              <Typography variant="body2" sx={{ opacity: 0.8, mb: 2 }}>
                {state.language === 'en' ? 'Member since' : 'عضو منذ' } {new Date(state.user?.createdAt || '').toLocaleDateString()}
              </Typography>

              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                <IconButton
                  onClick={() => setQrDialogOpen(true)}
                  sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)' }}
                >
                  <QrCodeIcon sx={{ color: 'white' }} />
                </IconButton>
                <IconButton
                  onClick={handleShareProfile}
                  sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)' }}
                >
                  <ShareIcon sx={{ color: 'white' }} />
                </IconButton>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Statistics Cards */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            {state.language === 'en' ? 'Statistics' : 'الإحصائيات'}
          </Typography>
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 2,
          }}>
            <Card sx={{ textAlign: 'center', py: 2 }}>
              <CardContent>
                <CalendarIcon sx={{ fontSize: 32, color: 'primary.main', mb: 1 }} />
                <Typography variant="h5" fontWeight={700}>
                  12
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {state.language === 'en' ? 'Appointments' : 'المواعيد'}
                </Typography>
              </CardContent>
            </Card>
            <Card sx={{ textAlign: 'center', py: 2 }}>
              <CardContent>
                <CheckCircleIcon sx={{ fontSize: 32, color: 'success.main', mb: 1 }} />
                <Typography variant="h5" fontWeight={700}>
                  10
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {state.language === 'en' ? 'Completed' : 'مكتمل'}
                </Typography>
              </CardContent>
            </Card>
            <Card sx={{ textAlign: 'center', py: 2 }}>
              <CardContent>
                <FavoriteIcon sx={{ fontSize: 32, color: 'error.main', mb: 1 }} />
                <Typography variant="h5" fontWeight={700}>
                  8
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {state.language === 'en' ? 'Saved Doctors' : 'الأطباء المحفوظون'}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* About Section */}
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <MedicalInfoIcon sx={{ mr: 2, color: 'primary.main' }} />
              <Typography variant="h6" fontWeight={600}>
                {state.language === 'en' ? 'About' : 'حول'}
              </Typography>
            </Box>

            {state.user?.bio && (
              <Typography variant="body1" sx={{ mb: 2 }}>
                {state.user.bio}
              </Typography>
            )}

            <Box sx={{ display: 'grid', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PhoneIcon sx={{ mr: 2, color: 'text.secondary', fontSize: 20 }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {state.language === 'en' ? 'Phone' : 'الهاتف'}
                  </Typography>
                  <Typography variant="body1">
                    {state.user?.phone || (state.language === 'en' ? 'Not set' : 'غير محدد')}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationOnIcon sx={{ mr: 2, color: 'text.secondary', fontSize: 20 }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {state.language === 'en' ? 'Location' : 'الموقع'}
                  </Typography>
                  <Typography variant="body1">
                    {state.user?.countryOfResidence || (state.language === 'en' ? 'Not set' : 'غير محدد')}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <BloodtypeIcon sx={{ mr: 2, color: 'text.secondary', fontSize: 20 }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {state.language === 'en' ? 'Blood Group' : 'فصيلة الدم'}
                  </Typography>
                  <Typography variant="body1">
                    {state.user?.bloodGroup || (state.language === 'en' ? 'Not set' : 'غير محدد')}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
              {state.language === 'en' ? 'Quick Actions' : 'الإجراءات السريعة'}
            </Typography>
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 2,
            }}>
              <Card
                sx={{
                  cursor: 'pointer',
                  '&:hover': { boxShadow: 2 },
                  height: 100,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                }}
                onClick={() => setMedicalIdOpen(true)}
              >
                <CardContent sx={{ p: 2 }}>
                  <MedicalInfoIcon sx={{ fontSize: 32, color: 'primary.main', mb: 1 }} />
                  <Typography variant="body2" fontWeight={500}>
                    {state.language === 'en' ? 'Medical ID' : 'الهوية الطبية'}
                  </Typography>
                </CardContent>
              </Card>
              <Card
                sx={{
                  cursor: 'pointer',
                  '&:hover': { boxShadow: 2 },
                  height: 100,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                }}
                onClick={handleShareProfile}
              >
                <CardContent sx={{ p: 2 }}>
                  <ShareIcon sx={{ fontSize: 32, color: 'primary.main', mb: 1 }} />
                  <Typography variant="body2" fontWeight={500}>
                    {state.language === 'en' ? 'Share Profile' : 'مشاركة الملف'}
                  </Typography>
                </CardContent>
              </Card>
              <Card
                sx={{
                  cursor: 'pointer',
                  '&:hover': { boxShadow: 2 },
                  height: 100,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                }}
                onClick={() => setSettingsOpen(true)}
              >
                <CardContent sx={{ p: 2 }}>
                  <HelpIcon sx={{ fontSize: 32, color: 'primary.main', mb: 1 }} />
                  <Typography variant="body2" fontWeight={500}>
                    {state.language === 'en' ? 'Help & Support' : 'المساعدة والدعم'}
                  </Typography>
                </CardContent>
              </Card>
              <Card
                sx={{
                  cursor: 'pointer',
                  '&:hover': { boxShadow: 2 },
                  height: 100,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                }}
                onClick={() => setEditProfileOpen(true)}
              >
                <CardContent sx={{ p: 2 }}>
                  <EditIcon sx={{ fontSize: 32, color: 'primary.main', mb: 1 }} />
                  <Typography variant="body2" fontWeight={500}>
                    {state.language === 'en' ? 'Edit Profile' : 'تحرير الملف'}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </CardContent>
        </Card>

        {/* Settings FAB */}
        <Fab
          color="primary"
          aria-label="Settings"
          onClick={() => setSettingsOpen(true)}
          sx={{
            position: 'fixed',
            bottom: { xs: 100, sm: 24 },
            right: 24,
            zIndex: 1000,
          }}
        >
          <EditIcon />
        </Fab>

        {/* Settings Dialog */}
        <Dialog
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          maxWidth="sm"
          fullWidth
          sx={{
            '& .MuiDialog-paper': {
              borderRadius: '16px 16px 0 0',
              maxHeight: '80vh',
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
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, textAlign: 'center', fontWeight: 600 }}>
                {state.language === 'en' ? 'Settings' : 'الإعدادات'}
              </Typography>

              {/* Account Section */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  {state.language === 'en' ? 'Account' : 'الحساب'}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={() => setEditProfileOpen(true)}
                    fullWidth
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    {state.language === 'en' ? 'Edit Profile' : 'تحرير الملف الشخصي'}
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<LockIcon />}
                    fullWidth
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    {state.language === 'en' ? 'Change Password' : 'تغيير كلمة المرور'}
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<CloudDownloadIcon />}
                    fullWidth
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    {state.language === 'en' ? 'Download Data' : 'تحميل البيانات'}
                  </Button>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Notifications Section */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  {state.language === 'en' ? 'Notifications' : 'الإشعارات'}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.notificationsEnabled}
                        onChange={(e) => handleSettingChange('notificationsEnabled', e.target.checked)}
                      />
                    }
                    label={state.language === 'en' ? 'Push Notifications' : 'إشعارات الدفع'}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.emailNotifications}
                        onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                      />
                    }
                    label={state.language === 'en' ? 'Email Notifications' : 'إشعارات البريد الإلكتروني'}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.smsNotifications}
                        onChange={(e) => handleSettingChange('smsNotifications', e.target.checked)}
                      />
                    }
                    label={state.language === 'en' ? 'SMS Alerts' : 'تنبيهات الرسائل النصية'}
                  />
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Privacy & Security Section */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  {state.language === 'en' ? 'Privacy & Security' : 'الخصوصية والأمان'}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.locationServices}
                        onChange={(e) => handleSettingChange('locationServices', e.target.checked)}
                      />
                    }
                    label={state.language === 'en' ? 'Location Services' : 'خدمات الموقع'}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.biometricLogin}
                        onChange={(e) => handleSettingChange('biometricLogin', e.target.checked)}
                        disabled
                      />
                    }
                    label={state.language === 'en' ? 'Biometric Login (Web Disabled)' : 'تسجيل البيومتري (معطل على الويب)'}
                  />
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Appearance Section */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  {state.language === 'en' ? 'Appearance' : 'المظهر'}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.darkMode}
                        onChange={(e) => handleSettingChange('darkMode', e.target.checked)}
                      />
                    }
                    label={state.language === 'en' ? 'Dark Mode' : 'الوضع المظلم'}
                  />
                </Box>
              </Box>

              {/* Language Section */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  {state.language === 'en' ? 'Language' : 'اللغة'}
                </Typography>
                <FormControl fullWidth>
                  <InputLabel>
                    {state.language === 'en' ? 'Select Language' : 'اختر اللغة'}
                  </InputLabel>
                  <Select
                    value={settings.selectedLanguage}
                    onChange={(e) => handleSettingChange('selectedLanguage', e.target.value)}
                    label={state.language === 'en' ? 'Select Language' : 'اختر اللغة'}
                  >
                    {languages.map(lang => (
                      <MenuItem key={lang} value={lang}>
                        {lang}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Danger Zone */}
              <Box sx={{ mb: 3 }}>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => setDeleteAccountDialog(true)}
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  {state.language === 'en' ? 'Delete Account' : 'حذف الحساب'}
                </Button>

                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<LogoutIcon />}
                  onClick={handleLogout}
                  fullWidth
                >
                  {state.language === 'en' ? 'Logout' : 'تسجيل الخروج'}
                </Button>
              </Box>
            </Box>
          </DialogContent>
        </Dialog>

        {/* Edit Profile Dialog */}
        <Dialog open={editProfileOpen} onClose={() => setEditProfileOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            {state.language === 'en' ? 'Edit Profile' : 'تحرير الملف الشخصي'}
          </DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label={state.language === 'en' ? 'Full Name' : 'الاسم الكامل'}
              value={editData.fullName}
              onChange={(e) => setEditData({ ...editData, fullName: e.target.value })}
              sx={{ mb: 2, mt: 1 }}
            />

            <TextField
              fullWidth
              label={state.language === 'en' ? 'Bio' : 'النبذة'}
              multiline
              rows={3}
              value={editData.bio}
              onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label={state.language === 'en' ? 'Phone' : 'الهاتف'}
              value={editData.phone}
              onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label={state.language === 'en' ? 'Blood Group' : 'فصيلة الدم'}
              value={editData.bloodGroup}
              onChange={(e) => setEditData({ ...editData, bloodGroup: e.target.value })}
              sx={{ mb: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditProfileOpen(false)}>
              {state.language === 'en' ? 'Cancel' : 'إلغاء'}
            </Button>
            <Button variant="contained" onClick={handleSaveProfile}>
              {state.language === 'en' ? 'Save' : 'حفظ'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Medical ID Dialog */}
        <Dialog open={medicalIdOpen} onClose={() => setMedicalIdOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            {state.language === 'en' ? 'Medical ID' : 'الهوية الطبية'}
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {state.language === 'en'
                ? 'Emergency medical information for quick access by healthcare providers.'
                : 'معلومات طبية طارئة للوصول السريع من قبل مقدمي الرعاية الصحية.'
              }
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                <Typography variant="subtitle2" fontWeight={600}>
                  {state.language === 'en' ? 'Name' : 'الاسم'}: {state.user?.fullName}
                </Typography>
                <Typography variant="subtitle2" fontWeight={600}>
                  {state.language === 'en' ? 'Blood Group' : 'فصيلة الدم'}: {state.user?.bloodGroup || (state.language === 'en' ? 'Not set' : 'غير محدد')}
                </Typography>
                <Typography variant="subtitle2" fontWeight={600}>
                  {state.language === 'en' ? 'Emergency Contact' : 'الاتصال الطارئ'}: {state.user?.emergencyContact || (state.language === 'en' ? 'Not set' : 'غير محدد')}
                </Typography>
              </Box>

              <Chip
                label={state.language === 'en' ? 'Available on iOS Lock Screen & Android Medical ID' : 'متوفر على شاشة قفل iOS وحقل الهوية الطبية لأندرويد'}
                variant="outlined"
                color="primary"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setMedicalIdOpen(false)}>
              {state.language === 'en' ? 'Close' : 'إغلاق'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* QR Code Share Dialog */}
        <Dialog open={qrDialogOpen} onClose={() => setQrDialogOpen(false)}>
          <DialogTitle>
            {state.language === 'en' ? 'Share Profile' : 'مشاركة الملف'}
          </DialogTitle>
          <DialogContent sx={{ textAlign: 'center' }}>
            <Typography variant="body1" sx={{ mb: 3 }}>
              {state.language === 'en'
                ? 'Show this QR code to share your profile'
                : 'أظهر رمز الـ QR هذا لمشاركة ملفك الشخصي'
              }
            </Typography>

            <Box
              sx={{
                width: 200,
                height: 200,
                bgcolor: 'grey.200',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                [QR Code Placeholder]<br />NUJJUM Profile Share
              </Typography>
            </Box>

            <Typography variant="caption" color="text.secondary">
              ID: {state.user?.id?.substring(0, 8)}...
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setQrDialogOpen(false)}>
              {state.language === 'en' ? 'Close' : 'إغلاق'}
            </Button>
            <Button variant="contained" onClick={handleShareProfile}>
              {state.language === 'en' ? 'Share Link' : 'مشاركة الرابط'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Account Dialog */}
        <Dialog open={deleteAccountDialog} onClose={() => setDeleteAccountDialog(false)}>
          <DialogTitle>
            {state.language === 'en' ? 'Delete Account' : 'حذف الحساب'}
          </DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ mb: 2 }}>
              {state.language === 'en'
                ? 'Are you sure you want to delete your account? This action cannot be undone. All your data, appointments, and history will be permanently removed.'
                : 'هل أنت متأكد من أنك تريد حذف حسابك؟ لا يمكن التراجع عن هذا الإجراء. سيتم حذف جميع بياناتك ومواعيدك وسجلك بشكل دائم.'
              }
            </DialogContentText>
            <Typography variant="body2" color="error.main" sx={{ fontWeight: 600 }}>
              {state.language === 'en' ? 'This action is irreversible.' : 'هذا الإجراء لا رجعة فيه.'}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteAccountDialog(false)}>
              {state.language === 'en' ? 'Cancel' : 'إلغاء'}
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                // In a real app, this would call backend API to delete account
                console.log('Deleting account...');

                // Clear local data
                localStorage.removeItem('nujjum_user');
                localStorage.removeItem('nujjum_users');
                localStorage.removeItem('nujjum_language');
                localStorage.removeItem('nujjum_theme_mode');
                localStorage.removeItem('nujjum_accessibility_mode');

                // Logout and redirect
                logout();
                setDeleteAccountDialog(false);

                setSnackbar({
                  open: true,
                  message: 'Account deleted successfully',
                  severity: 'success'
                });
              }}
            >
              {state.language === 'en' ? 'Delete Account' : 'حذف الحساب'}
            </Button>
          </DialogActions>
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

export default ProfilePage;

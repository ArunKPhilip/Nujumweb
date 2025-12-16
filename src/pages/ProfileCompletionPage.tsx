import React, { useState, useRef, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Avatar,
  IconButton,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  LinearProgress,
  Divider,
} from '@mui/material';
import {
  PhotoCamera,
  Add as AddIcon,
  Delete as DeleteIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Security as SecurityIcon,
  Favorite as FavoriteIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

interface Disability {
  type: string;
  severity: 'mild' | 'moderate' | 'severe';
  description?: string;
}

const ProfileCompletionPage: React.FC = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get signup data from session storage
  const [signupData, setSignupData] = useState<any>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    role: '',
    bio: '',
    location: '',
    disabilities: [] as Disability[],
    emergencyContacts: [] as EmergencyContact[],
    preferences: {
      language: 'english',
      notifications: true,
      marketing: false,
      accessibility: {
        highContrast: false,
        largeText: false,
        screenReader: false,
      },
    },
    biometrics: {
      enabled: false,
      fingerprint: false,
      facialRecognition: false,
    },
  });

  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Basic, 2: Medical, 3: Contacts, 4: Preferences

  // Disability options for multiple selection
  const disabilityOptions = [
    'Physical Disability',
    'Visual Impairment',
    'Hearing Impairment',
    'Cognitive Disability',
    'Communication Disability',
    'Autism Spectrum Disorder',
    'Mental Health Conditions',
    'Chronic Illness',
    'Mobility Impairment',
    'Other',
  ];

  // Relationship options for emergency contacts
  const relationshipOptions = [
    'Parent',
    'Spouse',
    'Child',
    'Sibling',
    'Friend',
    'Caregiver',
    'Doctor',
    'Other',
  ];

  useEffect(() => {
    // Load signup data from session storage
    const basicData = sessionStorage.getItem('signup_basic_data');
    const documentData = sessionStorage.getItem('signup_documents');
    const passwordData = sessionStorage.getItem('signup_password');

    if (!basicData || !documentData || !passwordData) {
      navigate('/signup', { replace: true });
      return;
    }

    const parsedBasicData = JSON.parse(basicData);
    const parsedDocumentData = JSON.parse(documentData);

    setSignupData({
      basic: parsedBasicData,
      documents: parsedDocumentData,
      password: passwordData,
    });

    // Pre-populate form with basic data
    setFormData(prev => ({
      ...prev,
      disabilities: [{
        type: parsedBasicData.disabilityType,
        severity: 'moderate',
      }],
    }));
  }, [navigate]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('Profile image must be less than 5MB.');
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        alert('Please upload a JPG or PNG image.');
        return;
      }

      setUploadingImage(true);
      setProfileImage(file);

      // Simulate upload
      setTimeout(() => {
        const url = URL.createObjectURL(file);
        setProfileImageUrl(url);
        setUploadingImage(false);
      }, 1500);
    }
  };

  const handleAddEmergencyContact = () => {
    setFormData(prev => ({
      ...prev,
      emergencyContacts: [...prev.emergencyContacts, {
        id: Date.now().toString(),
        name: '',
        phone: '',
        relationship: '',
      }],
    }));
  };

  const handleRemoveEmergencyContact = (id: string) => {
    setFormData(prev => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.filter(contact => contact.id !== id),
    }));
  };

  const handleEmergencyContactChange = (id: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.map(contact =>
        contact.id === id ? { ...contact, [field]: value } : contact
      ),
    }));
  };

  const handleAddDisability = (type: string) => {
    if (!formData.disabilities.some(d => d.type === type)) {
      setFormData(prev => ({
        ...prev,
        disabilities: [...prev.disabilities, {
          type,
          severity: 'moderate',
        }],
      }));
    }
  };

  const handleRemoveDisability = (type: string) => {
    setFormData(prev => ({
      ...prev,
      disabilities: prev.disabilities.filter(d => d.type !== type),
    }));
  };

  const handleDisabilityChange = (type: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      disabilities: prev.disabilities.map(disability =>
        disability.type === type ? { ...disability, [field]: value } : disability
      ),
    }));
  };

  const handlePreferencesChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      preferences: { ...prev.preferences, [field]: value },
    }));
  };

  const handleAccessibilityChange = (field: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        accessibility: {
          ...prev.preferences.accessibility,
          [field]: value,
        },
      },
    }));
  };

  const handleBiometricsChange = (field: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      biometrics: { ...prev.biometrics, [field]: value },
    }));
  };

  const validateCurrentStep = () => {
    const newErrors: any = {};

    // Common validations
    if (step === 1) {
      if (!formData.username.trim()) {
        newErrors.username = 'Username is required';
      } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.username)) {
        newErrors.username = 'Username can only contain letters, numbers, underscores, and hyphens';
      }

      if (!formData.role.trim()) {
        newErrors.role = 'Role is required';
      }
    }

    if (step === 3) {
      // Validate emergency contacts
      formData.emergencyContacts.forEach((contact, index) => {
        if (!contact.name.trim()) {
          newErrors[`contact_${contact.id}_name`] = 'Name is required';
        }
        if (!contact.phone.trim()) {
          newErrors[`contact_${contact.id}_phone`] = 'Phone number is required';
        }
        if (!contact.relationship) {
          newErrors[`contact_${contact.id}_relationship`] = 'Relationship is required';
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handlePrevious = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;

    setLoading(true);

    try {
      // Prepare complete signup data with all collected information
      const completeSignupData = {
        fullName: signupData.basic.fullName,
        email: signupData.basic.email,
        phone: signupData.basic.phone,
        countryOfResidence: signupData.basic.countryOfResidence,
        disabilityType: signupData.basic.disabilityType, // This will be the display name from SignupPage
        password: signupData.password,
        username: formData.username,
        bio: formData.bio,
        profilePicture: profileImageUrl || '',
        emergencyContact: formData.emergencyContacts.length > 0
          ? `${formData.emergencyContacts[0].name}: ${formData.emergencyContacts[0].phone}`
          : '',
        // Optional fields that may be added later
        nationality: '',
        gender: '',
        dateOfBirth: '',
        bloodGroup: '',
      };

      // Create the account using the signup function
      await signup(completeSignupData);

      // Clear session storage data
      sessionStorage.removeItem('signup_basic_data');
      sessionStorage.removeItem('signup_documents');
      sessionStorage.removeItem('signup_password');

      // Navigate to dashboard (user will be automatically logged in by signup)
      navigate('/dashboard', { replace: true });

    } catch (error: any) {
      console.error('Account creation failed:', error);
      const errorMessage = error.message || 'Account creation failed. Please try again.';

      if (errorMessage.includes('Username already exists')) {
        alert('This username is already taken. Please choose a different username.');
      } else if (errorMessage.includes('Please enter a valid email')) {
        alert('Please enter a valid email address.');
      } else if (errorMessage.includes('Password must be')) {
        alert('Password must be at least 8 characters long with mixed case and numbers.');
      } else {
        alert(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!signupData) {
    return <LinearProgress />;
  }

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Basic Information
            </Typography>

            {/* Profile Image Upload */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Box sx={{ position: 'relative', mr: 3 }}>
                <Avatar
                  sx={{ width: 80, height: 80 }}
                  src={profileImageUrl || undefined}
                >
                  {formData.username ? formData.username.charAt(0).toUpperCase() : '?'}
                </Avatar>
                {uploadingImage && (
                  <LinearProgress
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: 4,
                    }}
                  />
                )}
              </Box>
              <Box>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<PhotoCamera />}
                  disabled={uploadingImage}
                >
                  Add Photo
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/jpg"
                    hidden
                    onChange={handleImageUpload}
                  />
                </Button>
                <Typography variant="caption" display="block" color="text.secondary">
                  JPG, PNG up to 5MB
                </Typography>
              </Box>
            </Box>

            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              value={formData.username}
              onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
              error={!!errors.username}
              helperText={errors.username}
            />

            <FormControl fullWidth margin="normal" required error={!!errors.role}>
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                value={formData.role}
                label="Role"
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as string }))}
              >
                <MenuItem value="student">Student</MenuItem>
                <MenuItem value="professional">Professional</MenuItem>
                <MenuItem value="entrepreneur">Entrepreneur</MenuItem>
                <MenuItem value="caregiver">Caregiver</MenuItem>
                <MenuItem value="patient">Patient</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
              {errors.role && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                  {errors.role}
                </Typography>
              )}
            </FormControl>

            <TextField
              margin="normal"
              fullWidth
              id="bio"
              label="Bio (Optional)"
              name="bio"
              multiline
              rows={3}
              placeholder="Tell us a bit about yourself..."
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              helperText="Help others understand your situation"
            />

            <TextField
              margin="normal"
              fullWidth
              id="location"
              label="Location (Optional)"
              name="location"
              placeholder="City, Country"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              InputProps={{
                startAdornment: (
                  <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />
                ),
              }}
            />
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Health & Disability Information
            </Typography>

            {/* Disability Management */}
            <Typography variant="h6" gutterBottom>
              Disabilities
            </Typography>

            <Box sx={{ mb: 3 }}>
              {formData.disabilities.map((disability) => (
                <Card key={disability.type} sx={{ mb: 2, p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {disability.type}
                    </Typography>
                    <Chip
                      label={disability.severity.charAt(0).toUpperCase() + disability.severity.slice(1)}
                      color={
                        disability.severity === 'mild' ? 'success' :
                        disability.severity === 'moderate' ? 'warning' : 'error'
                      }
                      size="small"
                    />
                  </Box>

                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Severity</InputLabel>
                    <Select
                      label="Severity"
                      value={disability.severity}
                      onChange={(e) => handleDisabilityChange(disability.type, 'severity', e.target.value)}
                    >
                      <MenuItem value="mild">Mild</MenuItem>
                      <MenuItem value="moderate">Moderate</MenuItem>
                      <MenuItem value="severe">Severe</MenuItem>
                    </Select>
                  </FormControl>

                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    label="Additional Details (Optional)"
                    placeholder="Any specific needs or accommodations..."
                    value={disability.description || ''}
                    onChange={(e) => handleDisabilityChange(disability.type, 'description', e.target.value)}
                  />
                </Card>
              ))}
            </Box>

            <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
              Add Additional Disabilities
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {disabilityOptions.filter(type => !formData.disabilities.some(d => d.type === type)).map((type) => (
                <Chip
                  key={type}
                  label={type}
                  onClick={() => handleAddDisability(type)}
                  deleteIcon={<AddIcon />}
                  onDelete={() => handleAddDisability(type)}
                  variant="outlined"
                  color="primary"
                />
              ))}
            </Box>
          </Box>
        );

      case 3:
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Emergency Contacts
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Emergency contacts will only be used in case of emergency and will be securely stored.
            </Typography>

            {formData.emergencyContacts.map((contact) => (
              <Card key={contact.id} sx={{ mb: 2, p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6">Emergency Contact</Typography>
                  <IconButton
                    color="error"
                    onClick={() => handleRemoveEmergencyContact(contact.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>

                <TextField
                  fullWidth
                  label="Name"
                  value={contact.name}
                  onChange={(e) => handleEmergencyContactChange(contact.id, 'name', e.target.value)}
                  error={!!errors[`contact_${contact.id}_name`]}
                  helperText={errors[`contact_${contact.id}_name`]}
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="Phone Number"
                  value={contact.phone}
                  onChange={(e) => handleEmergencyContactChange(contact.id, 'phone', e.target.value)}
                  error={!!errors[`contact_${contact.id}_phone`]}
                  helperText={errors[`contact_${contact.id}_phone`]}
                  InputProps={{
                    startAdornment: <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                  sx={{ mb: 2 }}
                />

                <FormControl fullWidth error={!!errors[`contact_${contact.id}_relationship`]}>
                  <InputLabel>Relationship</InputLabel>
                  <Select
                    label="Relationship"
                    value={contact.relationship}
                    onChange={(e) => handleEmergencyContactChange(contact.id, 'relationship', e.target.value)}
                  >
                    {relationshipOptions.map((relationship) => (
                      <MenuItem key={relationship} value={relationship}>
                        {relationship}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors[`contact_${contact.id}_relationship`] && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                      {errors[`contact_${contact.id}_relationship`]}
                    </Typography>
                  )}
                </FormControl>
              </Card>
            ))}

            <Button
              variant="outlined"
              onClick={handleAddEmergencyContact}
              startIcon={<AddIcon />}
              sx={{ mt: 2 }}
            >
              Add Emergency Contact
            </Button>

            {formData.emergencyContacts.length === 0 && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                We recommend adding at least one emergency contact for your safety.
              </Alert>
            )}
          </Box>
        );

      case 4:
        return (
          <Box>
            <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
              Preferences & Security
            </Typography>

            {/* Notifications & Preferences */}
            <Card sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                <FavoriteIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                App Preferences
              </Typography>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Preferred Language</InputLabel>
                <Select
                  label="Preferred Language"
                  value={formData.preferences.language}
                  onChange={(e) => handlePreferencesChange('language', e.target.value)}
                >
                  <MenuItem value="english">English</MenuItem>
                  <MenuItem value="arabic">Arabic (العربية)</MenuItem>
                </Select>
              </FormControl>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Notifications
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.preferences.notifications}
                      onChange={(e) => handlePreferencesChange('notifications', e.target.checked)}
                    />
                    {' '}App notifications
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.preferences.marketing}
                      onChange={(e) => handlePreferencesChange('marketing', e.target.checked)}
                    />
                    {' '}Marketing communications
                  </label>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>
                Accessibility Options
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <label>
                  <input
                    type="checkbox"
                    checked={formData.preferences.accessibility.highContrast}
                    onChange={(e) => handleAccessibilityChange('highContrast', e.target.checked)}
                  />
                  {' '}High contrast
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={formData.preferences.accessibility.largeText}
                    onChange={(e) => handleAccessibilityChange('largeText', e.target.checked)}
                  />
                  {' '}Large text
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={formData.preferences.accessibility.screenReader}
                    onChange={(e) => handleAccessibilityChange('screenReader', e.target.checked)}
                  />
                  {' '}Screen reader support
                </label>
              </Box>
            </Card>

            {/* Biometric Security */}
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                <SecurityIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Security & Biometrics
              </Typography>

              <Box sx={{ mb: 2 }}>
                <label>
                  <input
                    type="checkbox"
                    checked={formData.biometrics.enabled}
                    onChange={(e) => handleBiometricsChange('enabled', e.target.checked)}
                  />
                  {' '}Enable biometric authentication
                </label>
              </Box>

              {formData.biometrics.enabled && (
                <Box sx={{ ml: 3, display: 'flex', gap: 2 }}>
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.biometrics.fingerprint}
                      onChange={(e) => handleBiometricsChange('fingerprint', e.target.checked)}
                    />
                    {' '}Fingerprint
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.biometrics.facialRecognition}
                      onChange={(e) => handleBiometricsChange('facialRecognition', e.target.checked)}
                    />
                    {' '}Facial recognition
                  </label>
                </Box>
              )}
            </Card>
          </Box>
        );

      default:
        return null;
    }
  };

  const recommendedNextStep = () => {
    if (!formData.emergencyContacts.length && step === 3) {
      return "You'll be able to add emergency contacts later in your profile settings.";
    }
    return null;
  };

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h4" fontWeight={600} sx={{ mb: 2 }}>
          Complete Your Profile
        </Typography>

        <Typography variant="body2" sx={{ mb: 4, color: 'text.secondary', textAlign: 'center' }}>
          Help us personalize your NUJJUM experience by completing your profile information.
        </Typography>

        {/* Step Progress Indicator */}
        <Box sx={{ width: '100%', mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            {['Basic Info', 'Health Info', 'Contacts', 'Preferences'].map((label, index) => (
              <Box key={label} sx={{ flex: 1, textAlign: 'center' }}>
                <Typography
                  variant="body2"
                  fontWeight={index + 1 === step ? 'bold' : 'normal'}
                  color={index + 1 <= step ? 'primary' : 'text.secondary'}
                >
                  {label}
                </Typography>
              </Box>
            ))}
          </Box>
          <LinearProgress
            variant="determinate"
            value={(step / 4) * 100}
            sx={{ height: 4, borderRadius: 2 }}
          />
        </Box>

        <Card sx={{ width: '100%', maxWidth: 700, boxShadow: 3 }}>
          <CardContent sx={{ p: 4 }}>
            {renderStepContent()}

            {recommendedNextStep() && (
              <Alert severity="info" sx={{ mt: 3 }}>
                {recommendedNextStep()}
              </Alert>
            )}

            {/* Navigation */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              {step > 1 && (
                <Button variant="outlined" onClick={handlePrevious}>
                  Previous
                </Button>
              )}

              {step < 4 ? (
                <Button variant="contained" onClick={handleNext}>
                  Next
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={loading}
                  color="primary"
                >
                  {loading ? 'Creating Account...' : 'Complete Setup'}
                </Button>
              )}
            </Box>

            <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block', textAlign: 'center' }}>
              Step {step} of 4
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default ProfileCompletionPage;

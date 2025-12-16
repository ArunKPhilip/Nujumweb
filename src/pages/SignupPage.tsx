import React, { useState } from 'react';
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
  Link,
  InputAdornment,
} from '@mui/material';
import {
  Email as EmailIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Public as PublicIcon,
  Accessibility as AccessibilityIcon,
} from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useAuth();

  // Step 1: Basic Details (simplified)
  const [basicData, setBasicData] = useState({
    fullName: '',
    email: '',
    phone: '',
    countryOfResidence: 'United Arab Emirates',
    disabilityType: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Validation states
  const [fullNameError, setFullNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [countryError, setCountryError] = useState('');
  const [disabilityError, setDisabilityError] = useState('');

  // Disability types
  const disabilityTypes = [
    'Physical Disability',
    'Visual Impairment',
    'Hearing Impairment',
    'Cognitive Disability',
    'Communication Disability',
    'Other',
  ];

  // Countries
  const countries = [
    'United Arab Emirates',
    'Saudi Arabia',
    'Qatar',
    'Kuwait',
    'Bahrain',
    'Oman',
    'Other',
  ];

  const validateFullName = (fullName: string) => {
    if (!fullName.trim()) {
      setFullNameError(state.language === 'en' ? 'Full name is required' : 'الاسم الكامل مطلوب');
      return false;
    }
    if (fullName.trim().length < 2) {
      setFullNameError(state.language === 'en' ? 'Full name must be at least 2 characters' : 'الاسم الكامل يجب أن يكون حرفين على الأقل');
      return false;
    }
    setFullNameError('');
    return true;
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError(state.language === 'en' ? 'Email is required' : 'البريد الإلكتروني مطلوب');
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError(state.language === 'en' ? 'Please enter a valid email address' : 'يرجى إدخال عنوان بريد إلكتروني صحيح');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePhone = (phone: string) => {
    if (phone && !/^\+?[1-9]\d{1,14}$/.test(phone.replace(/\s+/g, ''))) {
      setPhoneError(state.language === 'en' ? 'Please enter a valid phone number' : 'يرجى إدخال رقم هاتف صحيح');
      return false;
    }
    setPhoneError('');
    return true;
  };

  const validateDisability = (disability: string) => {
    if (!disability) {
      setDisabilityError(state.language === 'en' ? 'Please select your disability type' : 'يرجى تحديد نوع الإعاقة');
      return false;
    }
    setDisabilityError('');
    return true;
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBasicData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear errors when user starts typing
    if (error) {
      setError('');
    }

    // Clear specific field errors when user types
    if (name === 'fullName') setFullNameError('');
    if (name === 'email') setEmailError('');
    if (name === 'phone') setPhoneError('');
  };

  const handleSelectChange = (fieldName: string) => (event: any) => {
    const value = event.target.value;
    setBasicData(prev => ({
      ...prev,
      [fieldName]: value,
    }));

    // Clear errors when user starts typing
    if (error) {
      setError('');
    }

    // Clear specific field errors when user selects
    if (fieldName === 'disabilityType') setDisabilityError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all required fields
    const isFullNameValid = validateFullName(basicData.fullName);
    const isEmailValid = validateEmail(basicData.email);
    const isPhoneValid = validatePhone(basicData.phone);
    const isDisabilityValid = validateDisability(basicData.disabilityType);

    if (!isFullNameValid || !isEmailValid || !isPhoneValid || !isDisabilityValid) {
      console.log('Validation failed:', { isFullNameValid, isEmailValid, isPhoneValid, isDisabilityValid });
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Store basic data in session storage for next steps
      const signupData = JSON.stringify(basicData);
      sessionStorage.setItem('signup_basic_data', signupData);
      console.log('Stored signup data:', signupData);

      console.log('Navigating to document verification...');
      // Navigate to document verification step
      navigate('/signup/documents', { replace: true });

    } catch (err: any) {
      console.error('Signup submission error:', err);
      const errorMessage = err.message || (state.language === 'en' ? 'Failed to process your information' : 'فشل في معالجة معلوماتك');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
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
          {state.language === 'en' ? 'Create Your Account' : 'إنشاء حسابك'}
        </Typography>

        <Typography variant="body2" sx={{ mb: 4, color: 'text.secondary', textAlign: 'center' }}>
          {state.language === 'en'
            ? 'Join NUJJUM to access personalized disability support services'
            : 'انضم إلى NUJJUM للوصول إلى خدمات دعم الإعاقة المخصصة'
          }
        </Typography>

        <Card sx={{ width: '100%', maxWidth: 600, boxShadow: 3 }}>
          <CardContent sx={{ p: 4 }}>
            {/* Step Indicator */}
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Typography variant="h6" fontWeight={500}>
                {state.language === 'en' ? 'Step 1: Basic Information' : 'الخطوة 1: المعلومات الأساسية'}
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
              {/* Full Name */}
              <TextField
                margin="normal"
                required
                fullWidth
                id="fullName"
                label={state.language === 'en' ? 'Full Name' : 'الاسم الكامل'}
                name="fullName"
                autoComplete="name"
                value={basicData.fullName}
                onChange={handleTextChange}
                error={!!fullNameError}
                helperText={fullNameError}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon />
                    </InputAdornment>
                  ),
                }}
              />

              {/* Email */}
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label={state.language === 'en' ? 'Email Address' : 'عنوان البريد الإلكتروني'}
                name="email"
                autoComplete="email"
                type="email"
                value={basicData.email}
                onChange={handleTextChange}
                error={!!emailError}
                helperText={emailError}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon />
                    </InputAdornment>
                  ),
                }}
              />

              {/* Phone */}
              <TextField
                margin="normal"
                fullWidth
                id="phone"
                label={state.language === 'en' ? 'Phone Number' : 'رقم الهاتف'}
                name="phone"
                autoComplete="tel"
                type="tel"
                value={basicData.phone}
                onChange={handleTextChange}
                error={!!phoneError}
                helperText={phoneError}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon />
                    </InputAdornment>
                  ),
                }}
              />

              {/* Country of Residence */}
              <FormControl fullWidth margin="normal">
                <InputLabel id="country-label">
                  {state.language === 'en' ? 'Country of Residence' : 'بلد الإقامة'}
                </InputLabel>
                <Select
                  labelId="country-label"
                  id="countryOfResidence"
                  name="countryOfResidence"
                  value={basicData.countryOfResidence}
                  onChange={handleSelectChange('countryOfResidence')}
                  label={state.language === 'en' ? 'Country of Residence' : 'بلد الإقامة'}
                  startAdornment={
                    <InputAdornment position="start">
                      <PublicIcon />
                    </InputAdornment>
                  }
                >
                  {countries.map(country => (
                    <MenuItem key={country} value={country}>
                      {country}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Disability Type */}
              <FormControl fullWidth margin="normal" required error={!!disabilityError}>
                <InputLabel id="disability-label">
                  {state.language === 'en' ? 'Disability Type' : 'نوع الإعاقة'}
                </InputLabel>
                <Select
                  labelId="disability-label"
                  id="disabilityType"
                  name="disabilityType"
                  value={basicData.disabilityType}
                  onChange={handleSelectChange('disabilityType')}
                  label={state.language === 'en' ? 'Disability Type' : 'نوع الإعاقة'}
                  startAdornment={
                    <InputAdornment position="start">
                      <AccessibilityIcon />
                    </InputAdornment>
                  }
                >
                  {disabilityTypes.map(type => (
                    <MenuItem key={type} value={type}>
                      {state.language === 'en' ? type : (
                        type === 'Physical Disability' ? 'إعاقة جسدية' :
                        type === 'Visual Impairment' ? 'إعاقة بصرية' :
                        type === 'Hearing Impairment' ? 'إعاقة سمعية' :
                        type === 'Cognitive Disability' ? 'إعاقة إدراكية' :
                        type === 'Communication Disability' ? 'إعاقة تواصل' :
                        'أخرى'
                      )}
                    </MenuItem>
                  ))}
                </Select>
                {disabilityError && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                    {disabilityError}
                  </Typography>
                )}
              </FormControl>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, py: 1.5 }}
                disabled={loading}
              >
                {loading
                  ? (state.language === 'en' ? 'Processing...' : 'معالجة...')
                  : (state.language === 'en' ? 'Continue to Next Step' : 'المتابعة للخطوة التالية')
                }
              </Button>
            </Box>
          </CardContent>
        </Card>

        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Link
            component={RouterLink}
            to="/login"
            variant="body2"
            sx={{
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            {state.language === 'en'
              ? 'Already have an account? Sign In'
              : 'لديك حساب بالفعل؟ تسجيل الدخول'
            }
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default SignupPage;

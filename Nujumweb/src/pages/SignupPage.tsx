import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
  Link,
  IconButton,
  InputAdornment,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { signup, state } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // Validation states
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [termsError, setTermsError] = useState('');

  const validateUsername = (username: string) => {
    if (!username.trim()) {
      setUsernameError('Username is required');
      return false;
    }
    if (username.length < 3) {
      setUsernameError('Username must be at least 3 characters');
      return false;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setUsernameError('Username can only contain letters, numbers, and underscores');
      return false;
    }
    setUsernameError('');
    return true;
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError('Email is required');
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (password: string) => {
    if (!password.trim()) {
      setPasswordError('Password is required');
      return false;
    }
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return false;
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      setPasswordError('Password must contain at least one uppercase letter, one lowercase letter, and one number');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const validateConfirmPassword = (confirmPassword: string, password: string) => {
    if (!confirmPassword.trim()) {
      setConfirmPasswordError('Please confirm your password');
      return false;
    }
    if (confirmPassword !== password) {
      setConfirmPasswordError('Passwords do not match');
      return false;
    }
    setConfirmPasswordError('');
    return true;
  };

  const validateTerms = (agreeToTerms: boolean) => {
    if (!agreeToTerms) {
      setTermsError('You must agree to the terms and conditions');
      return false;
    }
    setTermsError('');
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear errors when user starts typing
    if (error) {
      setError('');
    }

    // Clear specific field errors when user types
    if (name === 'username') setUsernameError('');
    if (name === 'email') setEmailError('');
    if (name === 'password') {
      setPasswordError('');
      if (formData.confirmPassword) {
        validateConfirmPassword(formData.confirmPassword, value);
      }
    }
    if (name === 'confirmPassword') validateConfirmPassword(value, formData.password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const isUsernameValid = validateUsername(formData.username);
    const isEmailValid = validateEmail(formData.email);
    const isPasswordValid = validatePassword(formData.password);
    const isConfirmPasswordValid = validateConfirmPassword(formData.confirmPassword, formData.password);
    const isTermsValid = validateTerms(agreeToTerms);

    if (!isUsernameValid || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid || !isTermsValid) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Prepare user data for signup
      const userData: any = {
        username: formData.username.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        disabilityType: '', // Will be filled later in profile setup
        countryOfResidence: 'United Arab Emirates',
        nationality: '',
        gender: '',
        dateOfBirth: '',
      };

      await signup(userData);

      // Success - navigate to dashboard
      navigate('/dashboard', { replace: true });

    } catch (err: any) {
      const errorMessage = err.message || 'Signup failed. Please try again.';
      setError(errorMessage);

      // Clear passwords on error
      if (errorMessage.includes('already exists') || errorMessage.includes('Invalid')) {
        setFormData(prev => ({
          ...prev,
          password: '',
          confirmPassword: ''
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
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

        <Card sx={{ width: '100%', boxShadow: 3 }}>
          <CardContent sx={{ p: 4 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
              {/* Username */}
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label={state.language === 'en' ? 'Username' : 'اسم المستخدم'}
                name="username"
                autoComplete="username"
                value={formData.username}
                onChange={handleChange}
                error={!!usernameError}
                helperText={usernameError}
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
                value={formData.email}
                onChange={handleChange}
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

              {/* Full Name */}
              <TextField
                margin="normal"
                fullWidth
                id="fullName"
                label={state.language === 'en' ? 'Full Name (Optional)' : 'الاسم الكامل (اختياري)'}
                name="fullName"
                autoComplete="name"
                value={formData.fullName}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon />
                    </InputAdornment>
                  ),
                }}
              />

              {/* Phone */}
              <TextField
                margin="normal"
                fullWidth
                id="phone"
                label={state.language === 'en' ? 'Phone Number (Optional)' : 'رقم الهاتف (اختياري)'}
                name="phone"
                autoComplete="tel"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon />
                    </InputAdornment>
                  ),
                }}
              />

              {/* Password */}
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label={state.language === 'en' ? 'Password' : 'كلمة المرور'}
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                error={!!passwordError}
                helperText={passwordError}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={state.language === 'en' ? 'toggle password visibility' : 'إظهار/إخفاء كلمة المرور'}
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* Confirm Password */}
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label={state.language === 'en' ? 'Confirm Password' : 'تأكيد كلمة المرور'}
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!confirmPasswordError}
                helperText={confirmPasswordError}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={state.language === 'en' ? 'toggle confirm password visibility' : 'إظهار/إخفاء تأكيد كلمة المرور'}
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* Terms and Conditions */}
              <Box sx={{ mt: 2, mb: 1 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={agreeToTerms}
                      onChange={(e) => {
                        setAgreeToTerms(e.target.checked);
                        setTermsError('');
                      }}
                      color="primary"
                    />
                  }
                  label={
                    <Typography variant="body2">
                      {state.language === 'en' ? 'I agree to the ' : 'أوافق على '}
                      <Link
                        href="#"
                        sx={{ textDecoration: 'underline' }}
                        onClick={(e) => e.preventDefault()}
                      >
                        {state.language === 'en' ? 'Terms of Service' : 'شروط الخدمة'}
                      </Link>
                      {state.language === 'en' ? ' and ' : ' و'}
                      <Link
                        href="#"
                        sx={{ textDecoration: 'underline' }}
                        onClick={(e) => e.preventDefault()}
                      >
                        {state.language === 'en' ? 'Privacy Policy' : 'سياسة الخصوصية'}
                      </Link>
                    </Typography>
                  }
                />
                {termsError && (
                  <Typography variant="caption" color="error" sx={{ ml: 4 }}>
                    {termsError}
                  </Typography>
                )}
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, py: 1.5 }}
                disabled={loading}
              >
                {loading
                  ? (state.language === 'en' ? 'Creating Account...' : 'جارٍ إنشاء الحساب...')
                  : (state.language === 'en' ? 'Create Account' : 'إنشاء الحساب')
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

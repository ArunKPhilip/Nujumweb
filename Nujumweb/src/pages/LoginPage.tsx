import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Alert,
  Link,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, state } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Validation states
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError('Email is required');
      setIsEmailValid(false);
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      setIsEmailValid(false);
      return false;
    }
    setEmailError('');
    setIsEmailValid(true);
    return true;
  };

  const validatePassword = (password: string) => {
    if (!password.trim()) {
      setPasswordError('Password is required');
      setIsPasswordValid(false);
      return false;
    }
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      setIsPasswordValid(false);
      return false;
    }
    setPasswordError('');
    setIsPasswordValid(true);
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

    // Real-time validation
    if (name === 'email') {
      if (emailError) validateEmail(value);
    } else if (name === 'password') {
      if (passwordError) validatePassword(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const isEmailValidSubmit = validateEmail(formData.email);
    const isPasswordValidSubmit = validatePassword(formData.password);

    if (!isEmailValidSubmit || !isPasswordValidSubmit) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login(formData.email.trim(), formData.password);

      // Store remember me preference
      if (rememberMe) {
        localStorage.setItem('nujjum_remember_me', 'true');
      } else {
        localStorage.removeItem('nujjum_remember_me');
      }

      // Success - navigate to dashboard
      navigate('/dashboard', { replace: true });

    } catch (err: any) {
      // Handle different error types
      const errorMessage = err.message || 'Login failed. Please try again.';
      setError(errorMessage);

      // Clear password on failed login
      setFormData(prev => ({ ...prev, password: '' }));
      setIsPasswordValid(false);
    } finally {
      setLoading(false);
    }
  };

  // Auto-fill from localStorage if remember me was set
  React.useEffect(() => {
    const remembered = localStorage.getItem('nujjum_remember_me');
    if (remembered) {
      setRememberMe(true);
    }
  }, []);

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h4" fontWeight={600} sx={{ mb: 3 }}>
          {state.language === 'en' ? 'Welcome Back' : 'مرحباً بك مجدداً'}
        </Typography>

        <Card sx={{ width: '100%', boxShadow: 3 }}>
          <CardContent sx={{ p: 4 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label={state.language === 'en' ? 'Email Address' : 'عنوان البريد الإلكتروني'}
                name="email"
                autoComplete="email"
                autoFocus
                value={formData.email}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label={state.language === 'en' ? 'Password' : 'كلمة المرور'}
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
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

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, py: 1.5 }}
                disabled={loading}
              >
                {loading
                  ? (state.language === 'en' ? 'Signing in...' : 'جارٍ تسجيل الدخول...')
                  : (state.language === 'en' ? 'Sign In' : 'تسجيل الدخول')
                }
              </Button>

              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Link
                  component={RouterLink}
                  to="/signup"
                  variant="body2"
                  sx={{
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  {state.language === 'en'
                    ? "Don't have an account? Sign Up"
                    : 'ليس لديك حساب؟ إنشاء حساب'
                  }
                </Link>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default LoginPage;

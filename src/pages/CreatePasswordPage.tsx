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
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Lock as LockIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const CreatePasswordPage: React.FC = () => {
  const navigate = useNavigate();

  // Get basic and document data from session storage
  const getBasicData = () => {
    const data = sessionStorage.getItem('signup_basic_data');
    return data ? JSON.parse(data) : null;
  };

  const getDocumentData = () => {
    const data = sessionStorage.getItem('signup_documents');
    return data ? JSON.parse(data) : null;
  };

  const basicData = getBasicData();
  const documentData = getDocumentData();

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  // Redirect if data is missing
  if (!basicData || !documentData) {
    navigate('/signup', { replace: true });
    return null;
  }

  const validatePassword = (password: string) => {
    if (!password.trim()) {
      setPasswordError('Password is required');
      return false;
    }
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear errors when user starts typing
    if (error) {
      setError('');
    }

    // Clear specific field errors when user types
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
    const isPasswordValid = validatePassword(formData.password);
    const isConfirmPasswordValid = validateConfirmPassword(formData.confirmPassword, formData.password);

    if (!isPasswordValid || !isConfirmPasswordValid) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Store password data in session storage
      sessionStorage.setItem('signup_password', formData.password);

      // Navigate to profile completion
      navigate('/profile/complete', { replace: true });

    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create account. Please try again.';
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
          Create Your Password
        </Typography>

        <Typography variant="body2" sx={{ mb: 4, color: 'text.secondary', textAlign: 'center', maxWidth: 600 }}>
          Set a strong password for your NUJJUM account. This will be used to secure your personal information and services.
        </Typography>

        <Card sx={{ width: '100%', maxWidth: 600, boxShadow: 3 }}>
          <CardContent sx={{ p: 4 }}>
            {/* Step Indicator */}
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Typography variant="h6" fontWeight={500}>
                Step 3: Password Setup
              </Typography>
            </Box>

            {/* Email Display */}
            <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Account Email
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body1" fontWeight={500}>
                  {basicData.email}
                </Typography>
              </Box>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
              {/* Password */}
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                error={!!passwordError}
                helperText={passwordError || 'Must be at least 8 characters with uppercase, lowercase, and numbers'}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
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
                label="Confirm Password"
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
                        aria-label="toggle confirm password visibility"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* Password Strength Indicator */}
              {formData.password && (
                <Box sx={{ mt: 2, mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Password Strength
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {[
                      { label: '8+ characters', met: formData.password.length >= 8 },
                      { label: 'Uppercase', met: /[A-Z]/.test(formData.password) },
                      { label: 'Lowercase', met: /[a-z]/.test(formData.password) },
                      { label: 'Number', met: /\d/.test(formData.password) },
                    ].map((requirement) => (
                      <Box
                        key={requirement.label}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          bgcolor: requirement.met ? 'success.light' : 'grey.100',
                          color: requirement.met ? 'success.main' : 'text.secondary',
                          fontSize: '0.75rem',
                        }}
                      >
                        {requirement.label}
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, py: 1.5 }}
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/signup/documents', { replace: true })}
          >
            Back to Documents
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default CreatePasswordPage;

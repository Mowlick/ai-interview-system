import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import CircularProgress from '@mui/material/CircularProgress';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { commonStyles } from '../styles';
import { useAuth } from '../contexts/AuthContext';

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [validation, setValidation] = useState({
    name: true,
    email: true,
    password: true,
    confirmPassword: true,
  });

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validate on change
    switch (name) {
      case 'name':
        setValidation(prev => ({ ...prev, name: value.length >= 2 }));
        break;
      case 'email':
        setValidation(prev => ({ ...prev, email: validateEmail(value) }));
        break;
      case 'password':
        setValidation(prev => ({ ...prev, password: validatePassword(value) }));
        break;
      case 'confirmPassword':
        setValidation(prev => ({ ...prev, confirmPassword: value === formData.password }));
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validate all fields
    const isValid = Object.values(validation).every(Boolean);
    if (!isValid) {
      setError('Please fill in all fields correctly');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await signup(formData.name, formData.email, formData.password);
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={commonStyles.pageContainer}>
      <Container maxWidth="xs">
        <Box sx={commonStyles.formContainer}>
          <Paper elevation={24} sx={commonStyles.formPaper}>
            <Box sx={commonStyles.iconContainer}>
              <PersonAddIcon sx={{ color: 'white', fontSize: 40 }} />
            </Box>
            <Typography
              component="h1"
              variant="h4"
              sx={commonStyles.formTitle}
            >
              Create Account
            </Typography>
            <Typography
              variant="body1"
              sx={commonStyles.formSubtitle}
            >
              Join our AI Interview System and start conducting smarter interviews
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ mt: 1, width: '100%' }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Full Name"
                name="name"
                autoComplete="name"
                autoFocus
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
                error={!validation.name && formData.name !== ''}
                helperText={!validation.name && formData.name !== '' ? 'Name must be at least 2 characters' : ''}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                error={!validation.email && formData.email !== ''}
                helperText={!validation.email && formData.email !== '' ? 'Please enter a valid email address' : ''}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                error={!validation.password && formData.password !== ''}
                helperText={!validation.password && formData.password !== '' ? 'Password must be at least 8 characters' : ''}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={loading}
                error={!validation.confirmPassword && formData.confirmPassword !== ''}
                helperText={!validation.confirmPassword && formData.confirmPassword !== '' ? 'Passwords do not match' : ''}
              />
              {error && (
                <Typography
                  color="error"
                  sx={commonStyles.errorMessage}
                >
                  {error}
                </Typography>
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={commonStyles.submitButton}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Create Account'
                )}
              </Button>
              <Box sx={commonStyles.linkContainer}>
                <Link
                  component={RouterLink}
                  to="/login"
                  variant="body2"
                  sx={commonStyles.link}
                >
                  Already have an account? Sign in
                </Link>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default SignUp; 
import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import CircularProgress from '@mui/material/CircularProgress';
import LockResetIcon from '@mui/icons-material/LockReset';
import { commonStyles } from '../styles';

const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(value !== '' && !validateEmail(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setSuccess(false);

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      // TODO: Implement password reset logic
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      setSuccess(true);
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
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
              <LockResetIcon sx={{ color: 'white', fontSize: 40 }} />
            </Box>
            <Typography
              component="h1"
              variant="h4"
              sx={commonStyles.formTitle}
            >
              Reset Password
            </Typography>
            <Typography
              variant="body1"
              sx={commonStyles.formSubtitle}
            >
              Enter your email address and we'll send you instructions to reset your password
            </Typography>
            {success ? (
              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Typography
                  color="success.main"
                  sx={commonStyles.successMessage}
                >
                  Password reset instructions have been sent to your email.
                </Typography>
                <Link
                  component={RouterLink}
                  to="/login"
                  variant="body2"
                  sx={{ ...commonStyles.link, mt: 2, display: 'inline-block' }}
                >
                  Return to login
                </Link>
              </Box>
            ) : (
              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ mt: 1, width: '100%' }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={handleEmailChange}
                  disabled={loading}
                  error={emailError}
                  helperText={emailError ? 'Please enter a valid email address' : ''}
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
                    'Send Reset Instructions'
                  )}
                </Button>
                <Box sx={commonStyles.linkContainer}>
                  <Link
                    component={RouterLink}
                    to="/login"
                    variant="body2"
                    sx={commonStyles.link}
                  >
                    Back to login
                  </Link>
                </Box>
              </Box>
            )}
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default ForgotPassword; 
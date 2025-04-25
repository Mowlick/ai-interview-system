import { keyframes } from '@mui/system';

export const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const float = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
`;

export const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

export const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

export const commonStyles = {
  pageContainer: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',
    py: 4,
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
      zIndex: 1,
    },
  },
  formContainer: {
    animation: `${fadeIn} 0.6s ease-out`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    zIndex: 2,
  },
  formPaper: {
    padding: 4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    background: 'rgba(255, 255, 255, 0.98)',
    backdropFilter: 'blur(20px)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },
  iconContainer: {
    backgroundColor: 'primary.main',
    borderRadius: '50%',
    p: 2.5,
    mb: 3,
    animation: `${float} 3s ease-in-out infinite`,
    boxShadow: '0 8px 24px rgba(37, 99, 235, 0.3)',
    position: 'relative',
    '&::after': {
      content: '""',
      position: 'absolute',
      top: -4,
      left: -4,
      right: -4,
      bottom: -4,
      borderRadius: '50%',
      background: 'rgba(37, 99, 235, 0.1)',
      zIndex: -1,
      animation: `${pulse} 2s ease-in-out infinite`,
    },
  },
  formTitle: {
    fontWeight: 800,
    color: 'primary.dark',
    mb: 1,
    textAlign: 'center',
    letterSpacing: '-0.02em',
  },
  formSubtitle: {
    color: 'text.secondary',
    mb: 4,
    textAlign: 'center',
    maxWidth: '80%',
    lineHeight: 1.6,
  },
  submitButton: {
    mt: 3,
    mb: 2,
    py: 1.5,
    borderRadius: 2,
    fontSize: '1.1rem',
    fontWeight: 600,
    boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
    '&:hover': {
      boxShadow: '0 6px 20px rgba(37, 99, 235, 0.4)',
    },
    '&.Mui-disabled': {
      boxShadow: 'none',
    },
  },
  linkContainer: {
    display: 'flex',
    justifyContent: 'center',
    mt: 2,
    px: 1,
  },
  link: {
    color: 'primary.main',
    textDecoration: 'none',
    fontWeight: 500,
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      color: 'primary.dark',
      textDecoration: 'none',
    },
  },
  errorMessage: {
    mt: 2,
    textAlign: 'center',
    animation: `${fadeIn} 0.3s ease-out`,
    backgroundColor: 'error.light',
    color: 'error.dark',
    py: 1,
    px: 2,
    borderRadius: 1,
    fontWeight: 500,
  },
  successMessage: {
    mt: 2,
    textAlign: 'center',
    animation: `${fadeIn} 0.3s ease-out`,
    backgroundColor: 'success.light',
    color: 'success.dark',
    py: 1,
    px: 2,
    borderRadius: 1,
    fontWeight: 500,
  },
}; 
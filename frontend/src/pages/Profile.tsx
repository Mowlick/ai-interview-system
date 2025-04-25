import React from 'react';
import { Box, Typography } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const Profile: React.FC = () => {
  const { user } = useAuth();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6">User Information</Typography>
        <Typography>Name: {user?.name}</Typography>
        <Typography>Email: {user?.email}</Typography>
        <Typography>Role: {user?.role}</Typography>
      </Box>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Profile Settings
        </Typography>
        <Typography>
          This is a placeholder for profile settings. The actual profile page will include:
        </Typography>
        <ul>
          <li>Account settings</li>
          <li>Notification preferences</li>
          <li>Password change</li>
          <li>Interview history</li>
        </ul>
      </Box>
    </Box>
  );
};

export default Profile; 
import React from 'react';
import { Box, Typography } from '@mui/material';

const Reports: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Reports
      </Typography>
      <Typography>
        This is a placeholder for the reports page. The actual reports page will include:
      </Typography>
      <ul>
        <li>Interview performance analytics</li>
        <li>Emotional insights trends</li>
        <li>Candidate evaluation reports</li>
        <li>Custom report generation</li>
        <li>Export functionality</li>
      </ul>
    </Box>
  );
};

export default Reports; 
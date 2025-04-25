import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Chip,
  CircularProgress,
  useTheme,
  Button,
} from '@mui/material';
import {
  Assessment,
  Person,
  Schedule,
  TrendingUp,
  VideoCall,
  MoreVert,
  PlayArrow,
} from '@mui/icons-material';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { useAuth } from '../contexts/AuthContext';
import { useInterview } from '../contexts/InterviewContext';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

interface UpcomingInterview {
  id: string;
  candidateName: string;
  date: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography variant="subtitle2" color="textSecondary">
            {title}
          </Typography>
          <Typography variant="h4" sx={{ mt: 1, mb: 1 }}>
            {value}
          </Typography>
        </Box>
        <Box
          sx={{
            backgroundColor: `${color}20`,
            borderRadius: '50%',
            p: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {React.cloneElement(icon as React.ReactElement, {
            sx: { color: color },
          })}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { interviewData } = useInterview();
  const [loading, setLoading] = useState(true);

  // Sample upcoming interviews (in a real app, this would come from the backend)
  const upcomingInterviews: UpcomingInterview[] = [
    {
      id: '1',
      candidateName: 'John Doe',
      date: new Date(Date.now() + 1000 * 60 * 60).toLocaleString(),
      status: 'scheduled',
    },
    {
      id: '2',
      candidateName: 'Jane Smith',
      date: new Date(Date.now() + 1000 * 60 * 60 * 2).toLocaleString(),
      status: 'scheduled',
    },
    {
      id: '3',
      candidateName: 'Mike Johnson',
      date: new Date(Date.now() - 1000 * 60 * 60).toLocaleString(),
      status: 'completed',
    },
  ];

  // Update emotion data to use real-time data if available
  const emotionData = {
    labels: ['Happy', 'Neutral', 'Anxious', 'Confident', 'Confused'],
    datasets: [
      {
        data: interviewData.isInterviewActive ? [
          interviewData.currentEmotions.happiness,
          interviewData.currentEmotions.neutral,
          interviewData.currentEmotions.anxiety,
          interviewData.currentEmotions.confidence,
          100 - (
            interviewData.currentEmotions.happiness +
            interviewData.currentEmotions.neutral +
            interviewData.currentEmotions.anxiety +
            interviewData.currentEmotions.confidence
          ) / 4
        ] : [30, 25, 15, 20, 10],
        backgroundColor: [
          '#4CAF50',
          '#2196F3',
          '#FF9800',
          '#9C27B0',
          '#F44336',
        ],
      },
    ],
  };

  // Update performance data with real-time score if available
  const currentTime = new Date();
  const lastSixMonths = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(currentTime.getMonth() - (5 - i));
    return date.toLocaleString('default', { month: 'short' });
  });

  const performanceData = {
    labels: lastSixMonths,
    datasets: [
      {
        label: 'Interview Performance',
        data: interviewData.isInterviewActive ? [
          ...Array(5).fill(null),
          interviewData.overallScore
        ] : [65, 72, 68, 75, 82, 78],
        borderColor: theme.palette.primary.main,
        tension: 0.4,
        fill: false,
      },
    ],
  };

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const startNewInterview = () => {
    navigate('/interview');
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Welcome Message and Quick Actions */}
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Box>
              <Typography variant="h4" gutterBottom>
                Welcome back, {user?.name}!
              </Typography>
              {interviewData.isInterviewActive && (
                <Typography variant="subtitle1" color="success.main">
                  Interview in progress - Duration: {Math.floor(interviewData.interviewDuration / 60)}:
                  {(interviewData.interviewDuration % 60).toString().padStart(2, '0')}
                </Typography>
              )}
            </Box>
            <Button
              variant="contained"
              color="primary"
              startIcon={<PlayArrow />}
              onClick={startNewInterview}
              sx={{ height: 48 }}
            >
              {interviewData.isInterviewActive ? 'Return to Interview' : 'Start New Interview'}
            </Button>
          </Box>
        </Grid>

        {/* Statistics Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Interviews"
            value={24}
            icon={<VideoCall />}
            color={theme.palette.primary.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Upcoming Interviews"
            value={upcomingInterviews.filter(i => i.status === 'scheduled').length}
            icon={<Schedule />}
            color={theme.palette.success.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Current Score"
            value={interviewData.isInterviewActive ? `${interviewData.overallScore}%` : '78%'}
            icon={<TrendingUp />}
            color={theme.palette.info.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Candidates"
            value={42}
            icon={<Person />}
            color={theme.palette.warning.main}
          />
        </Grid>

        {/* Upcoming Interviews */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Upcoming Interviews</Typography>
              <IconButton>
                <MoreVert />
              </IconButton>
            </Box>
            <List>
              {upcomingInterviews.map((interview) => (
                <ListItem
                  key={interview.id}
                  divider
                  secondaryAction={
                    interview.status === 'scheduled' ? (
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        startIcon={<PlayArrow />}
                        onClick={() => navigate('/interview')}
                      >
                        Start
                      </Button>
                    ) : (
                      <Chip
                        label={interview.status}
                        size="small"
                        color={interview.status === 'completed' ? 'success' : 'default'}
                        variant="outlined"
                      />
                    )
                  }
                >
                  <ListItemText
                    primary={interview.candidateName}
                    secondary={`Scheduled for: ${interview.date}`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Emotion Distribution */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              {interviewData.isInterviewActive ? 'Live Emotion Analysis' : 'Recent Emotion Distribution'}
            </Typography>
            <Box sx={{ height: 300 }}>
              <Doughnut
                data={emotionData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Performance Trend */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Performance Trend
              {interviewData.isInterviewActive && ' (Live)'}
            </Typography>
            <Box sx={{ height: 300 }}>
              <Line
                data={performanceData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100,
                    },
                  },
                }}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 
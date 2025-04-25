import React, { useEffect, useRef, useState, useMemo, useCallback, memo } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  LinearProgress,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Rating,
  Fade,
  useTheme,
} from '@mui/material';
import {
  Videocam,
  VideocamOff,
  Mic,
  MicOff,
  Send,
  EmojiEmotions,
  RecordVoiceOver,
  Timer,
  TrendingUp,
} from '@mui/icons-material';
import { useInterview } from '../contexts/InterviewContext';
import emotionAnalysis from '../services/emotionAnalysis';
import { useNavigate } from 'react-router-dom';

// Audio analysis configuration
const AUDIO_ANALYSIS_INTERVAL = 1000; // 1 second
const EMOTION_ANALYSIS_INTERVAL = 2000; // 2 seconds

// Add these interfaces at the top of the file
interface EmotionScores {
  confidence: number;
  nervousness: number;
  anxiety: number;
  happiness: number;
  neutral: number;
}

interface InterviewData {
  emotionHistory: EmotionScores[];
  currentEmotions: EmotionScores;
  audioAnalysis: {
    confidence: number;
    clarity: number;
    pace: number;
  };
  overallScore: number;
  interviewDuration: number;
}

// Memoize the EmotionMeter component
const EmotionMeter = memo(({ label, value }: { label: string; value: number }) => (
  <Box sx={{ mb: 2 }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
      <Typography variant="body2">{label}</Typography>
      <Typography variant="body2" color="primary">{`${Math.round(value)}%`}</Typography>
    </Box>
    <LinearProgress
      variant="determinate"
      value={value}
      sx={{
        height: 8,
        borderRadius: 4,
        '& .MuiLinearProgress-bar': {
          borderRadius: 4,
        },
      }}
    />
  </Box>
));

// Memoize the ResultsSummary component
const ResultsSummary = memo(({ 
  showResults, 
  onClose, 
  interviewData, 
  theme 
}: { 
  showResults: boolean; 
  onClose: () => void; 
  interviewData: InterviewData; 
  theme: any;
}) => {
  const averageEmotions = useMemo(() => {
    const result = interviewData.emotionHistory.reduce(
      (acc: EmotionScores, emotion: EmotionScores) => ({
        confidence: acc.confidence + emotion.confidence,
        nervousness: acc.nervousness + emotion.nervousness,
        anxiety: acc.anxiety + emotion.anxiety,
        happiness: acc.happiness + emotion.happiness,
        neutral: acc.neutral + emotion.neutral,
      }),
      { confidence: 0, nervousness: 0, anxiety: 0, happiness: 0, neutral: 0 }
    );

    const totalEntries = interviewData.emotionHistory.length || 1;
    (Object.keys(result) as Array<keyof EmotionScores>).forEach(key => {
      result[key] = Math.round(result[key] / totalEntries);
    });

    return result;
  }, [interviewData.emotionHistory]);

  return (
    <Dialog
      open={showResults}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      TransitionComponent={Fade}
      TransitionProps={{ timeout: 500 }}
    >
      <DialogTitle sx={{ 
        background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
        color: 'white',
        textAlign: 'center',
        py: 3
      }}>
        <Typography variant="h4" gutterBottom>
          Interview Results Summary
        </Typography>
        <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
          {new Date().toLocaleDateString()}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ p: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Card 
              elevation={3}
              sx={{ 
                background: 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
                borderRadius: 2,
                overflow: 'hidden'
              }}
            >
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h1" color="primary" gutterBottom>
                  {interviewData.overallScore}%
                </Typography>
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  Overall Performance Score
                </Typography>
                <Rating 
                  value={Math.round(interviewData.overallScore / 20)} 
                  readOnly 
                  size="large"
                  sx={{ 
                    mt: 2,
                    '& .MuiRating-iconFilled': {
                      color: theme.palette.primary.main,
                    }
                  }}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card 
              elevation={2}
              sx={{ 
                height: '100%',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)'
                }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <EmojiEmotions color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">
                    Emotional Analysis
                  </Typography>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <EmotionMeter label="Average Confidence" value={averageEmotions.confidence} />
                  <EmotionMeter label="Average Nervousness" value={averageEmotions.nervousness} />
                  <EmotionMeter label="Average Anxiety" value={averageEmotions.anxiety} />
                  <EmotionMeter label="Average Happiness" value={averageEmotions.happiness} />
                  <EmotionMeter label="Average Neutral" value={averageEmotions.neutral} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card 
              elevation={2}
              sx={{ 
                height: '100%',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)'
                }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <RecordVoiceOver color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">
                    Voice Analysis
                  </Typography>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <EmotionMeter label="Voice Confidence" value={interviewData.audioAnalysis.confidence} />
                  <EmotionMeter label="Speech Clarity" value={interviewData.audioAnalysis.clarity} />
                  <EmotionMeter label="Speaking Pace" value={interviewData.audioAnalysis.pace} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card 
              elevation={2}
              sx={{ 
                background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                borderRadius: 2
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrendingUp color="primary" sx={{ mr: 1 }} />
                  Key Insights
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Box 
                      sx={{ 
                        textAlign: 'center', 
                        p: 3,
                        background: 'white',
                        borderRadius: 2,
                        boxShadow: 1
                      }}
                    >
                      <Timer color="primary" sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="h4" color="primary">
                        {Math.round(interviewData.interviewDuration / 60)}:{(interviewData.interviewDuration % 60).toString().padStart(2, '0')}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Interview Duration
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box 
                      sx={{ 
                        textAlign: 'center', 
                        p: 3,
                        background: 'white',
                        borderRadius: 2,
                        boxShadow: 1
                      }}
                    >
                      <EmojiEmotions 
                        color={averageEmotions.confidence > 70 ? "success" : "warning"} 
                        sx={{ fontSize: 40, mb: 1 }} 
                      />
                      <Typography 
                        variant="h4" 
                        color={averageEmotions.confidence > 70 ? "success.main" : "warning.main"}
                      >
                        {averageEmotions.confidence}%
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Average Confidence
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box 
                      sx={{ 
                        textAlign: 'center', 
                        p: 3,
                        background: 'white',
                        borderRadius: 2,
                        boxShadow: 1
                      }}
                    >
                      <RecordVoiceOver 
                        color={interviewData.audioAnalysis.clarity > 70 ? "success" : "warning"}
                        sx={{ fontSize: 40, mb: 1 }} 
                      />
                      <Typography 
                        variant="h4" 
                        color={interviewData.audioAnalysis.clarity > 70 ? "success.main" : "warning.main"}
                      >
                        {Math.round(interviewData.audioAnalysis.clarity)}%
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Speech Clarity
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 3, background: '#f8f9fa' }}>
        <Button
          variant="outlined"
          onClick={() => {
            // Save results logic here
            onClose();
          }}
          sx={{ 
            borderRadius: 2,
            px: 3,
            py: 1
          }}
        >
          Save Results
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={onClose}
          sx={{ 
            borderRadius: 2,
            px: 3,
            py: 1,
            background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
            '&:hover': {
              background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
            }
          }}
        >
          Return to Dashboard
        </Button>
      </DialogActions>
    </Dialog>
  );
});

// Update the VideoContainer component
const VideoContainer = memo(({ 
  videoRef, 
  isVideoOn, 
  isAudioOn, 
  onToggleVideo, 
  onToggleAudio, 
  onEndInterview,
  isRecording,
  isLoading 
}: { 
  videoRef: React.RefObject<HTMLVideoElement>;
  isVideoOn: boolean;
  isAudioOn: boolean;
  onToggleVideo: () => void;
  onToggleAudio: () => void;
  onEndInterview: () => void;
  isRecording: boolean;
  isLoading: boolean;
}) => {
  const [videoError, setVideoError] = useState<string | null>(null);
  const [isButtonLoading, setIsButtonLoading] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.onerror = (e) => {
        console.error('Video error:', e);
        setVideoError('Failed to load video. Please check your camera.');
      };
    }
  }, [videoRef]);

  const handleToggleVideo = async () => {
    if (isButtonLoading) return;
    setIsButtonLoading(true);
    try {
      await onToggleVideo();
    } catch (error) {
      console.error('Error toggling video:', error);
      setVideoError('Failed to toggle video. Please try again.');
    } finally {
      setIsButtonLoading(false);
    }
  };

  const handleToggleAudio = async () => {
    if (isButtonLoading) return;
    setIsButtonLoading(true);
    try {
      await onToggleAudio();
    } catch (error) {
      console.error('Error toggling audio:', error);
      setVideoError('Failed to toggle audio. Please try again.');
    } finally {
      setIsButtonLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box 
        sx={{ 
          position: 'relative', 
          mb: 2,
          width: '100%',
          height: '480px',
          backgroundColor: '#000',
          borderRadius: '8px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {videoError ? (
          <Typography color="error" align="center">
            {videoError}
          </Typography>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden',
            }}
          />
        )}
        <Box
          sx={{
            position: 'absolute',
            bottom: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 2,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            padding: '8px 16px',
            borderRadius: 20,
            zIndex: 1,
          }}
        >
          <Button
            variant="contained"
            color={isVideoOn ? 'primary' : 'error'}
            onClick={handleToggleVideo}
            startIcon={isVideoOn ? <Videocam /> : <VideocamOff />}
            disabled={isLoading || isButtonLoading}
          >
            {isButtonLoading ? 'Updating...' : (isVideoOn ? 'Video On' : 'Video Off')}
          </Button>
          <Button
            variant="contained"
            color={isAudioOn ? 'primary' : 'error'}
            onClick={handleToggleAudio}
            startIcon={isAudioOn ? <Mic /> : <MicOff />}
            disabled={isLoading || isButtonLoading}
          >
            {isButtonLoading ? 'Updating...' : (isAudioOn ? 'Audio On' : 'Audio Off')}
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={onEndInterview}
            disabled={isLoading || isButtonLoading}
          >
            End Interview
          </Button>
        </Box>
      </Box>
    </Paper>
  );
});

const Interview: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  const {
    interviewData,
    updateEmotions,
    updateAudioAnalysis,
    startInterview: startInterviewContext,
    endInterview: endInterviewContext,
  } = useInterview();

  const theme = useTheme();
  const [mounted, setMounted] = useState(false);
  const [hasPermissions, setHasPermissions] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingError, setRecordingError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sample questions (in a real app, these would come from the backend)
  const questions = [
    'Tell me about yourself and your background.',
    'What are your greatest strengths and weaknesses?',
    'Where do you see yourself in five years?',
    'Why are you interested in this position?',
  ];

  // Memoize the audio analysis function
  const analyzeAudio = useCallback(() => {
    if (!analyserRef.current) return;

    const dataArray = new Float32Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getFloatTimeDomainData(dataArray);

    // Calculate audio metrics
    const volume = Math.sqrt(dataArray.reduce((acc, val) => acc + val * val, 0) / dataArray.length);
    const clarity = calculateClarity(dataArray);
    const pace = calculatePace(dataArray);

    updateAudioAnalysis({
      confidence: Math.min(volume * 200, 100),
      clarity: clarity * 100,
      pace: pace * 100,
    });
  }, [updateAudioAnalysis]);

  // Memoize the emotion analysis function
  const analyzeEmotions = useCallback(async () => {
    const frame = captureFrame();
    if (frame) {
      try {
        const result = await emotionAnalysis.analyzeFrame(frame);
        updateEmotions(result.scores);
      } catch (error) {
        console.error('Error analyzing emotions:', error);
      }
    }
  }, [updateEmotions]);

  // Optimize the setupAudioAnalysis function
  const setupAudioAnalysis = useCallback((mediaStream: MediaStream) => {
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(mediaStream);
    source.connect(analyser);
    analyser.fftSize = 2048;

    audioContextRef.current = audioContext;
    analyserRef.current = analyser;

    const intervalId = setInterval(analyzeAudio, AUDIO_ANALYSIS_INTERVAL);
    return () => clearInterval(intervalId);
  }, [analyzeAudio]);

  // Optimize the startEmotionAnalysis function
  const startEmotionAnalysis = useCallback(() => {
    const intervalId = setInterval(analyzeEmotions, EMOTION_ANALYSIS_INTERVAL);
    return () => clearInterval(intervalId);
  }, [analyzeEmotions]);

  // Move startCamera and stopCamera before useEffect
  const startCamera = useCallback(async () => {
    if (isInitialized) return;
    
    try {
      setIsLoading(true);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        },
        audio: true,
      });

      // Check if video tracks are available
      const videoTracks = mediaStream.getVideoTracks();
      if (videoTracks.length === 0) {
        throw new Error('No video tracks available');
      }

      // Check if audio tracks are available
      const audioTracks = mediaStream.getAudioTracks();
      if (audioTracks.length === 0) {
        throw new Error('No audio tracks available');
      }

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        // Wait for video to be ready
        await new Promise((resolve) => {
          if (videoRef.current) {
            videoRef.current.onloadedmetadata = resolve;
          }
        });
      }

      // Start recording
      const mediaRecorder = new MediaRecorder(mediaStream);
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        console.log('Recording completed:', blob);
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      setIsInitialized(true);

      setupAudioAnalysis(mediaStream);
      startEmotionAnalysis();
    } catch (error) {
      console.error('Error accessing camera:', error);
      setPermissionError('Failed to access camera or microphone. Please check your permissions.');
      setIsInterviewStarted(false);
      setRecordingError('Failed to start recording. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [isInitialized, setupAudioAnalysis, startEmotionAnalysis]);

  const stopCamera = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      try {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
      } catch (error) {
        console.error('Error stopping recording:', error);
        setRecordingError('Failed to stop recording. Please try again.');
      }
    }

    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop();
        track.enabled = false;
      });
      setStream(null);
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (analyserRef.current) {
      analyserRef.current = null;
    }
    setIsInitialized(false);
  }, [stream, isRecording]);

  // Now the useEffect can use startCamera and stopCamera
  useEffect(() => {
    let cleanupAudio: (() => void) | undefined;
    let cleanupEmotions: (() => void) | undefined;

    if (isInterviewStarted && !isInitialized) {
      startCamera().then(() => {
        if (stream) {
          cleanupAudio = setupAudioAnalysis(stream);
          cleanupEmotions = startEmotionAnalysis();
        }
      });
    }

    return () => {
      cleanupAudio?.();
      cleanupEmotions?.();
      if (!isInterviewStarted) {
        stopCamera();
      }
    };
  }, [isInterviewStarted, isInitialized, stream, setupAudioAnalysis, startEmotionAnalysis, startCamera, stopCamera]);

  // Memoize the handleCloseResults function
  const handleCloseResults = useCallback(() => {
    setShowResults(false);
    setIsInterviewStarted(false);
    stopCamera();
    endInterviewContext();
    navigate('/');
  }, [endInterviewContext, navigate]);

  // Memoize the endInterview function
  const endInterview = useCallback(() => {
    setShowResults(true);
  }, []);

  // Update the checkPermissions function
  const checkPermissions = async () => {
    try {
      // First try to get permissions
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      stream.getTracks().forEach(track => track.stop());
      setHasPermissions(true);
      setPermissionError(null);
      return true;
    } catch (error) {
      console.error('Permission error:', error);
      setPermissionError('Please allow camera and microphone access to start the interview.');
      setHasPermissions(false);
      return false;
    }
  };

  // Add useEffect to check permissions on mount
  useEffect(() => {
    checkPermissions();
  }, []);

  const calculateClarity = (dataArray: Float32Array) => {
    // Simple clarity calculation based on signal consistency
    let clarity = 0;
    for (let i = 1; i < dataArray.length; i++) {
      clarity += Math.abs(dataArray[i] - dataArray[i - 1]);
    }
    return 1 - Math.min(clarity / dataArray.length, 1);
  };

  const calculatePace = (dataArray: Float32Array) => {
    // Simple pace calculation based on zero crossings
    let zeroCrossings = 0;
    for (let i = 1; i < dataArray.length; i++) {
      if ((dataArray[i] > 0 && dataArray[i - 1] <= 0) || 
          (dataArray[i] < 0 && dataArray[i - 1] >= 0)) {
        zeroCrossings++;
      }
    }
    return Math.min(zeroCrossings / (dataArray.length / 2), 1);
  };

  const captureFrame = (): string | null => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL('image/jpeg', 0.8);
      }
    }
    return null;
  };

  const toggleVideo = useCallback(async () => {
    if (stream) {
      try {
        const videoTracks = stream.getVideoTracks();
        if (videoTracks.length > 0) {
          const newState = !isVideoOn;
          videoTracks.forEach(track => {
            track.enabled = newState;
          });
          setIsVideoOn(newState);
        }
      } catch (error) {
        console.error('Error toggling video:', error);
        throw error;
      }
    }
  }, [stream, isVideoOn]);

  const toggleAudio = useCallback(async () => {
    if (stream) {
      try {
        const audioTracks = stream.getAudioTracks();
        if (audioTracks.length > 0) {
          const newState = !isAudioOn;
          audioTracks.forEach(track => {
            track.enabled = newState;
          });
          setIsAudioOn(newState);
        }
      } catch (error) {
        console.error('Error toggling audio:', error);
        throw error;
      }
    }
  }, [stream, isAudioOn]);

  // Update the startInterview function
  const startInterview = async () => {
    try {
      setIsLoading(true);
      const hasAccess = await checkPermissions();
      if (hasAccess) {
        setIsInterviewStarted(true);
        setCurrentQuestion(questions[0]);
        startInterviewContext();
        await startCamera();
      }
    } catch (error) {
      console.error('Error starting interview:', error);
      setPermissionError('Failed to start interview. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            Interview Session
          </Typography>
          {isInterviewStarted && (
            <Typography variant="subtitle1" color="textSecondary">
              Duration: {Math.floor(interviewData.interviewDuration / 60)}:
              {(interviewData.interviewDuration % 60).toString().padStart(2, '0')}
            </Typography>
          )}
        </Grid>

        {!isInterviewStarted ? (
          <Grid item xs={12}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Ready to start your interview?
              </Typography>
              <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
                Make sure you have a working camera and microphone.
              </Typography>
              {permissionError && (
                <Typography color="error" sx={{ mb: 2 }}>
                  {permissionError}
                </Typography>
              )}
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={startInterview}
                disabled={!hasPermissions}
                sx={{ minWidth: 200 }}
              >
                {hasPermissions ? 'Start Interview' : 'Checking Permissions...'}
              </Button>
            </Paper>
          </Grid>
        ) : (
          <>
            <Grid item xs={12} md={8}>
              <VideoContainer
                videoRef={videoRef}
                isVideoOn={isVideoOn}
                isAudioOn={isAudioOn}
                onToggleVideo={toggleVideo}
                onToggleAudio={toggleAudio}
                onEndInterview={endInterview}
                isRecording={isRecording}
                isLoading={isLoading}
              />

              <Card sx={{ mb: 2, mt: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Current Question:
                  </Typography>
                  <Typography variant="body1">{currentQuestion}</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Real-time Analysis
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Emotion Analysis
                  </Typography>
                  <EmotionMeter label="Confidence" value={interviewData.currentEmotions.confidence} />
                  <EmotionMeter label="Nervousness" value={interviewData.currentEmotions.nervousness} />
                  <EmotionMeter label="Anxiety" value={interviewData.currentEmotions.anxiety} />
                  <EmotionMeter label="Happiness" value={interviewData.currentEmotions.happiness} />
                  <EmotionMeter label="Neutral" value={interviewData.currentEmotions.neutral} />

                  <Typography variant="subtitle2" gutterBottom sx={{ mt: 3 }}>
                    Voice Analysis
                  </Typography>
                  <EmotionMeter label="Voice Confidence" value={interviewData.audioAnalysis.confidence} />
                  <EmotionMeter label="Clarity" value={interviewData.audioAnalysis.clarity} />
                  <EmotionMeter label="Speaking Pace" value={interviewData.audioAnalysis.pace} />
                </Box>
                <Box sx={{ mt: 3 }}>
                  <Typography variant="body2" color="textSecondary">
                    Overall Performance Score
                  </Typography>
                  <Typography variant="h4" color="primary">
                    {interviewData.overallScore}%
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </>
        )}
      </Grid>
      <ResultsSummary 
        showResults={showResults}
        onClose={handleCloseResults}
        interviewData={interviewData}
        theme={theme}
      />
      <canvas
        ref={canvasRef}
        style={{ display: 'none' }}
      />
    </Container>
  );
};

export default memo(Interview); 
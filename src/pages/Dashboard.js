import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CardActionArea,
  Box,
  CircularProgress,
} from '@mui/material';
import {
  Instagram,
  YouTube,
  Facebook,
  Telegram,
} from '@mui/icons-material';
import { SvgIcon } from '@mui/material';
import { fetchServices } from '../store/slices/serviceSlice';

// Custom TikTok icon
const TikTokIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M16.6 5.82s.51.5 0 0A4.278 4.278 0 015.4 5.82C4.1 4.5 3.5 2.6 3.5 1h3.4a5.9 5.9 0 004.6 2.8v5.7h-1.7c-.4 0-.7.3-.7.7v1.7c0 .3.3.6.7.6h1.7v3.9c0 2.5 1.8 4.6 4.3 4.9v1.7h-2.4c-.4 0-.7.3-.7.7v1.7c0 .3.3.6.7.6h2.4v2.1h-6.4"/>
  </SvgIcon>
);

const platforms = [
  { name: 'Instagram', icon: Instagram, color: '#E1306C' },
  { name: 'YouTube', icon: YouTube, color: '#FF0000' },
  { name: 'Facebook', icon: Facebook, color: '#4267B2' },
  { name: 'Telegram', icon: Telegram, color: '#0088cc' },
  { name: 'TikTok', icon: TikTokIcon, color: '#000000' },
];

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { services, isLoading } = useSelector((state) => state.services);

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  const handlePlatformClick = (platform) => {
    navigate('/services', { state: { platform: platform.toLowerCase() } });
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome to SMM Services
      </Typography>
      <Typography variant="subtitle1" gutterBottom color="textSecondary">
        Select a platform to view available services
      </Typography>
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {platforms.map((platform) => (
          <Grid item xs={12} sm={6} md={4} key={platform.name}>
            <Card>
              <CardActionArea onClick={() => handlePlatformClick(platform.name)}>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <platform.icon
                    sx={{ fontSize: 60, color: platform.color, mb: 2 }}
                  />
                  <Typography variant="h6" component="div">
                    {platform.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {services.filter(
                      (s) => s.platform.toLowerCase() === platform.name.toLowerCase()
                    ).length} Services Available
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Dashboard; 
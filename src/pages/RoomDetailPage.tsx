import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Calendar from '../components/Calendar';
import { useBooking } from '../context/BookingContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Typography, 
  Button, 
  Box, 
  Container, 
  Card, 
  CardContent,
  IconButton,
  Paper,
  Grid,
  useTheme
} from '@mui/material';
import { RefreshCw, ArrowLeft } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const RoomDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getRoom, refreshData, isLoading } = useBooking();
  const [refreshing, setRefreshing] = useState(false);
  const theme = useTheme();
  
  const room = getRoom(id || '');
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setTimeout(() => setRefreshing(false), 500);
  };
  
  if (!room) {
    return (
      <>
        <Helmet>
          <title>Sala não encontrada - Desenvolver Coworking</title>
        </Helmet>
        <Layout>
          <Container maxWidth="md" sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Sala não encontrada
            </Typography>
            <Button 
              onClick={() => navigate('/rooms')}
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
            >
              Voltar para salas
            </Button>
          </Container>
        </Layout>
      </>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>{`${room.name} - Desenvolver Coworking`}</title>
      </Helmet>
      <Layout>
        <Container maxWidth="lg">
          {/* Room Header */}
          <Box sx={{ mb: 4 }}>
            <Button
              startIcon={<ArrowLeft />}
              onClick={() => navigate(-1)}
              sx={{ mb: 2 }}
            >
              Voltar
            </Button>
            
            <Card sx={{ overflow: 'hidden' }} elevation={2}>
              <Grid container spacing={0}>
                {/* Image Column - Fixed width and height */}
                <Grid item xs={12} md={5} lg={4}>
                  <Box sx={{ 
                    width: '100%',
                    height: { xs: 300, md: 400 }, // Fixed height
                    position: 'relative'
                  }}>
                    <Box
                      component="img"
                      src={room.imageUrl}
                      alt={room.name}
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center'
                      }}
                    />
                  </Box>
                </Grid>
                
                {/* Content Column */}
                <Grid item xs={12} md={7} lg={8}>
                  <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Typography 
                      variant="h4" 
                      component="h1" 
                      sx={{ 
                        fontWeight: 'bold',
                        mb: 3
                      }}
                    >
                      {room.name}
                    </Typography>
                    
                    <Typography 
                      variant="body1" 
                      color="text.secondary"
                      sx={{ 
                        lineHeight: 1.7,
                        flex: 1
                      }}
                    >
                      {room.description}
                    </Typography>
                  </CardContent>
                </Grid>
              </Grid>
            </Card>
          </Box>
          
          {/* Calendar Section */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              mb: 3 
            }}>
              <Typography variant="h5" component="h2" fontWeight="bold">
                Disponibilidade
              </Typography>
              <IconButton 
                onClick={handleRefresh}
                disabled={refreshing || isLoading}
                sx={{ 
                  color: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.primary.main,
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.08)',
                  }
                }}
              >
                {refreshing || isLoading ? (
                  <LoadingSpinner size="small" />
                ) : (
                  <RefreshCw size={20} />
                )}
              </IconButton>
            </Box>
            
            {isLoading ? (
              <Card sx={{ 
                p: 6, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <LoadingSpinner size="large" />
                <Typography sx={{ mt: 2, color: 'text.secondary' }}>
                  Carregando disponibilidade...
                </Typography>
              </Card>
            ) : (
              <Paper elevation={2}>
                <Calendar room={room} />
              </Paper>
            )}
          </Box>
        </Container>
      </Layout>
    </>
  );
};

export default RoomDetailPage;
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useBooking } from '../context/BookingContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import { 
  Typography, 
  Button, 
  Box, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  CardActionArea,
  IconButton,
  useTheme
} from '@mui/material';
import { Calendar, RefreshCw } from 'lucide-react';

const carouselImages = [
  '/carousel-01.jpg',
  '/carousel-02.jpg',
  '/carousel-03.jpg',
  '/carousel-04.jpg',
  '/carousel-05.jpg',
  '/carousel-06.jpg',
  '/carousel-07.jpg'
];

const HomePage: React.FC = () => {
  const { rooms, refreshData, isLoading } = useBooking();
  const [refreshing, setRefreshing] = useState(false);
  const theme = useTheme();
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setTimeout(() => setRefreshing(false), 500);
  };
  
  return (
    <Layout>
      <Container maxWidth="lg">
        {/* Hero Section with Carousel */}
        <Box 
          sx={{ 
            position: 'relative',
            height: { xs: '400px', md: '600px' },
            mb: 6,
            borderRadius: 3,
            overflow: 'hidden',
          }}
        >
          <Swiper
            modules={[Autoplay, EffectFade, Navigation]}
            effect="fade"
            navigation
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            loop
            style={{ height: '100%' }}
          >
            {carouselImages.map((image, index) => (
              <SwiperSlide key={index}>
                <Box
                  sx={{
                    height: '100%',
                    width: '100%',
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.6))',
                      zIndex: 1
                    }
                  }}
                >
                  <Box
                    component="img"
                    src={image}
                    alt={`Desenvolver Coworking ${index + 1}`}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      p: { xs: 4, md: 6 },
                      color: 'white',
                      zIndex: 2,
                      textAlign: 'left',
                    }}
                  >
                    <Typography 
                      variant="h3" 
                      component="h1" 
                      sx={{ 
                        mb: 2,
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: { xs: '2rem', md: '3rem' },
                        fontWeight: 'bold'
                      }}
                    >
                      Espaços de trabalho que inspiram
                    </Typography>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        mb: 3,
                        textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                        maxWidth: '600px',
                        fontSize: { xs: '1rem', md: '1.25rem' }
                      }}
                    >
                      Bem-vindo ao Desenvolver Coworking, onde ideias ganham vida e conexões são formadas.
                    </Typography>
                  </Box>
                </Box>
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>
        
        {/* Rooms Preview Section */}
        <Box sx={{ mb: 8 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" component="h2" fontWeight="bold">
              Nossas salas
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton 
                onClick={handleRefresh}
                disabled={refreshing || isLoading}
                sx={{ 
                  mr: 1,
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
              <Button 
                component={Link} 
                to="/rooms" 
                sx={{ 
                  color: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.primary.main,
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.08)',
                  }
                }}
              >
                Ver todas
              </Button>
            </Box>
          </Box>
          
          {isLoading ? (
            <Card sx={{ p: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <LoadingSpinner size="large" />
              <Typography sx={{ mt: 2, color: 'text.secondary' }}>
                Carregando salas...
              </Typography>
            </Card>
          ) : (
            <Grid container spacing={3}>
              {rooms.slice(0, 4).map(room => (
                <Grid item key={room.id} xs={12} sm={6} md={3}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }} elevation={2}>
                    <CardActionArea component={Link} to={`/rooms/${room.id}`}>
                      <CardMedia
                        component="img"
                        height="140"
                        image={room.imageUrl}
                        alt={room.name}
                      />
                      <CardContent>
                        <Typography variant="h6" component="h3" gutterBottom>
                          {room.name}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}
                        >
                          {room.description}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Container>
    </Layout>
  );
};

export default HomePage;
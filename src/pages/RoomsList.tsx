import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Typography, 
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
import { RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

const RoomsList: React.FC = () => {
  const { rooms, refreshData, isLoading } = useBooking();
  const [refreshing, setRefreshing] = useState(false);
  const theme = useTheme();

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setTimeout(() => setRefreshing(false), 500);
  };

  return (
    <>
      <Box 
        sx={{ 
          width: '100%', 
          bgcolor: 'primary.main',
          py: 2,
          px: 3,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Box
          component="img"
          src="/desenvolver-coworking-logo.svg"
          alt="Desenvolver Coworking"
          sx={{ 
            height: '40px',
            filter: 'brightness(0) invert(1)',
          }}
        />
      </Box>
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
              Nossas Salas
            </Typography>
            <IconButton 
              onClick={handleRefresh}
              disabled={refreshing || isLoading}
              sx={{ color: theme.palette.primary.main }}
            >
              {refreshing || isLoading ? (
                <LoadingSpinner size="small" />
              ) : (
                <RefreshCw size={20} />
              )}
            </IconButton>
          </Box>
          <Typography variant="subtitle1" color="text.secondary">
            Conheça nossos espaços e consulte a disponibilidade
          </Typography>
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
            {rooms.map(room => (
              <Grid item key={room.id} xs={12} sm={6} md={4}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardActionArea component={Link} to={`/room/${room.id}`} sx={{ flexGrow: 1 }}>
                    <Box sx={{ position: 'relative', paddingTop: '56.25%' /* 16:9 aspect ratio */ }}>
                      <CardMedia
                        component="img"
                        image={room.imageUrl}
                        alt={room.name}
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    </Box>
                    <CardContent>
                      <Typography variant="h6" component="h2" gutterBottom>
                        {room.name}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          mb: 2
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
      </Container>
    </>
  );
};

export default RoomsList;
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
  Grid, 
  Card, 
  CardMedia, 
  CardContent,
  IconButton,
  Paper,
  useTheme
} from '@mui/material';
import { Users, MapPin, RefreshCw } from 'lucide-react';

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
    );
  }
  
  return (
    <Layout>
      <Container maxWidth="lg">
        <Card sx={{ mb: 4, overflow: 'hidden' }} elevation={2}>
          <Grid container>
            <Grid item xs={12} md={6}>
              <CardMedia
                component="img"
                sx={{ height: { xs: 240, md: '100%' }, objectFit: 'cover' }}
                image={room.imageUrl}
                alt={room.name}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                  {room.name}
                </Typography>
                
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <MapPin size={20} style={{ marginRight: 8, marginTop: 4 }} />
                  <Box>
                    <Typography variant="subtitle1" fontWeight="medium">
                      Localização
                    </Typography>
                    <Typography color="text.secondary">
                      Desenvolver Coworking, 2º andar
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                    Descrição
                  </Typography>
                  <Typography color="text.secondary">
                    {room.description}
                  </Typography>
                </Box>
              </CardContent>
            </Grid>
          </Grid>
        </Card>
        
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" component="h2" fontWeight="bold">
              Disponibilidade
            </Typography>
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
          </Box>
          
          {isLoading ? (
            <Card sx={{ p: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <LoadingSpinner size="large" />
              <Typography sx={{ mt: 2, color: 'text.secondary' }}>
                Carregando disponibilidade...
              </Typography>
            </Card>
          ) : (
            <Calendar room={room} />
          )}
        </Box>
      </Container>
    </Layout>
  );
};

export default RoomDetailPage;
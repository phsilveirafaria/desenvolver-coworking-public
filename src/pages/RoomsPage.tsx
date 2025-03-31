import React, { useState } from 'react';
import Layout from '../components/Layout';
import RoomCard from '../components/RoomCard';
import { useBooking } from '../context/BookingContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Typography, 
  Button, 
  Box, 
  Container, 
  Grid, 
  IconButton,
  Card,
  useTheme
} from '@mui/material';
import { RefreshCw } from 'lucide-react';

const RoomsPage: React.FC = () => {
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
              Nossas Salas
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Consulte a disponibilidade dos espaços para suas reuniões e atividades
            </Typography>
          </Box>
          
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
              Carregando salas...
            </Typography>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {rooms.map(room => (
              <Grid item key={room.id} xs={12} sm={6} md={4}>
                <RoomCard room={room} isAdmin={true} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Layout>
  );
};

export default RoomsPage;
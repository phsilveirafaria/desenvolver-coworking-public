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
  IconButton,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { RefreshCw, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfWeek, addDays, isSameDay, parseISO, isWithinInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const PublicCalendarPage: React.FC = () => {
  const { rooms, refreshData, isLoading, getBookingsByRoom } = useBooking();
  const [refreshing, setRefreshing] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const theme = useTheme();

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setTimeout(() => setRefreshing(false), 500);
  };

  // Generate the days of the week
  const startDate = startOfWeek(currentDate, { weekStartsOn: 0 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));
  
  // Generate time slots from 8:00 to 22:00
  const timeSlots = Array.from({ length: 15 }, (_, i) => {
    const hour = i + 8;
    return `${hour}:00`;
  });

  const handlePreviousWeek = () => {
    setCurrentDate(prev => addDays(prev, -7));
  };
  
  const handleNextWeek = () => {
    setCurrentDate(prev => addDays(prev, 7));
  };

  const isBookingInTimeSlot = (booking: any, day: Date, timeSlot: string) => {
    try {
      const [hour] = timeSlot.split(':').map(Number);
      
      const slotStart = new Date(day);
      slotStart.setHours(hour, 0, 0, 0);
      
      const slotEnd = new Date(day);
      slotEnd.setHours(hour + 1, 0, 0, 0);
      
      const bookingStart = parseISO(booking.startTime);
      const bookingEnd = parseISO(booking.endTime);
      
      return isWithinInterval(slotStart, { start: bookingStart, end: bookingEnd }) ||
             isWithinInterval(bookingEnd, { start: slotStart, end: slotEnd }) ||
             (bookingStart <= slotStart && bookingEnd >= slotEnd);
    } catch (error) {
      console.error('Error checking booking time slot:', error);
      return false;
    }
  };

  const getBookingsForSlot = (roomId: string, day: Date, timeSlot: string) => {
    return getBookingsByRoom(roomId).filter(booking => {
      try {
        // Only consider bookings with status 'criado' or 'concluido'
        if (booking.status !== 'criado' && booking.status !== 'concluido') {
          return false;
        }
        const bookingDate = parseISO(booking.startTime);
        return isSameDay(bookingDate, day) && isBookingInTimeSlot(booking, day, timeSlot);
      } catch (error) {
        console.error('Error getting bookings for slot:', error);
        return false;
      }
    });
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
              Calendário de Reservas
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
        </Box>

        {isLoading ? (
          <Card sx={{ p: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <LoadingSpinner size="large" />
            <Typography sx={{ mt: 2, color: 'text.secondary' }}>
              Carregando salas...
            </Typography>
          </Card>
        ) : (
          <Grid container spacing={4}>
            {rooms.map(room => (
              <Grid item xs={12} key={room.id}>
                <Card sx={{ mb: 4 }}>
                  <CardContent>
                    <Typography variant="h5" component="h2" gutterBottom>
                      {room.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {room.description}
                    </Typography>

                    <Paper elevation={2} sx={{ overflow: 'hidden', mt: 3 }}>
                      <Box sx={{ 
                        p: 2, 
                        bgcolor: 'primary.main', 
                        color: 'primary.contrastText',
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center' 
                      }}>
                        <IconButton 
                          onClick={handlePreviousWeek}
                          sx={{ color: 'white' }}
                        >
                          <ChevronLeft size={24} />
                        </IconButton>
                        
                        <Typography variant="h6" component="h3">
                          {format(weekDays[0], "dd 'de' MMMM 'de' yyyy", { locale: ptBR })} - {format(weekDays[6], "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                        </Typography>
                        
                        <IconButton 
                          onClick={handleNextWeek}
                          sx={{ color: 'white' }}
                        >
                          <ChevronRight size={24} />
                        </IconButton>
                      </Box>
                      
                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell sx={{ width: 100, bgcolor: 'action.hover' }}></TableCell>
                              {weekDays.map(day => (
                                <TableCell key={day.toString()} align="center">
                                  <Typography variant="subtitle2" sx={{ fontWeight: 'medium' }}>
                                    {format(day, 'EEEE', { locale: ptBR })}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {format(day, 'dd/MM/yyyy')}
                                  </Typography>
                                </TableCell>
                              ))}
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {timeSlots.map(timeSlot => (
                              <TableRow key={timeSlot} hover>
                                <TableCell sx={{ bgcolor: 'action.hover', textAlign: 'center' }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Clock size={16} style={{ marginRight: 4 }} />
                                    <Typography variant="body2">{timeSlot}</Typography>
                                  </Box>
                                </TableCell>
                                {weekDays.map(day => {
                                  const slotBookings = getBookingsForSlot(room.id, day, timeSlot);
                                  const isReserved = slotBookings.length > 0;
                                  
                                  return (
                                    <TableCell 
                                      key={`${day}-${timeSlot}`} 
                                      align="center"
                                      sx={{ 
                                        height: 60,
                                        border: 1,
                                        borderColor: 'divider',
                                        bgcolor: isReserved ? 'primary.main' : 'transparent'
                                      }}
                                    >
                                      <Typography 
                                        variant="caption" 
                                        sx={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          height: '100%',
                                          color: isReserved ? 'primary.contrastText' : 'text.secondary'
                                        }}
                                      >
                                        {isReserved ? 'Reservado' : 'Disponível'}
                                      </Typography>
                                    </TableCell>
                                  );
                                })}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Paper>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </>
  );
};

export default PublicCalendarPage;
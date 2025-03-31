import React, { useState } from 'react';
import { format, startOfWeek, addDays, isSameDay, parseISO, isWithinInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Room, Booking } from '../types';
import { useBooking } from '../context/BookingContext';
import { 
  Typography, 
  Box, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Chip,
  Button,
  IconButton,
  Tooltip,
  useTheme
} from '@mui/material';
import { Clock, ChevronLeft, ChevronRight, Mail, Phone } from 'lucide-react';

interface CalendarProps {
  room: Room;
}

// Generate a unique color for each email
const getColorForEmail = (email: string) => {
  const colors = [
    '#0f3c8c', // Primary blue (matching theme)
    '#2563eb', // Royal blue
    '#0891b2', // Cyan
    '#0d9488', // Teal
    '#059669', // Emerald
    '#4f46e5', // Indigo
    '#7c3aed', // Violet
    '#9333ea', // Purple
    '#c026d3', // Fuchsia
    '#db2777'  // Pink
  ];
  
  // Generate a consistent index based on the email
  const index = Array.from(email).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[index % colors.length];
};

const Calendar: React.FC<CalendarProps> = ({ room }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { getBookingsByRoom } = useBooking();
  const theme = useTheme();
  
  const bookings = getBookingsByRoom(room.id);
  
  // Generate the days of the week
  const startDate = startOfWeek(currentDate, { weekStartsOn: 0 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));
  
  // Generate time slots from 8:00 to 22:00
  const timeSlots = Array.from({ length: 15 }, (_, i) => {
    const hour = i + 8;
    return `${hour}:00`;
  });
  
  const isBookingInTimeSlot = (booking: Booking, day: Date, timeSlot: string) => {
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
  
  const getBookingsForSlot = (day: Date, timeSlot: string) => {
    return bookings.filter(booking => {
      try {
        const bookingDate = parseISO(booking.startTime);
        return isSameDay(bookingDate, day) && isBookingInTimeSlot(booking, day, timeSlot);
      } catch (error) {
        console.error('Error getting bookings for slot:', error);
        return false;
      }
    });
  };
  
  const handlePreviousWeek = () => {
    setCurrentDate(prev => addDays(prev, -7));
  };
  
  const handleNextWeek = () => {
    setCurrentDate(prev => addDays(prev, 7));
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'criado':
        return '⏳ Pendente';
      case 'concluido':
        return '✓ Concluído';
      case 'cancelado':
        return '✗ Cancelado';
      default:
        return status;
    }
  };
  
  return (
    <Paper elevation={2} sx={{ overflow: 'hidden' }}>
      <Box sx={{ 
        p: 2, 
        bgcolor: 'primary.main', 
        color: 'primary.contrastText',
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <Button 
          onClick={handlePreviousWeek}
          startIcon={<ChevronLeft size={16} />}
          sx={{ 
            color: '#ffffff',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.08)'
            }
          }}
        >
          Anterior
        </Button>
        
        <Typography variant="h6" component="h3" sx={{ fontWeight: 'medium' }}>
          {format(weekDays[0], "dd 'de' MMMM 'de' yyyy", { locale: ptBR })} - {format(weekDays[6], "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
        </Typography>
        
        <Button 
          onClick={handleNextWeek}
          endIcon={<ChevronRight size={16} />}
          sx={{ 
            color: '#ffffff',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.08)'
            }
          }}
        >
          Próxima
        </Button>
      </Box>
      
      <TableContainer sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: 100, bgcolor: 'action.hover' }}></TableCell>
              {weekDays.map(day => (
                <TableCell key={day.toString()} align="center" sx={{ minWidth: 120 }}>
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
                  const slotBookings = getBookingsForSlot(day, timeSlot);
                  const hasBooking = slotBookings.length > 0;
                  const booking = slotBookings[0]; // Just show the first booking if multiple
                  
                  return (
                    <TableCell 
                      key={`${day}-${timeSlot}`} 
                      sx={{ 
                        height: 80, 
                        p: 1,
                        border: 1,
                        borderColor: 'divider'
                      }}
                    >
                      {hasBooking ? (
                        <Tooltip 
                          title={
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                Detalhes da Reserva
                              </Typography>
                              <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                                <Mail size={14} style={{ marginRight: 4 }} />
                                {booking.userEmail}
                              </Box>
                              {booking.userPhone && (
                                <Box sx={{ mt: 0.5, display: 'flex', alignItems: 'center' }}>
                                  <Phone size={14} style={{ marginRight: 4 }} />
                                  {booking.userPhone}
                                </Box>
                              )}
                            </Box>
                          }
                        >
                          <Box 
                            sx={{ 
                              height: '100%', 
                              p: 1, 
                              borderRadius: 1,
                              bgcolor: getColorForEmail(booking.userEmail),
                              color: '#fff'
                            }}
                          >
                            <Typography variant="subtitle2" noWrap>
                              {booking.userEmail}
                            </Typography>
                            <Typography variant="caption" display="block">
                              {format(parseISO(booking.startTime), 'HH:mm')} - {format(parseISO(booking.endTime), 'HH:mm')}
                            </Typography>
                            <Box sx={{ mt: 0.5 }}>
                              <Chip
                                label={getStatusText(booking.status)}
                                size="small"
                                sx={{ 
                                  fontSize: '0.7rem',
                                  height: 20,
                                  bgcolor: 'rgba(255, 255, 255, 0.3)'
                                }}
                              />
                            </Box>
                          </Box>
                        </Tooltip>
                      ) : (
                        <Box sx={{ 
                          height: '100%', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center' 
                        }}>
                          <Typography variant="caption" color="text.secondary">
                            Disponível
                          </Typography>
                        </Box>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default Calendar;
import React, { useState, useMemo, useCallback } from 'react';
import { format, startOfWeek, addDays, isSameDay, parseISO, endOfWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Room, Booking } from '../types';
import { useBooking } from '../context/BookingContext';
import { 
  Typography, 
  Box, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  useTheme,
  Popover,
  List,
  ListItem,
  ListItemText,
  Badge
} from '@mui/material';
import { Clock, ChevronLeft, ChevronRight, Mail, Phone, Plus } from 'lucide-react';

interface CalendarProps {
  room: Room;
}

// Reduced set of colors for better consistency
const bookingColors = [
  '#7A68B3', // Purple
  '#9C6ADE', // Light Purple
  '#E4567F', // Pink
  '#C13584', // Deep Pink
  '#059669'  // Green
];

const getColorForEmail = (email: string) => {
  const index = Array.from(email).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return bookingColors[index % bookingColors.length];
};

const timeSlots = Array.from({ length: 15 }, (_, i) => `${i + 8}:00`);

const Calendar: React.FC<CalendarProps> = ({ room }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [selectedBookings, setSelectedBookings] = useState<Booking[]>([]);
  const { getBookingsByRoom } = useBooking();
  const theme = useTheme();
  
  const bookings = useMemo(() => getBookingsByRoom(room.id), [room.id, getBookingsByRoom]);
  
  const weekDays = useMemo(() => {
    const startDate = startOfWeek(currentDate, { weekStartsOn: 0 });
    return Array.from({ length: 7 }, (_, i) => addDays(startDate, i));
  }, [currentDate]);

  const weekRange = useMemo(() => {
    const start = startOfWeek(currentDate, { weekStartsOn: 0 });
    const end = endOfWeek(currentDate, { weekStartsOn: 0 });
    return {
      start: format(start, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }),
      end: format(end, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
    };
  }, [currentDate]);
  
  const getBookingsForSlot = useCallback((day: Date, timeSlot: string) => {
    return bookings.filter(booking => {
      try {
        const [slotHour] = timeSlot.split(':').map(Number);
        const bookingDate = parseISO(booking.startTime);
        const bookingHour = bookingDate.getHours();
        
        return isSameDay(bookingDate, day) && bookingHour === slotHour;
      } catch (error) {
        console.error('Error getting bookings for slot:', error);
        return false;
      }
    }).sort((a, b) => {
      if (a.status === 'criado' && b.status !== 'criado') return -1;
      if (b.status === 'criado' && a.status !== 'criado') return 1;
      return 0;
    });
  }, [bookings]);

  const handlePreviousWeek = () => setCurrentDate(prev => addDays(prev, -7));
  const handleNextWeek = () => setCurrentDate(prev => addDays(prev, 7));

  const handleShowMore = (event: React.MouseEvent<HTMLButtonElement>, bookings: Booking[]) => {
    setAnchorEl(event.currentTarget);
    setSelectedBookings(bookings);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
    setSelectedBookings([]);
  };

  const getStatusText = useCallback((status: string) => {
    const statusMap = {
      'criado': '⏳ Pendente',
      'concluido': '✓ Concluído',
      'cancelado': '✗ Cancelado'
    };
    return statusMap[status as keyof typeof statusMap] || status;
  }, []);

  const formatDateTime = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  };

  const BookingDetails = ({ booking }: { booking: Booking }) => (
    <Box>
      <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#FFFFFF' }}>
        Detalhes da Reserva
      </Typography>
      <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', color: '#FFFFFF' }}>
        <Mail size={14} style={{ marginRight: 4 }} />
        {booking.userEmail}
      </Box>
      {booking.userPhone && (
        <Box sx={{ mt: 0.5, display: 'flex', alignItems: 'center', color: '#FFFFFF' }}>
          <Phone size={14} style={{ marginRight: 4 }} />
          {booking.userPhone}
        </Box>
      )}
      <Box sx={{ mt: 1, color: '#FFFFFF' }}>
        <Typography variant="caption" display="block" sx={{ color: '#FFFFFF' }}>
          Início: {formatDateTime(booking.startTime)}
        </Typography>
        <Typography variant="caption" display="block" sx={{ color: '#FFFFFF' }}>
          Fim: {formatDateTime(booking.endTime)}
        </Typography>
      </Box>
      <Box sx={{ mt: 1 }}>
        <Chip
          label={getStatusText(booking.status)}
          size="small"
          sx={{ 
            fontSize: '0.7rem',
            height: 20,
            bgcolor: 'rgba(255, 255, 255, 0.3)',
            color: '#FFFFFF'
          }}
        />
      </Box>
    </Box>
  );

  return (
    <TableContainer>
      <Box sx={{ 
        p: 2, 
        bgcolor: 'primary.main', 
        color: '#FFFFFF',
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1
      }}>
        <Box sx={{ 
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <IconButton onClick={handlePreviousWeek} sx={{ color: '#FFFFFF' }}>
            <ChevronLeft />
          </IconButton>
          
          <Typography variant="h6" component="h3" sx={{ color: '#FFFFFF' }}>
            {weekRange.start} - {weekRange.end}
          </Typography>
          
          <IconButton onClick={handleNextWeek} sx={{ color: '#FFFFFF' }}>
            <ChevronRight />
          </IconButton>
        </Box>
      </Box>
      
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: 100, bgcolor: 'action.hover' }} />
            {weekDays.map(day => (
              <TableCell key={day.toString()} align="center">
                <Typography variant="subtitle2" sx={{ fontWeight: 'medium' }}>
                  {format(day, 'EEEE', { locale: ptBR })}
                </Typography>
                <Typography variant="caption" sx={{ color: theme.palette.mode === 'light' ? '#595667' : '#D8D5E2' }}>
                  {format(day, 'dd/MM')}
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
                const primaryBooking = slotBookings[0];
                const additionalBookings = slotBookings.slice(1);
                
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
                    {hasBooking && primaryBooking ? (
                      <Box sx={{ position: 'relative' }}>
                        <Tooltip title={<BookingDetails booking={primaryBooking} />}>
                          <Box 
                            sx={{ 
                              height: '100%', 
                              p: 1, 
                              borderRadius: 1,
                              bgcolor: getColorForEmail(primaryBooking.userEmail),
                              color: '#FFFFFF'
                            }}
                          >
                            <Typography variant="subtitle2" noWrap sx={{ color: '#FFFFFF' }}>
                              {primaryBooking.userEmail}
                            </Typography>
                            <Box sx={{ mt: 0.5 }}>
                              <Chip
                                label={getStatusText(primaryBooking.status)}
                                size="small"
                                sx={{ 
                                  fontSize: '0.7rem',
                                  height: 20,
                                  bgcolor: 'rgba(255, 255, 255, 0.3)',
                                  color: '#FFFFFF'
                                }}
                              />
                            </Box>
                          </Box>
                        </Tooltip>
                        
                        {additionalBookings.length > 0 && (
                          <IconButton
                            size="small"
                            onClick={(e) => handleShowMore(e, slotBookings)}
                            sx={{
                              position: 'absolute',
                              top: -8,
                              right: -8,
                              bgcolor: '#E4567F',
                              color: '#FFFFFF',
                              '&:hover': {
                                bgcolor: '#C0355E',
                              },
                              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
                            }}
                          >
                            <Badge 
                              badgeContent={additionalBookings.length} 
                              sx={{
                                '& .MuiBadge-badge': {
                                  bgcolor: '#7A68B3',
                                  color: '#FFFFFF',
                                  fontWeight: 'bold',
                                  fontSize: '0.7rem',
                                  minWidth: '18px',
                                  height: '18px'
                                }
                              }}
                            >
                              <Plus size={16} />
                            </Badge>
                          </IconButton>
                        )}
                      </Box>
                    ) : (
                      <Box sx={{ 
                        height: '100%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center' 
                      }}>
                        <Typography 
                          variant="caption" 
                          sx={{ color: theme.palette.mode === 'light' ? '#595667' : '#D8D5E2' }}
                        >
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

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <List sx={{ p: 0, minWidth: 300 }}>
          {selectedBookings.map((booking, index) => (
            <ListItem 
              key={booking.id}
              sx={{ 
                borderBottom: index < selectedBookings.length - 1 ? 1 : 0,
                borderColor: 'divider',
                bgcolor: index === 0 ? 'action.hover' : 'transparent'
              }}
            >
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle2">{booking.userEmail}</Typography>
                    <Chip 
                      label={getStatusText(booking.status)}
                      size="small"
                      sx={{ height: 20 }}
                    />
                  </Box>
                }
                secondary={
                  <Box sx={{ mt: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Clock size={14} />
                      <Typography variant="caption">
                        Início: {formatDateTime(booking.startTime)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                      <Clock size={14} />
                      <Typography variant="caption">
                        Fim: {formatDateTime(booking.endTime)}
                      </Typography>
                    </Box>
                    {booking.userPhone && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <Phone size={14} />
                        <Typography variant="caption">{booking.userPhone}</Typography>
                      </Box>
                    )}
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      </Popover>
    </TableContainer>
  );
};

export default React.memo(Calendar);
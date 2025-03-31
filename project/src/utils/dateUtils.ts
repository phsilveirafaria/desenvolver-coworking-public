import { format, startOfWeek, addDays, isSameDay, parseISO, isWithinInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Booking } from '../types';

export const generateWeekDays = (currentDate: Date) => {
  const startDate = startOfWeek(currentDate, { weekStartsOn: 0 });
  return Array.from({ length: 7 }, (_, i) => addDays(startDate, i));
};

export const generateTimeSlots = () => {
  return Array.from({ length: 15 }, (_, i) => {
    const hour = i + 8;
    return `${hour}:00`;
  });
};

export const isBookingInTimeSlot = (booking: Booking, day: Date, timeSlot: string): boolean => {
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

export const isValidBookingStatus = (status: string): boolean => {
  return status === 'criado' || status === 'concluido';
};

export const formatDateRange = (startDate: Date, endDate: Date): string => {
  return `${format(startDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })} - ${format(endDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}`;
};

export const formatDayHeader = (date: Date): string => {
  return format(date, 'EEEE', { locale: ptBR });
};

export const formatDaySubheader = (date: Date): string => {
  return format(date, 'dd/MM/yyyy');
};
import { useState, useCallback } from 'react';
import { addDays } from 'date-fns';
import { generateWeekDays, generateTimeSlots } from '../utils/dateUtils';

export const useCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const weekDays = generateWeekDays(currentDate);
  const timeSlots = generateTimeSlots();

  const handlePreviousWeek = useCallback(() => {
    setCurrentDate(prev => addDays(prev, -7));
  }, []);

  const handleNextWeek = useCallback(() => {
    setCurrentDate(prev => addDays(prev, 7));
  }, []);

  return {
    currentDate,
    weekDays,
    timeSlots,
    handlePreviousWeek,
    handleNextWeek
  };
};
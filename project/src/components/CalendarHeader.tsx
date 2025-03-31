import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDateRange } from '../utils/dateUtils';

interface CalendarHeaderProps {
  weekDays: Date[];
  onPrevious: () => void;
  onNext: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({ weekDays, onPrevious, onNext }) => {
  return (
    <Box sx={{ 
      p: 2, 
      bgcolor: 'primary.main', 
      color: 'primary.contrastText',
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center' 
    }}>
      <IconButton 
        onClick={onPrevious}
        sx={{ color: 'white' }}
      >
        <ChevronLeft size={24} />
      </IconButton>
      
      <Typography variant="h6" component="h3">
        {formatDateRange(weekDays[0], weekDays[6])}
      </Typography>
      
      <IconButton 
        onClick={onNext}
        sx={{ color: 'white' }}
      >
        <ChevronRight size={24} />
      </IconButton>
    </Box>
  );
};

export default CalendarHeader;
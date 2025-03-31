import React from 'react';
import { TableCell, Typography } from '@mui/material';

interface TimeSlotCellProps {
  isReserved: boolean;
}

const TimeSlotCell: React.FC<TimeSlotCellProps> = ({ isReserved }) => {
  return (
    <TableCell 
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
};

export default React.memo(TimeSlotCell);
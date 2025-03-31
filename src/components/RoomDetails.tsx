import React from 'react';
import { CardContent, Typography } from '@mui/material';
import { Room } from '../types';

interface RoomDetailsProps {
  room: Room;
}

const RoomDetails: React.FC<RoomDetailsProps> = ({ room }) => {
  return (
    <CardContent sx={{ 
      height: { xs: 'auto', md: '400px' },
      p: 4,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }}>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        {room.name}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        {room.description}
      </Typography>
    </CardContent>
  );
};

export default React.memo(RoomDetails);
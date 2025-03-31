import React from 'react';
import { Box, CardMedia } from '@mui/material';

interface RoomImageProps {
  imageUrl: string;
  name: string;
}

const RoomImage: React.FC<RoomImageProps> = ({ imageUrl, name }) => {
  return (
    <Box sx={{ 
      width: '100%',
      height: { xs: '300px', md: '400px' },
      position: 'relative'
    }}>
      <CardMedia
        component="img"
        image={imageUrl}
        alt={name}
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
    </Box>
  );
};

export default React.memo(RoomImage);
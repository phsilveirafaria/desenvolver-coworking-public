import React from 'react';
import { Link } from 'react-router-dom';
import { Room } from '../types';
import { 
  Card, 
  CardMedia, 
  CardContent, 
  Typography, 
  Box, 
  Chip,
  CardActionArea,
  useTheme
} from '@mui/material';
import { Calendar } from 'lucide-react';

interface RoomCardProps {
  room: Room;
}

const RoomCard: React.FC<RoomCardProps> = ({ room }) => {
  const theme = useTheme();

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        '& .MuiCardActionArea-root': {
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch'
        }
      }}
      elevation={2}
    >
      <CardActionArea 
        component={Link} 
        to={`/rooms/${room.id}`}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}
      >
        {/* Image container with reduced height */}
        <Box sx={{ 
          width: '100%',
          height: 180, // Reduced from 240px to 180px
          position: 'relative',
          overflow: 'hidden'
        }}>
          <CardMedia
            component="img"
            image={room.imageUrl}
            alt={room.name}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
            }}
          />
        </Box>

        <CardContent 
          sx={{ 
            flexGrow: 1, 
            display: 'flex', 
            flexDirection: 'column',
            p: 2.5, // Reduced padding
            gap: 1.5, // Reduced gap
            height: 220, // Reduced from 300px to 220px
            overflow: 'auto'
          }}
        >
          <Typography 
            variant="h6" 
            component="h3"
            sx={{ 
              fontSize: '1.125rem', // Slightly smaller font
              fontWeight: 600,
              lineHeight: 1.2,
              mb: 1
            }}
          >
            {room.name}
          </Typography>
          
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{
              flexGrow: 1,
              lineHeight: 1.5,
              mb: 1.5
            }}
          >
            {room.description}
          </Typography>
          
          <Box sx={{ 
            pt: 1.5,
            borderTop: 1, 
            borderColor: 'divider',
            marginTop: 'auto'
          }}>
            <Chip
              icon={<Calendar size={16} />}
              label="Ver disponibilidade"
              size="small"
              sx={{ 
                '& .MuiChip-icon': { ml: 0.5 },
                color: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.primary.main,
                borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.23)' : theme.palette.primary.main,
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.08)',
                }
              }}
              variant="outlined"
            />
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default RoomCard;
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
  isAdmin?: boolean;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, isAdmin = false }) => {
  const theme = useTheme();

  // Adjust the link path based on whether we're in admin mode
  const linkPath = isAdmin ? `/admin/room/${room.id}` : `/rooms/${room.id}`;

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardActionArea component={Link} to={linkPath} sx={{ flexGrow: 1 }}>
        <Box sx={{ position: 'relative', paddingTop: '56.25%' /* 16:9 aspect ratio */ }}>
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
            }}
          />
        </Box>
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Typography 
            variant="h6" 
            component="h3" 
            gutterBottom
            sx={{ 
              fontSize: '1.25rem',
              fontWeight: 600,
              mb: 2
            }}
          >
            {room.name}
          </Typography>
          
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              mb: 2,
              flexGrow: 1,
              lineHeight: 1.6
            }}
          >
            {room.description}
          </Typography>
          
          <Box sx={{ mt: 'auto', pt: 2, borderTop: 1, borderColor: 'divider' }}>
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
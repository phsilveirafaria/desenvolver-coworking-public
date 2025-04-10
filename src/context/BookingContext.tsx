import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Booking, Room } from '../types';
import { supabase } from '../lib/supabase';

interface BookingContextType {
  bookings: Booking[];
  rooms: Room[];
  getBookingsByRoom: (roomId: string) => Booking[];
  getRoom: (roomId: string) => Room | undefined;
  isLoading: boolean;
  refreshData: () => Promise<void>;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

// Default coworking space image from Unsplash
const DEFAULT_ROOM_IMAGE = '/default-room.avif';

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchRooms = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('salas_coworking')
        .select('*')
        .order('nome');
      
      if (error) {
        console.error('Error fetching rooms:', error);
        return;
      }
      
      if (data) {
        const formattedRooms: Room[] = data.map(room => ({
          id: room.id,
          name: room.nome,
          code: room.codigo,
          description: room.descricao || '',
          createdAt: room.data_criacao,
          imageUrl: room.imagem_url || DEFAULT_ROOM_IMAGE // Use default image if none provided
        }));
        
        setRooms(formattedRooms);
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  }, []);

  const fetchBookings = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('reservas_coworking')
        .select('*')
        .order('data_inicio');
      
      if (error) {
        console.error('Error fetching bookings:', error);
        return;
      }
      
      if (data) {
        const formattedBookings: Booking[] = data.map(booking => ({
          id: booking.id,
          userEmail: booking.email_usuario,
          userPhone: booking.telefone_usuario,
          status: booking.status,
          roomId: booking.id_sala,
          startTime: booking.data_inicio,
          endTime: booking.data_fim,
          createdAt: booking.data_criacao
        }));
        
        setBookings(formattedBookings);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  }, []);

  const refreshData = useCallback(async () => {
    setIsLoading(true);
    try {
      await Promise.all([fetchRooms(), fetchBookings()]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchRooms, fetchBookings]);

  useEffect(() => {
    refreshData();
    
    // Set up real-time subscriptions
    const roomsSubscription = supabase
      .channel('rooms-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'salas_coworking' 
        }, 
        () => {
          fetchRooms();
        }
      )
      .subscribe();
      
    const bookingsSubscription = supabase
      .channel('bookings-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'reservas_coworking' 
        }, 
        () => {
          fetchBookings();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(roomsSubscription);
      supabase.removeChannel(bookingsSubscription);
    };
  }, [fetchRooms, fetchBookings, refreshData]);

  const getBookingsByRoom = useCallback((roomId: string) => {
    return bookings.filter(booking => booking.roomId === roomId);
  }, [bookings]);

  const getRoom = useCallback((roomId: string) => {
    return rooms.find(room => room.id === roomId);
  }, [rooms]);

  const contextValue = useMemo(() => ({
    bookings,
    rooms,
    getBookingsByRoom,
    getRoom,
    isLoading,
    refreshData
  }), [bookings, rooms, getBookingsByRoom, getRoom, isLoading, refreshData]);

  return (
    <BookingContext.Provider value={contextValue}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = (): BookingContextType => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
export type Room = {
  id: string;
  name: string;
  code: string;
  description: string;
  createdAt: string;
  imageUrl: string;
};

export type Booking = {
  id: string;
  status: 'criado' | 'concluido' | 'cancelado';
  roomId: string;
  startTime: string;
  endTime: string;
  createdAt: string;
};
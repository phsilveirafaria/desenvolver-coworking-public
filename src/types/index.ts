export type User = {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
};

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
  userEmail: string;
  userPhone?: string;
  status: 'criado' | 'concluido' | 'cancelado';
  roomId: string;
  startTime: string;
  endTime: string;
  createdAt: string;
};
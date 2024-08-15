import { Server } from 'http';
import { Server as SocketIOServer } from 'socket.io';

export const initSocket = (server: Server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('New client connected');

    // Handle real-time events here

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
};

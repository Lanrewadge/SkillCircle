import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

export const setupSocket = (io: Server) => {
  // Authentication middleware for socket connections
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      socket.data.userId = decoded.id;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User ${socket.data.userId} connected`);

    // Join user to their personal room
    socket.join(`user:${socket.data.userId}`);

    // Handle joining conversation rooms
    socket.on('join_conversation', (conversationId) => {
      socket.join(`conversation:${conversationId}`);
    });

    // Handle leaving conversation rooms
    socket.on('leave_conversation', (conversationId) => {
      socket.leave(`conversation:${conversationId}`);
    });

    // Handle new messages
    socket.on('send_message', (data) => {
      // Emit to conversation room
      socket.to(`conversation:${data.conversationId}`).emit('new_message', data);
    });

    // Handle typing indicators
    socket.on('typing_start', (data) => {
      socket.to(`conversation:${data.conversationId}`).emit('user_typing', {
        userId: socket.data.userId,
        isTyping: true
      });
    });

    socket.on('typing_stop', (data) => {
      socket.to(`conversation:${data.conversationId}`).emit('user_typing', {
        userId: socket.data.userId,
        isTyping: false
      });
    });

    socket.on('disconnect', () => {
      console.log(`User ${socket.data.userId} disconnected`);
    });
  });
};
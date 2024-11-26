import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
    this.userId = null;
  }

  connect(userId) {
    this.socket = io(SOCKET_URL);
    this.userId = userId;

    this.socket.on('connect', () => {
      console.log('Socket connected');
      this.socket.emit('join', userId);
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  onOrderUpdate(callback) {
    if (this.socket) {
      this.socket.on('orderUpdate', callback);
    }
  }
}

export default new SocketService(); 
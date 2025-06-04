import { io } from 'socket.io-client';

let socketInstance = null;

// Function to get or create socket instance
export const getSocket = (token) => {
  if (!token) {
    throw new Error('No token provided');
  }

  if (!socketInstance || socketInstance.disconnected) {
    socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000', {
      auth: { 
        token,
        userId: localStorage.getItem('userId') // Optional: add more auth data
      },
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
      transports: ['websocket']
    });
  }
  
  return socketInstance;
};

// Function to properly disconnect socket
export const disconnectSocket = () => {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
};

// Function to check if socket is connected
export const isSocketConnected = () => {
  return socketInstance?.connected || false;
};
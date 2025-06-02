import { io } from 'socket.io-client';
import Cookies from 'js-cookie';

const token = Cookies.get('token'); // Adjust the cookie name if different

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
  auth: {
    token: token || ''
  },
  autoConnect: false
});

export default socket;

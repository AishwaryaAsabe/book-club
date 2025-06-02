'use client';
import { io } from 'socket.io-client';
import React, { useEffect, useRef, useState } from 'react';

import Cookies from 'js-cookie'; // Assuming you store token in cookiesimport { useRef, useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Phone, Video, MoreVertical } from 'lucide-react';
import ChatMemberList from '../../components/chat/ChatMemberList';
import ChatMessageList from '../../components/chat/ChatMessageList';
import ChatInput from '../../components/chat/ChatInput';
import '../../styles/chatRoom.css';
import socket from '../lib/socket';

const ChatRoom = () => {
  const socketRef = useRef(null);
  const router = useRouter();
  const params = useParams();
  const clubId = params.clubId;
  const [socketConnected, setSocketConnected] = useState(false);

  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [clubInfo, setClubInfo] = useState(null);
  const [showMembers, setShowMembers] = useState(false);
  const bottomRef = useRef();


  // Get current user
  useEffect(() => {
    const getUser = async () => {
      const user = await fetchCurrentUser(); // <- this must be defined
      setCurrentUser(user);
    };
    getUser();
  }, []);


  const fetchCurrentUser = async () => {
  const res = await fetch('/api/user/me', {
    headers: {
      Authorization: `Bearer ${Cookies.get('token')}`,
              credentials: 'include',

    },
  });
  return await res.json();
};

  // Fetch club info
  useEffect(() => {
    const fetchClubInfo = async () => {
      try {
        const response = await fetch(`/api/clubs/${clubId}`);
        const data = await response.json();
        setClubInfo({
          name: data.name,
          members: data.members,
          imageUrl: data.imageUrl || '/default-club-icon.png'
        });
      } catch (error) {
        console.error('Error fetching club info:', error);
      }
    };

    fetchClubInfo();
  }, [clubId]);

  // Fetch messages only when currentUser is ready
  useEffect(() => {
    if (!currentUser) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/discussions/${clubId}`);
        const data = await res.json();

         if (!Array.isArray(data)) {
      throw new Error('Invalid response format');
    }

    const formattedMessages = data.map((msg) => ({
      id: msg._id,
      sender: msg.userId?.name || 'Unknown',
      avatar: msg.userId?.avatar || '/default-avatar.png',
      message: msg.text,
      timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      isOwn: msg.userId?._id === currentUser._id,
    }));

        setMessages(formattedMessages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [clubId, currentUser]);

  // Socket connection and listeners
   useEffect(() => {
    if (!currentUser) return;

    const token = Cookies.get('token'); // or localStorage.getItem('token')

  socket.auth = { token };
  socket.connect();
  
  socket.emit('joinClub', clubId);
    socket.on('newMessage', (msg) => {  // Note the event name from backend
        console.log('Message received on client:', msg);

      const newMsg = {
        id: msg._id,
        sender: msg.userId.name,
        avatar: msg.userId.avatar,
        message: msg.text,
        timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        isOwn: msg.userId._id === currentUser._id,
      };
      setMessages((prev) => [...prev, newMsg]);
    });

    socket.on('error', (err) => {
      console.error('Socket error:', err);
    });

    return () => {
      socket.disconnect();
    };
  }, [clubId, currentUser]);

  // Scroll to bottom when messages update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

const handleSendMessage = (message) => {
  if (!socket || !currentUser) return;
  socket.emit('send_message', {
    text: message,
    clubId,
    userId: currentUser._id,
  });
};


  return (
    <div className="chat-room-container">
      <header className="chat-header">
        <div className="chat-header-left">
          <Link href={`/clubs/${clubId}`} className="back-button">
            <ArrowLeft className="back-icon" />
          </Link>
          <div className="club-info-header" onClick={() => setShowMembers(!showMembers)}>
            <img
              src={clubInfo?.imageUrl || "/default-club-icon.png"}
              alt={clubInfo?.name || "Club"}
              className="club-avatar-header"
            />
            <div className="club-details-header">
              <h1 className="club-name-header">{clubInfo?.name || "Loading..."}</h1>
              <p className="club-members-count">{clubInfo?.members ?? 0} members</p>
            </div>
          </div>
        </div>
        <div className="chat-header-actions">
          <button className="header-action-btn"><Video className="action-icon" /></button>
          <button className="header-action-btn"><Phone className="action-icon" /></button>
          <button className="header-action-btn"><MoreVertical className="action-icon" /></button>
        </div>
      </header>

      <div className="chat-main-content">
        {showMembers && <ChatMemberList onClose={() => setShowMembers(false)} clubId={clubId} />}
        <div className="chat-area">
          <ChatMessageList messages={messages} />
          <div ref={bottomRef} />
          <ChatInput onSendMessage={handleSendMessage} />
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;

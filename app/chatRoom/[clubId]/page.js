"use client";
import React from 'react'
import ChatRoom from '../../components/chatRoom';
import ProtectedRoute from '../../components/protectedRoutes'
const page = () => {
  return (
    <ProtectedRoute>
    <div className=''>
      <ChatRoom></ChatRoom>
    </div>
    </ProtectedRoute>
  )
}

export default page
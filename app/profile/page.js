"use client";
import React from 'react'
import Profile from '../components/profile';
import ProtectedRoute from '../components/protectedRoutes'
const page = () => {
  return (
    <ProtectedRoute>
    <div className=''>
      <Profile></Profile>
    </div>
    </ProtectedRoute>
  )
}

export default page
"use client";
import React from 'react'
import Clubs from '../components/clubs';
import ProtectedRoute from '../components/protectedRoutes'
const page = () => {
  return (
    <ProtectedRoute>
    <div className=''>
      <Clubs></Clubs>
    </div>
    </ProtectedRoute>
  )
}

export default page
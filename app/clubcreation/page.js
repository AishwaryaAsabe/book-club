"use client";
import React from 'react'
import ClubCreation from '../components/clubcreation';
import ProtectedRoute from '../components/protectedRoutes'
const page = () => {
  return (
    <ProtectedRoute>
    <div className=''>
      <ClubCreation></ClubCreation>
    </div>
    </ProtectedRoute>
  )
}

export default page
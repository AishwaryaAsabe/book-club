"use client";
import React from 'react'
import Dashboard from '../components/dashboard'
import ProtectedRoute from '../components/protectedRoutes'
const page = () => {
  return (
    <ProtectedRoute>
    <div className=''>
      <Dashboard></Dashboard>
    </div>
    </ProtectedRoute>
  )
}

export default page
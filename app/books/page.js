"use client";
import React from 'react'
import Books from '../components/books';
import ProtectedRoute from '../components/protectedRoutes'
const page = () => {
  return (
    <ProtectedRoute>
    <div className=''>
      <Books></Books>
    </div>
    </ProtectedRoute>
  )
}

export default page
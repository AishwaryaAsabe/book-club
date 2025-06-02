'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/user/me', {
          credentials: 'include',
        });
        if (res.ok) {
          setIsAuth(true);
        } else {
          setIsAuth(false);
          router.replace('/login');
        }
      } catch (error) {
        setIsAuth(false);
        router.replace('/login');
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [router]);

  if (loading) {
    // You can replace this with your spinner/loading UI
    return <div>Loading...</div>;
  }

  if (!isAuth) {
    return null; // Redirecting, so don't render children
  }

  return <>{children}</>;
};

export default ProtectedRoute;

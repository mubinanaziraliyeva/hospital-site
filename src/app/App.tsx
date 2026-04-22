import { RouterProvider } from 'react-router';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from './components/ui/sonner';
import { router } from './routes';
import { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    console.log('App mounted successfully');
  }, []);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster />
    </AuthProvider>
  );
}
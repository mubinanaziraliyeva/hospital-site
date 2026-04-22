import { createBrowserRouter, Navigate } from 'react-router';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import Login from './pages/Login';
import Setup from './pages/Setup';

// Patient pages
import PatientDashboard from './pages/patient/Dashboard';
import Doctors from './pages/patient/Doctors';
import Appointments from './pages/patient/Appointments';
import Hospital from './pages/patient/Hospital';

// Doctor pages
import DoctorDashboard from './pages/doctor/Dashboard';
import Schedule from './pages/doctor/Schedule';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminDoctors from './pages/admin/Doctors';
import Rooms from './pages/admin/Rooms';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />
  },
  {
    element: <Layout />,
    children: [
      // Patient routes
      {
        path: '/patient',
        element: (
          <ProtectedRoute allowedRoles={['patient']}>
            <PatientDashboard />
          </ProtectedRoute>
        )
      },
      {
        path: '/patient/doctors',
        element: (
          <ProtectedRoute allowedRoles={['patient']}>
            <Doctors />
          </ProtectedRoute>
        )
      },
      {
        path: '/patient/appointments',
        element: (
          <ProtectedRoute allowedRoles={['patient']}>
            <Appointments />
          </ProtectedRoute>
        )
      },
      {
        path: '/patient/hospital',
        element: (
          <ProtectedRoute allowedRoles={['patient']}>
            <Hospital />
          </ProtectedRoute>
        )
      },
      
      // Doctor routes
      {
        path: '/doctor',
        element: (
          <ProtectedRoute allowedRoles={['doctor']}>
            <DoctorDashboard />
          </ProtectedRoute>
        )
      },
      {
        path: '/doctor/schedule',
        element: (
          <ProtectedRoute allowedRoles={['doctor']}>
            <Schedule />
          </ProtectedRoute>
        )
      },
      
      // Admin routes
      {
        path: '/admin',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        )
      },
      {
        path: '/admin/doctors',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDoctors />
          </ProtectedRoute>
        )
      },
      {
        path: '/admin/rooms',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <Rooms />
          </ProtectedRoute>
        )
      },
      
      // Setup page (accessible to all authenticated users)
      {
        path: '/setup',
        element: (
          <ProtectedRoute allowedRoles={['patient', 'doctor', 'admin']}>
            <Setup />
          </ProtectedRoute>
        )
      },
      
      // Catch all
      {
        path: '*',
        element: <Navigate to="/" replace />
      }
    ]
  }
]);
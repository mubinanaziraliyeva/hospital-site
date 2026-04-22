import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Alert, AlertDescription } from '../components/ui/alert';
import { CheckCircle, XCircle, AlertCircle, RefreshCw, Database } from 'lucide-react';
import { seedFirestore } from '../firebase/seedData';
import { getDoctors, getRooms, getAppointments } from '../firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { db, auth } from '../firebase/config';

export default function Setup() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);
  const [checks, setChecks] = useState<{
    firebase: boolean | null;
    auth: boolean | null;
    firestore: boolean | null;
    user: boolean | null;
    doctors: number;
    rooms: number;
    appointments: number;
  }>({
    firebase: null,
    auth: null,
    firestore: null,
    user: null,
    doctors: 0,
    rooms: 0,
    appointments: 0,
  });

  const runDiagnostics = async () => {
    setLoading(true);
    const newChecks = { ...checks };

    try {
      // Check Firebase initialization
      if (db && auth) {
        newChecks.firebase = true;
      } else {
        newChecks.firebase = false;
      }

      // Check Auth
      if (auth.currentUser) {
        newChecks.auth = true;
      } else {
        newChecks.auth = false;
      }

      // Check Firestore connection and count data
      try {
        const [doctors, rooms, appointments] = await Promise.all([
          getDoctors(),
          getRooms(),
          getAppointments()
        ]);
        
        newChecks.firestore = true;
        newChecks.doctors = doctors.length;
        newChecks.rooms = rooms.length;
        newChecks.appointments = appointments.length;
      } catch (error) {
        console.error('Firestore error:', error);
        newChecks.firestore = false;
      }

      // Check User document
      if (user?.uid) {
        newChecks.user = true;
      } else {
        newChecks.user = false;
      }

      setChecks(newChecks);
      setStatus({
        type: 'success',
        message: `Diagnostika tugadi. ${newChecks.doctors} ta doktor, ${newChecks.rooms} ta xona, ${newChecks.appointments} ta navbat topildi.`,
      });
    } catch (error: any) {
      setStatus({
        type: 'error',
        message: `Diagnostika xatosi: ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSeedData = async () => {
    setLoading(true);
    try {
      const result = await seedFirestore();
      if (result.success) {
        setStatus({
          type: 'success',
          message: 'Ma\'lumotlar muvaffaqiyatli yuklandi! Doktorlar va xonalar Firebase ga qo\'shildi.',
        });
      } else {
        setStatus({
          type: 'error',
          message: 'Ma\'lumotlarni yuklashda xatolik yuz berdi.',
        });
      }
    } catch (error: any) {
      setStatus({
        type: 'error',
        message: `Xatolik: ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTestPermissions = async () => {
    setLoading(true);
    try {
      // Test doctors read
      const doctors = await getDoctors();
      
      // Test rooms read
      const rooms = await getRooms();

      setStatus({
        type: 'success',
        message: `Ruxsatlar ishlayapti! ${doctors.length} ta doktor va ${rooms.length} ta xona topildi.`,
      });
    } catch (error: any) {
      if (error.code === 'permission-denied') {
        setStatus({
          type: 'error',
          message: 'Ruxsat berilmadi! Firebase Security Rules ni tekshiring. FIREBASE_SETUP.md faylini o\'qing.',
        });
      } else {
        setStatus({
          type: 'error',
          message: `Xatolik: ${error.message}`,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (value: boolean | null) => {
    if (value === null) return <AlertCircle className="w-5 h-5 text-gray-400" />;
    if (value === true) return <CheckCircle className="w-5 h-5 text-green-600" />;
    return <XCircle className="w-5 h-5 text-red-600" />;
  };

  const getStatusText = (value: boolean | null) => {
    if (value === null) return 'Tekshirilmagan';
    if (value === true) return 'Ishlayapti ✓';
    return 'Xato ✗';
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="font-bold text-3xl mb-2">Tizim sozlamalari</h1>
        <p className="text-gray-600">
          Firebase bilan bog'lanishni tekshiring va dastlabki ma'lumotlarni yuklang
        </p>
      </div>

      {status && (
        <Alert className={`mb-6 ${
          status.type === 'success' ? 'border-green-500 bg-green-50' : 
          status.type === 'error' ? 'border-red-500 bg-red-50' : 
          'border-blue-500 bg-blue-50'
        }`}>
          <AlertDescription className={
            status.type === 'success' ? 'text-green-800' : 
            status.type === 'error' ? 'text-red-800' : 
            'text-blue-800'
          }>
            {status.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Current User Info */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Joriy foydalanuvchi</CardTitle>
          <CardDescription>Tizimga kirgan foydalanuvchi ma'lumotlari</CardDescription>
        </CardHeader>
        <CardContent>
          {user ? (
            <div className="space-y-2">
              <p><strong>Ism:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Rol:</strong> <span className="capitalize">{user.role}</span></p>
              <p><strong>UID:</strong> {user.uid}</p>
            </div>
          ) : (
            <p className="text-gray-500">Foydalanuvchi tizimga kirmagan</p>
          )}
        </CardContent>
      </Card>

      {/* Diagnostics */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Tizim diagnostikasi</CardTitle>
          <CardDescription>Firebase ulanishini tekshirish</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between p-3 border rounded">
              <div className="flex items-center gap-3">
                {getStatusIcon(checks.firebase)}
                <div>
                  <p className="font-medium">Firebase SDK</p>
                  <p className="text-sm text-gray-500">Firebase konfiguratsiyasi</p>
                </div>
              </div>
              <span className="text-sm">{getStatusText(checks.firebase)}</span>
            </div>

            <div className="flex items-center justify-between p-3 border rounded">
              <div className="flex items-center gap-3">
                {getStatusIcon(checks.auth)}
                <div>
                  <p className="font-medium">Authentication</p>
                  <p className="text-sm text-gray-500">Foydalanuvchi autentifikatsiyasi</p>
                </div>
              </div>
              <span className="text-sm">{getStatusText(checks.auth)}</span>
            </div>

            <div className="flex items-center justify-between p-3 border rounded">
              <div className="flex items-center gap-3">
                {getStatusIcon(checks.firestore)}
                <div>
                  <p className="font-medium">Firestore</p>
                  <p className="text-sm text-gray-500">Ma'lumotlar bazasi ulanishi</p>
                </div>
              </div>
              <span className="text-sm">{getStatusText(checks.firestore)}</span>
            </div>

            <div className="flex items-center justify-between p-3 border rounded">
              <div className="flex items-center gap-3">
                {getStatusIcon(checks.user)}
                <div>
                  <p className="font-medium">User Document</p>
                  <p className="text-sm text-gray-500">Foydalanuvchi ma'lumotlari</p>
                </div>
              </div>
              <span className="text-sm">{getStatusText(checks.user)}</span>
            </div>
          </div>

          <Button onClick={runDiagnostics} disabled={loading} className="w-full">
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Tekshirilmoqda...' : 'Diagnostika o\'tkazish'}
          </Button>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Amallar</CardTitle>
          <CardDescription>Tizimni sozlash va test qilish</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            onClick={handleSeedData} 
            disabled={loading} 
            className="w-full"
            variant="outline"
          >
            {loading ? 'Yuklanmoqda...' : 'Dastlabki ma\'lumotlarni yuklash'}
          </Button>
          <p className="text-sm text-gray-500">
            Doktorlar va xonalar haqida ma'lumotlarni Firebase ga yuklaydi
          </p>

          <Button 
            onClick={handleTestPermissions} 
            disabled={loading} 
            className="w-full"
            variant="outline"
          >
            {loading ? 'Tekshirilmoqda...' : 'Ruxsatlarni tekshirish'}
          </Button>
          <p className="text-sm text-gray-500">
            Firebase Security Rules to'g'ri sozlanganini tekshiradi
          </p>
        </CardContent>
      </Card>

      {/* Help */}
      <Card className="mt-6 border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-900">Yordam kerakmi?</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-800 space-y-2">
          <p>
            <strong>Permission denied xatosi:</strong> FIREBASE_SETUP.md faylini o'qing va 
            Firestore Security Rules to'g'ri o'rnatilganini tekshiring.
          </p>
          <p>
            <strong>Demo foydalanuvchilar:</strong> DEMO_USERS_SETUP.md faylida qadamma-qadam 
            yo'riqnoma mavjud.
          </p>
          <p>
            <strong>Firebase config:</strong> /src/app/firebase/config.ts faylida to'g'ri 
            konfiguratsiya kiritilganini tekshiring.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
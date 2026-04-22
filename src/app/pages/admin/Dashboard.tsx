import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { Users, Calendar, Building2, TrendingUp, Clock, CheckCircle, Info } from 'lucide-react';
import { subscribeToDoctors, subscribeToAllAppointments, subscribeToRooms } from '../../firebase/firestore';
import { Doctor, Appointment, Room } from '../../data/mockData';

export default function AdminDashboard() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Real-time listeners
    const unsubscribeDoctors = subscribeToDoctors(setDoctors);
    const unsubscribeAppointments = subscribeToAllAppointments(setAppointments);
    const unsubscribeRooms = subscribeToRooms((roomsData) => {
      setRooms(roomsData);
      setLoading(false);
    });

    return () => {
      unsubscribeDoctors();
      unsubscribeAppointments();
      unsubscribeRooms();
    };
  }, []);

  const totalDoctors = doctors.length;
  const totalAppointments = appointments.length;
  
  // Get today's date in format YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(apt => apt.date === today);
  const completedToday = todayAppointments.filter(apt => apt.status === 'completed').length;
  const occupiedRooms = rooms.filter(r => r.status === 'occupied').length;
  const availableRooms = rooms.filter(r => r.status === 'available').length;

  // Calculate average wait time (mock calculation)
  const avgWaitTime = 25; // minutes
  const patientSatisfaction = 92; // percentage

  // Get busiest doctors
  const doctorAppointments = doctors.map(doctor => ({
    doctor,
    count: appointments.filter(apt => apt.doctorId === doctor.id).length
  })).sort((a, b) => b.count - a.count);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-bold text-3xl mb-2">Boshqaruv paneli</h1>
        <p className="text-gray-600">Shifoxona statistikasi va nazorat</p>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Doktorlar</p>
                <p className="text-3xl font-bold mt-1">{totalDoctors}</p>
                <p className="text-xs text-green-600 mt-1">Faol</p>
              </div>
              <Users className="w-10 h-10 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Bugungi navbatlar</p>
                <p className="text-3xl font-bold mt-1">{todayAppointments.length}</p>
                <p className="text-xs text-gray-600 mt-1">{completedToday} tugatildi</p>
              </div>
              <Calendar className="w-10 h-10 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Xonalar</p>
                <p className="text-3xl font-bold mt-1">{occupiedRooms}/{rooms.length}</p>
                <p className="text-xs text-gray-600 mt-1">Band</p>
              </div>
              <Building2 className="w-10 h-10 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">O'rtacha kutish</p>
                <p className="text-3xl font-bold mt-1">{avgWaitTime}</p>
                <p className="text-xs text-gray-600 mt-1">daqiqa</p>
              </div>
              <Clock className="w-10 h-10 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Samaradorlik ko'rsatkichlari
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">Bemorlar qoniqishi</p>
                <span className="font-bold text-green-600">{patientSatisfaction}%</span>
              </div>
              <Progress value={patientSatisfaction} className="h-2" />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">Xonalar bandligi</p>
                <span className="font-bold text-blue-600">
                  {rooms.length > 0 ? Math.round((occupiedRooms / rooms.length) * 100) : 0}%
                </span>
              </div>
              <Progress value={rooms.length > 0 ? (occupiedRooms / rooms.length) * 100 : 0} className="h-2" />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">Bugungi yuklama</p>
                <span className="font-bold text-purple-600">
                  {todayAppointments.length > 0 ? Math.round((completedToday / todayAppointments.length) * 100) : 0}%
                </span>
              </div>
              <Progress value={todayAppointments.length > 0 ? (completedToday / todayAppointments.length) * 100 : 0} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Eng band doktorlar</CardTitle>
            <CardDescription>Navbatlar soni bo'yicha</CardDescription>
          </CardHeader>
          <CardContent>
            {doctorAppointments.length > 0 ? (
              <div className="space-y-3">
                {doctorAppointments.slice(0, 5).map((item, index) => (
                  <div key={item.doctor.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{item.doctor.name}</p>
                        <p className="text-xs text-gray-600">{item.doctor.specialization}</p>
                      </div>
                    </div>
                    <Badge>{item.count} ta navbat</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Hozircha ma'lumot yo'q</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Link to="/admin/doctors">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <Users className="w-10 h-10 text-blue-600 mb-2" />
              <CardTitle>Doktorlarni boshqarish</CardTitle>
              <CardDescription>Xodimlarni qo'shish va tahrirlash</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Ochish</Button>
            </CardContent>
          </Card>
        </Link>

        <Link to="/admin/rooms">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <Building2 className="w-10 h-10 text-purple-600 mb-2" />
              <CardTitle>Xonalarni boshqarish</CardTitle>
              <CardDescription>Xonalar holatini nazorat qilish</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Ochish</Button>
            </CardContent>
          </Card>
        </Link>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardHeader>
            <CheckCircle className="w-10 h-10 mb-2" />
            <CardTitle>Bugungi yakunlar</CardTitle>
            <CardDescription className="text-green-100">
              {completedToday} ta bemor ko'rildi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              Kutilmoqda: {todayAppointments.length - completedToday}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Appointments */}
      <Card>
        <CardHeader>
          <CardTitle>So'nggi navbatlar</CardTitle>
          <CardDescription>Bugungi barcha navbatlar</CardDescription>
        </CardHeader>
        <CardContent>
          {todayAppointments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Bugun navbatlar yo'q</p>
          ) : (
            <div className="space-y-3">
              {todayAppointments.slice(0, 10).map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-4 rounded-lg border"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-2xl font-bold text-gray-400">
                      #{appointment.queueNumber}
                    </div>
                    <div>
                      <p className="font-medium">{appointment.patientName}</p>
                      <p className="text-sm text-gray-600">
                        {appointment.doctorName} • {appointment.time}
                      </p>
                    </div>
                  </div>
                  <Badge
                    className={
                      appointment.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : appointment.status === 'confirmed'
                        ? 'bg-blue-100 text-blue-800'
                        : appointment.status === 'cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }
                  >
                    {appointment.status === 'completed'
                      ? 'Tugatildi'
                      : appointment.status === 'confirmed'
                      ? 'Tasdiqlangan'
                      : appointment.status === 'cancelled'
                      ? 'Bekor qilingan'
                      : 'Kutilmoqda'}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Calendar, Users, Hospital, Clock, Bell } from 'lucide-react';
import { getDoctors, subscribeToPatientAppointments } from '../../firebase/firestore';
import { Doctor, Appointment } from '../../data/mockData';
import { hospitalInfo } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';

export default function PatientDashboard() {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Doktorlarni yuklash
    const loadDoctors = async () => {
      try {
        const doctorsData = await getDoctors();
        setDoctors(doctorsData);
      } catch (error: any) {
        console.error('Doktorlarni yuklashda xatolik:', error);
        if (error?.code === 'permission-denied') {
          console.log('Ruxsat berilmagan. Firebase Security Rules tekshiring.');
        }
      }
    };

    loadDoctors();

    // Navbatlarga real-time subscription
    if (user?.uid) {
      try {
        const unsubscribe = subscribeToPatientAppointments(user.uid, (appointmentsData) => {
          setAppointments(appointmentsData);
          setLoading(false);
        });

        return () => unsubscribe();
      } catch (error: any) {
        console.error('Ma\'lumotlarni yuklashda xatolik:', error);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [user?.uid]);

  const upcomingAppointment = appointments.find(apt => apt.status !== 'completed' && apt.status !== 'cancelled');

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
        <h1 className="font-bold text-3xl mb-2">Xush kelibsiz, {user?.name}!</h1>
        <p className="text-gray-600">Sog'lig'ingiz bizning g'amxo'rligimizdir</p>
      </div>

      {/* Upcoming Appointment Alert */}
      {upcomingAppointment && (
        <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-600" />
              <CardTitle className="text-blue-900">Navbatingiz yaqinlashmoqda</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="font-medium">{upcomingAppointment.doctorName}</p>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(upcomingAppointment.date).toLocaleDateString('uz-UZ')}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {upcomingAppointment.time}
                </span>
                <span className="font-medium text-blue-600">
                  Navbat: #{upcomingAppointment.queueNumber}
                </span>
              </div>
              <Link to="/patient/appointments">
                <Button size="sm" className="mt-2">Batafsil</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Link to="/patient/doctors">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <Users className="w-10 h-10 text-blue-600 mb-2" />
              <CardTitle>Doktorlar</CardTitle>
              <CardDescription>{doctors.length} ta mutaxassis</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link to="/patient/appointments">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <Calendar className="w-10 h-10 text-green-600 mb-2" />
              <CardTitle>Navbatlarim</CardTitle>
              <CardDescription>{appointments.length} ta navbat</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link to="/patient/hospital">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <Hospital className="w-10 h-10 text-purple-600 mb-2" />
              <CardTitle>Shifoxona</CardTitle>
              <CardDescription>Ma'lumotlar</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardHeader>
            <Clock className="w-10 h-10 mb-2" />
            <CardTitle>Ish vaqti</CardTitle>
            <CardDescription className="text-blue-100">
              {hospitalInfo.workingHours}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Featured Doctors */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-2xl">Mashhur doktorlar</h2>
          <Link to="/patient/doctors">
            <Button variant="outline">Barchasini ko'rish</Button>
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {doctors.slice(0, 3).map((doctor) => (
            <Card key={doctor.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{doctor.name}</h3>
                    <p className="text-sm text-gray-600">{doctor.specialization}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        <span className="text-sm font-medium">{doctor.rating}</span>
                      </div>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500">{doctor.experience} yil</span>
                    </div>
                    <Link to={`/patient/doctors?id=${doctor.id}`}>
                      <Button size="sm" className="mt-3 w-full">
                        Navbatga yozilish
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Hospital Info */}
      <Card>
        <CardHeader>
          <CardTitle>Shifoxona haqida</CardTitle>
          <CardDescription>{hospitalInfo.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Manzil</p>
              <p className="mt-1">{hospitalInfo.address}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Telefon</p>
              <p className="mt-1">{hospitalInfo.phone}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Tez yordam</p>
              <p className="mt-1 font-bold text-red-600">{hospitalInfo.emergency}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Email</p>
              <p className="mt-1">{hospitalInfo.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
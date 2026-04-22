import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Users, Clock, CheckCircle, Coffee, Stethoscope, AlertCircle } from 'lucide-react';
import { subscribeToDoctorAppointments, getDoctorById, updateAppointment } from '../../firebase/firestore';
import { Doctor, Appointment } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<'active' | 'break' | 'busy'>('active');
  const [currentQueue, setCurrentQueue] = useState(1);

  useEffect(() => {
    const loadData = async () => {
      if (!user?.uid) return;

      try {
        // Load doctor info
        const doctorData = await getDoctorById(user.uid);
        setDoctor(doctorData);

        // Subscribe to appointments
        const unsubscribe = subscribeToDoctorAppointments(user.uid, (appointmentsData) => {
          // Filter today's appointments
          const today = new Date().toISOString().split('T')[0];
          const todayAppointments = appointmentsData
            .filter(apt => apt.date === today && apt.status !== 'cancelled')
            .sort((a, b) => a.queueNumber - b.queueNumber);
          
          setAppointments(todayAppointments);
          setLoading(false);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Ma\'lumotlarni yuklashda xatolik:', error);
        setLoading(false);
      }
    };

    loadData();
  }, [user?.uid]);

  const completedToday = appointments.filter(apt => apt.status === 'completed').length;
  const pendingToday = appointments.filter(apt => apt.status === 'pending' || apt.status === 'confirmed').length;

  const handleNextPatient = async () => {
    const currentAppointment = appointments[currentQueue - 1];
    
    if (currentAppointment && currentQueue < appointments.length) {
      try {
        // Mark current as completed
        await updateAppointment(currentAppointment.id, { status: 'completed' });
        
        setCurrentQueue(currentQueue + 1);
        toast.success(`Navbat yangilandi: Bemor #${currentQueue + 1}`);
      } catch (error) {
        console.error('Navbatni yangilashda xatolik:', error);
        toast.error('Navbatni yangilashda xatolik yuz berdi');
      }
    } else if (currentAppointment && currentQueue === appointments.length) {
      try {
        await updateAppointment(currentAppointment.id, { status: 'completed' });
        toast.info('Barcha bemorlar ko\'rib chiqildi');
      } catch (error) {
        console.error('Navbatni yangilashda xatolik:', error);
        toast.error('Navbatni yangilashda xatolik yuz berdi');
      }
    } else {
      toast.info('Barcha bemorlar ko\'rib chiqildi');
    }
  };

  const handleStatusChange = (newStatus: 'active' | 'break' | 'busy') => {
    setStatus(newStatus);
    const statusMessages = {
      active: 'Faol: Bemorlarni qabul qilishga tayyorman',
      break: 'Tanaffusda: Qisqa vaqt ichida qaytaman',
      busy: 'Band: Operatsiya/konsultatsiya'
    };
    toast.info(statusMessages[newStatus]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'break': return 'bg-yellow-100 text-yellow-800';
      case 'busy': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'active': return <CheckCircle className="w-5 h-5" />;
      case 'break': return <Coffee className="w-5 h-5" />;
      case 'busy': return <AlertCircle className="w-5 h-5" />;
    }
  };

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
        <h1 className="font-bold text-3xl mb-2">Xush kelibsiz, {user?.name}</h1>
        {doctor && (
          <p className="text-gray-600">{doctor.specialization} • {doctor.room}-xona, {doctor.floor}-qavat</p>
        )}
      </div>

      {/* Status Control */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CardTitle className="flex items-center gap-2">
                {getStatusIcon()}
                Holat
              </CardTitle>
              <Badge className={getStatusColor(status)}>
                {status === 'active' ? 'Faol' : status === 'break' ? 'Tanaffusda' : 'Band'}
              </Badge>
            </div>
            <Select value={status} onValueChange={(v) => handleStatusChange(v as any)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Faol</SelectItem>
                <SelectItem value="break">Tanaffusda</SelectItem>
                <SelectItem value="busy">Band (Operatsiya)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {/* Statistics */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Bugungi bemorlar</p>
                <p className="text-3xl font-bold mt-1">{appointments.length}</p>
              </div>
              <Users className="w-10 h-10 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ko'rib chiqildi</p>
                <p className="text-3xl font-bold mt-1 text-green-600">{completedToday}</p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Navbatda</p>
                <p className="text-3xl font-bold mt-1 text-yellow-600">{pendingToday}</p>
              </div>
              <Clock className="w-10 h-10 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Joriy navbat</p>
                <p className="text-3xl font-bold mt-1 text-purple-600">#{currentQueue}</p>
              </div>
              <Stethoscope className="w-10 h-10 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Patient */}
      <Card className="mb-6 border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-blue-600" />
            Joriy bemor
          </CardTitle>
        </CardHeader>
        <CardContent>
          {appointments[currentQueue - 1] ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-xl">{appointments[currentQueue - 1].patientName}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Navbat #{appointments[currentQueue - 1].queueNumber} • {appointments[currentQueue - 1].time}
                  </p>
                  {appointments[currentQueue - 1].symptoms && (
                    <p className="text-sm text-gray-600 mt-2">
                      <span className="font-medium">Shikoyat:</span> {appointments[currentQueue - 1].symptoms}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-blue-600">
                    #{appointments[currentQueue - 1].queueNumber}
                  </div>
                </div>
              </div>
              <Button onClick={handleNextPatient} className="w-full">
                Keyingi bemor
              </Button>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">Barcha bemorlar ko'rib chiqildi</p>
          )}
        </CardContent>
      </Card>

      {/* Today's Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Bugungi navbatlar</CardTitle>
          <CardDescription>Barcha bugungi uchrashuvlar ro'yxati</CardDescription>
        </CardHeader>
        <CardContent>
          {appointments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Bugun navbatlar yo'q</p>
          ) : (
            <div className="space-y-3">
              {appointments.map((appointment, index) => (
                <div
                  key={appointment.id}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    index + 1 === currentQueue
                      ? 'bg-blue-50 border-blue-200'
                      : index + 1 < currentQueue
                      ? 'bg-gray-50 opacity-60'
                      : 'bg-white'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-2xl font-bold text-gray-400">
                      #{appointment.queueNumber}
                    </div>
                    <div>
                      <p className="font-medium">{appointment.patientName}</p>
                      <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {appointment.time}
                        </span>
                        {appointment.symptoms && (
                          <span className="text-gray-500">• {appointment.symptoms}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Badge
                    className={
                      index + 1 === currentQueue
                        ? 'bg-blue-100 text-blue-800'
                        : index + 1 < currentQueue
                        ? 'bg-gray-200 text-gray-600'
                        : 'bg-yellow-100 text-yellow-800'
                    }
                  >
                    {index + 1 === currentQueue ? 'Joriy' : index + 1 < currentQueue ? 'Tugatildi' : 'Navbatda'}
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

import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Calendar } from '../../components/ui/calendar';
import { Search, Star, MapPin, Clock, Calendar as CalendarIcon, AlertCircle } from 'lucide-react';
import { getDoctors, addAppointment, getNextQueueNumber } from '../../firebase/firestore';
import { Doctor } from '../../data/mockData';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';
import { seedFirestore } from '../../firebase/seedData';
import { Alert, AlertDescription } from '../../components/ui/alert';

export default function Doctors() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('all');
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const doctorsData = await getDoctors();
        
        // Agar doktorlar topilmasa, avtomatik ravishda seed qilish
        if (doctorsData.length === 0) {
          console.log('Doktorlar topilmadi, avtomatik yuklash boshlanmoqda...');
          const result = await seedFirestore();
          if (result.success) {
            // Qayta yuklash
            const newDoctorsData = await getDoctors();
            setDoctors(newDoctorsData);
            toast.success('Doktorlar muvaffaqiyatli yuklandi!');
          } else {
            toast.error('Doktorlarni yuklashda xatolik yuz berdi');
          }
        } else {
          setDoctors(doctorsData);
        }
      } catch (error) {
        console.error('Doktorlarni yuklashda xatolik:', error);
        toast.error('Doktorlarni yuklashda xatolik yuz berdi');
      } finally {
        setLoading(false);
      }
    };

    loadDoctors();
  }, []);

  const specializations = ['all', ...new Set(doctors.map(d => d.specialization))];
  
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialization = selectedSpecialization === 'all' || 
                                  doctor.specialization === selectedSpecialization;
    return matchesSearch && matchesSpecialization;
  });

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

  const handleBooking = async () => {
    if (!selectedDoctor || !selectedDate || !selectedTime || !user) {
      toast.error('Iltimos, barcha maydonlarni to\'ldiring');
      return;
    }

    try {
      const doctor = doctors.find(d => d.id === selectedDoctor);
      if (!doctor) {
        toast.error('Doktor topilmadi');
        return;
      }

      const dateStr = selectedDate.toISOString().split('T')[0];
      const queueNumber = await getNextQueueNumber(selectedDoctor, dateStr);

      await addAppointment({
        patientId: user.uid,
        patientName: user.name,
        doctorId: selectedDoctor,
        doctorName: doctor.name,
        date: dateStr,
        time: selectedTime,
        status: 'confirmed',
        queueNumber
      });

      toast.success(`Navbat tasdiqlandi! ${doctor.name} - ${selectedDate.toLocaleDateString('uz-UZ')} ${selectedTime}`);
      setIsBookingDialogOpen(false);
      setSelectedTime('');
      navigate('/patient/appointments');
    } catch (error) {
      console.error('Navbatni saqlashda xatolik:', error);
      toast.error('Navbatni saqlashda xatolik yuz berdi');
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
        <h1 className="font-bold text-3xl mb-2">Doktorlar</h1>
        <p className="text-gray-600">O'zingizga mos mutaxassisni toping{doctors.length > 0 ? ` - Jami ${doctors.length} ta mutaxassis` : ''}</p>
      </div>

      {/* Agar doktorlar topilmasa, ogohlantirish */}
      {doctors.length === 0 && (
        <Alert className="mb-6 border-yellow-500 bg-yellow-50">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            Hozircha doktorlar mavjud emas. Tizim avtomatik ravishda doktorlarni yuklashga urinmoqda. 
            Agar muammo davom etsa, administratorga murojaat qiling yoki{' '}
            <a href="/setup" className="underline font-medium">sozlamalar sahifasiga</a> o'ting.
          </AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Doktor yoki mutaxassislik bo'yicha qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={selectedSpecialization} onValueChange={setSelectedSpecialization}>
          <SelectTrigger className="w-full md:w-[240px]">
            <SelectValue placeholder="Mutaxassislik" />
          </SelectTrigger>
          <SelectContent>
            {specializations.map(spec => (
              <SelectItem key={spec} value={spec}>
                {spec === 'all' ? 'Barchasi' : spec}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Doctors List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doctor) => (
          <Card key={doctor.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start gap-4">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div className="flex-1">
                  <CardTitle className="text-lg">{doctor.name}</CardTitle>
                  <Badge variant="secondary" className="mt-1">
                    {doctor.specialization}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">{doctor.bio}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="font-medium">{doctor.rating}</span>
                  <span className="text-gray-500">• {doctor.experience} yillik tajriba</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{doctor.floor}-qavat, {doctor.room}-xona</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{doctor.workHours}</span>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-600 mb-1">Ish kunlari:</p>
                <div className="flex flex-wrap gap-1">
                  {doctor.workDays.map(day => (
                    <Badge key={day} variant="outline" className="text-xs">
                      {day}
                    </Badge>
                  ))}
                </div>
              </div>

              <Dialog 
                open={isBookingDialogOpen && selectedDoctor === doctor.id} 
                onOpenChange={(open) => {
                  setIsBookingDialogOpen(open);
                  if (open) setSelectedDoctor(doctor.id);
                }}
              >
                <DialogTrigger asChild>
                  <Button className="w-full" onClick={() => setSelectedDoctor(doctor.id)}>
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    Navbatga yozilish
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Navbatga yozilish - {doctor.name}</DialogTitle>
                    <DialogDescription>
                      O'zingizga qulay sanani va vaqtni tanlang
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid md:grid-cols-2 gap-6 py-4">
                    <div>
                      <Label className="mb-2 block">Sanani tanlang</Label>
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => date < new Date()}
                        className="rounded-md border"
                      />
                    </div>
                    <div>
                      <Label className="mb-2 block">Vaqtni tanlang</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {timeSlots.map((time) => (
                          <Button
                            key={time}
                            variant={selectedTime === time ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSelectedTime(time)}
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleBooking} className="flex-1">
                      Tasdiqlash
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsBookingDialogOpen(false)}
                    >
                      Bekor qilish
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDoctors.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Doktor topilmadi</p>
        </div>
      )}
    </div>
  );
}
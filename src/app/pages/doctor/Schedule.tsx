import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Calendar, Clock, Users } from 'lucide-react';
import { appointments } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';

export default function Schedule() {
  const { user } = useAuth();

  // Group appointments by date
  const myAppointments = appointments.filter(apt => apt.doctorName === user?.name);
  const groupedByDate = myAppointments.reduce((acc, apt) => {
    if (!acc[apt.date]) {
      acc[apt.date] = [];
    }
    acc[apt.date].push(apt);
    return acc;
  }, {} as Record<string, typeof appointments>);

  const getWeekDay = (dateStr: string) => {
    const days = ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'];
    const date = new Date(dateStr);
    return days[date.getDay()];
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-bold text-3xl mb-2">Ish grafigi</h1>
        <p className="text-gray-600">Barcha navbatlaringizni ko'ring</p>
      </div>

      {/* Statistics */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Jami navbatlar</p>
                <p className="text-3xl font-bold mt-1">{myAppointments.length}</p>
              </div>
              <Calendar className="w-10 h-10 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Bugun</p>
                <p className="text-3xl font-bold mt-1">
                  {myAppointments.filter(apt => apt.date === '2026-04-15').length}
                </p>
              </div>
              <Clock className="w-10 h-10 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Kunlik o'rtacha</p>
                <p className="text-3xl font-bold mt-1">
                  {Math.round(myAppointments.length / Object.keys(groupedByDate).length)}
                </p>
              </div>
              <Users className="w-10 h-10 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Schedule by Date */}
      <div className="space-y-6">
        {Object.keys(groupedByDate)
          .sort()
          .map((date) => {
            const dateAppointments = groupedByDate[date];
            const isToday = date === '2026-04-15';

            return (
              <Card key={date} className={isToday ? 'border-blue-200 bg-blue-50' : ''}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        {new Date(date).toLocaleDateString('uz-UZ', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {getWeekDay(date)} • {dateAppointments.length} ta bemor
                      </CardDescription>
                    </div>
                    {isToday && (
                      <Badge className="bg-blue-600">Bugun</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dateAppointments
                      .sort((a, b) => a.time.localeCompare(b.time))
                      .map((appointment) => (
                        <div
                          key={appointment.id}
                          className="flex items-center justify-between p-4 rounded-lg border bg-white"
                        >
                          <div className="flex items-center gap-4">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-blue-600">
                                #{appointment.queueNumber}
                              </div>
                              <div className="text-xs text-gray-500">Navbat</div>
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
                </CardContent>
              </Card>
            );
          })}
      </div>

      {myAppointments.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            Navbatlar yo'q
          </CardContent>
        </Card>
      )}
    </div>
  );
}

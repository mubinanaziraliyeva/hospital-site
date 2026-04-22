import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Phone, Mail, MapPin, Clock, AlertCircle, Building2 } from 'lucide-react';
import { hospitalInfo, doctors, rooms } from '../../data/mockData';

export default function Hospital() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-bold text-3xl mb-2">{hospitalInfo.name}</h1>
        <p className="text-gray-600">{hospitalInfo.description}</p>
      </div>

      {/* Contact Info */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-blue-600 mt-1" />
              <div>
                <p className="font-medium mb-1">Manzil</p>
                <p className="text-sm text-gray-600">{hospitalInfo.address}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-green-600 mt-1" />
              <div>
                <p className="font-medium mb-1">Telefon</p>
                <p className="text-sm text-gray-600">{hospitalInfo.phone}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-purple-600 mt-1" />
              <div>
                <p className="font-medium mb-1">Email</p>
                <p className="text-sm text-gray-600">{hospitalInfo.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-red-50 border-red-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-1" />
              <div>
                <p className="font-medium mb-1 text-red-900">Tez yordam</p>
                <p className="text-sm text-red-700 font-bold">{hospitalInfo.emergency}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Working Hours */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Ish vaqti
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg">{hospitalInfo.workingHours}</p>
          <p className="text-sm text-gray-600 mt-2">Yakshanba: Dam olish kuni</p>
        </CardContent>
      </Card>

      {/* Floors and Departments */}
      <div className="mb-8">
        <h2 className="font-bold text-2xl mb-4">Qavatlar va bo'limlar</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {hospitalInfo.floors.map((floor) => (
            <Card key={floor.number}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  {floor.number}-qavat
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {floor.departments.map((dept) => (
                    <Badge key={dept} variant="secondary" className="mr-2">
                      {dept}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Room Map */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Xonalar xaritasi</CardTitle>
          <CardDescription>Doktorlar qaysi xonalarda joylashgan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {[3, 2, 1].map((floorNum) => (
              <div key={floorNum}>
                <h3 className="font-medium text-lg mb-3">{floorNum}-qavat</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {rooms
                    .filter(room => room.floor === floorNum)
                    .map((room) => {
                      const doctor = doctors.find(d => d.id === room.doctorId);
                      return (
                        <Card 
                          key={room.id}
                          className={`${
                            room.status === 'occupied' ? 'bg-green-50 border-green-200' :
                            room.status === 'maintenance' ? 'bg-red-50 border-red-200' :
                            'bg-gray-50'
                          }`}
                        >
                          <CardContent className="p-4">
                            <div className="text-center">
                              <p className="font-bold text-lg mb-1">{room.number}</p>
                              {doctor ? (
                                <>
                                  <p className="text-xs font-medium truncate">{doctor.name}</p>
                                  <p className="text-xs text-gray-600">{doctor.specialization}</p>
                                </>
                              ) : (
                                <p className="text-xs text-gray-500">
                                  {room.status === 'maintenance' ? 'Ta\'mirlash' : 'Bo\'sh'}
                                </p>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle>Belgilar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
              <span className="text-sm">Band</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-100 border border-gray-200 rounded"></div>
              <span className="text-sm">Bo'sh</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-100 border border-red-200 rounded"></div>
              <span className="text-sm">Ta'mirlash</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

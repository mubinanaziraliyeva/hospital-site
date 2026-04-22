import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Building2, DoorOpen, Wrench, CheckCircle } from 'lucide-react';
import { subscribeToRooms, subscribeToDoctors, updateRoom } from '../../firebase/firestore';
import { Room, Doctor } from '../../data/mockData';
import { toast } from 'sonner';

export default function AdminRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFloor, setSelectedFloor] = useState<number | 'all'>('all');

  useEffect(() => {
    // Real-time listeners
    const unsubscribeRooms = subscribeToRooms((roomsData) => {
      setRooms(roomsData);
      setLoading(false);
    });
    const unsubscribeDoctors = subscribeToDoctors(setDoctors);

    return () => {
      unsubscribeRooms();
      unsubscribeDoctors();
    };
  }, []);

  const filteredRooms = selectedFloor === 'all' 
    ? rooms 
    : rooms.filter(r => r.floor === selectedFloor);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'occupied': return 'bg-green-100 text-green-800 border-green-200';
      case 'available': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'maintenance': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'occupied': return <CheckCircle className="w-4 h-4" />;
      case 'available': return <DoorOpen className="w-4 h-4" />;
      case 'maintenance': return <Wrench className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'occupied': return 'Band';
      case 'available': return 'Bo\'sh';
      case 'maintenance': return 'Ta\'mirlash';
      default: return status;
    }
  };

  const handleStatusChange = async (roomId: string, newStatus: 'available' | 'occupied' | 'maintenance') => {
    try {
      await updateRoom(roomId, { status: newStatus });
      toast.success('Xona holati yangilandi');
    } catch (error) {
      console.error('Update room status error:', error);
      toast.error('Xona holatini yangilashda xatolik yuz berdi');
    }
  };

  const handleAssignDoctor = async (roomId: string, doctorId: string | null) => {
    try {
      await updateRoom(roomId, { 
        doctorId, 
        status: doctorId ? 'occupied' : 'available' 
      });
      toast.success(doctorId ? 'Doktor tayinlandi' : 'Doktor olib tashlandi');
    } catch (error) {
      console.error('Assign doctor error:', error);
      toast.error('Doktorni tayinlashda xatolik yuz berdi');
    }
  };

  const stats = {
    total: rooms.length,
    occupied: rooms.filter(r => r.status === 'occupied').length,
    available: rooms.filter(r => r.status === 'available').length,
    maintenance: rooms.filter(r => r.status === 'maintenance').length
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
        <h1 className="font-bold text-3xl mb-2">Xonalarni boshqarish</h1>
        <p className="text-gray-600">Xonalar holatini nazorat qiling va doktorlarni tayinlang</p>
      </div>

      {/* Statistics */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Jami xonalar</p>
                <p className="text-3xl font-bold mt-1">{stats.total}</p>
              </div>
              <Building2 className="w-10 h-10 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Band</p>
                <p className="text-3xl font-bold mt-1 text-green-600">{stats.occupied}</p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Bo'sh</p>
                <p className="text-3xl font-bold mt-1 text-gray-600">{stats.available}</p>
              </div>
              <DoorOpen className="w-10 h-10 text-gray-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ta'mirlash</p>
                <p className="text-3xl font-bold mt-1 text-red-600">{stats.maintenance}</p>
              </div>
              <Wrench className="w-10 h-10 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Qavat:</label>
          <Select 
            value={String(selectedFloor)} 
            onValueChange={(v) => setSelectedFloor(v === 'all' ? 'all' : parseInt(v))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Barchasi</SelectItem>
              <SelectItem value="1">1-qavat</SelectItem>
              <SelectItem value="2">2-qavat</SelectItem>
              <SelectItem value="3">3-qavat</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Rooms by Floor */}
      <div className="space-y-8">
        {[3, 2, 1]
          .filter(floor => selectedFloor === 'all' || selectedFloor === floor)
          .map((floorNum) => {
            const floorRooms = rooms.filter(r => r.floor === floorNum);
            return (
              <div key={floorNum}>
                <h2 className="font-bold text-2xl mb-4 flex items-center gap-2">
                  <Building2 className="w-6 h-6" />
                  {floorNum}-qavat
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {floorRooms.map((room) => {
                    const doctor = room.doctorId ? doctors.find(d => d.id === room.doctorId) : null;
                    return (
                      <Card 
                        key={room.id}
                        className={`border-2 ${getStatusColor(room.status)}`}
                      >
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-2xl">Xona {room.number}</CardTitle>
                            <Badge className={getStatusColor(room.status)}>
                              <span className="flex items-center gap-1">
                                {getStatusIcon(room.status)}
                                {getStatusText(room.status)}
                              </span>
                            </Badge>
                          </div>
                          <CardDescription>{floorNum}-qavat</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {doctor && (
                            <div className="p-3 bg-white rounded-lg border">
                              <div className="flex items-center gap-3">
                                <img
                                  src={doctor.image}
                                  alt={doctor.name}
                                  className="w-12 h-12 rounded-full object-cover"
                                />
                                <div>
                                  <p className="font-medium">{doctor.name}</p>
                                  <p className="text-sm text-gray-600">{doctor.specialization}</p>
                                </div>
                              </div>
                            </div>
                          )}

                          <div>
                            <label className="text-sm font-medium mb-2 block">Holat</label>
                            <Select 
                              value={room.status} 
                              onValueChange={(v) => handleStatusChange(room.id, v as any)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="available">Bo'sh</SelectItem>
                                <SelectItem value="occupied">Band</SelectItem>
                                <SelectItem value="maintenance">Ta'mirlash</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <label className="text-sm font-medium mb-2 block">Doktor</label>
                            <Select 
                              value={room.doctorId || 'none'} 
                              onValueChange={(v) => handleAssignDoctor(room.id, v === 'none' ? null : v)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Doktor tanlang" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">Yo'q</SelectItem>
                                {doctors.map(doc => (
                                  <SelectItem key={doc.id} value={doc.id}>
                                    {doc.name} - {doc.specialization}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
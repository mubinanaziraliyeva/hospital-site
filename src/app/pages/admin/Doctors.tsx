import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Plus, Edit, Trash2, Star, MapPin, AlertCircle, RefreshCw } from 'lucide-react';
import { Doctor } from '../../data/mockData';
import { subscribeToDoctors, addDoctor, updateDoctor, deleteDoctor } from '../../firebase/firestore';
import { seedFirestore } from '../../firebase/seedData';
import { toast } from 'sonner';

export default function AdminDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    experience: '',
    room: '',
    floor: '',
    workHours: '',
    bio: ''
  });

  const specializations = ['Kardiolog', 'Stomatolog', 'Nevrolog', 'Pediatr', 'Terapevt', 'Jarroh'];

  useEffect(() => {
    // Real-time listener for doctors
    const unsubscribe = subscribeToDoctors((doctorsData) => {
      setDoctors(doctorsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSeedData = async () => {
    setLoading(true);
    try {
      const result = await seedFirestore();
      if (result.success) {
        toast.success('Doktorlar muvaffaqiyatli yuklandi!');
      } else {
        toast.error('Doktorlarni yuklashda xatolik yuz berdi');
      }
    } catch (error) {
      console.error('Seed error:', error);
      toast.error('Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddDoctor = async () => {
    if (!formData.name || !formData.specialization) {
      toast.error('Iltimos, barcha maydonlarni to\'ldiring');
      return;
    }

    try {
      const newDoctor: Omit<Doctor, 'id'> = {
        name: formData.name,
        specialization: formData.specialization,
        experience: parseInt(formData.experience) || 0,
        rating: 5.0,
        image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop',
        room: formData.room,
        floor: parseInt(formData.floor) || 1,
        workDays: ['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma'],
        workHours: formData.workHours || '09:00 - 17:00',
        bio: formData.bio
      };

      await addDoctor(newDoctor);
      setIsAddDialogOpen(false);
      setFormData({ name: '', specialization: '', experience: '', room: '', floor: '', workHours: '', bio: '' });
      toast.success('Doktor qo\'shildi');
    } catch (error) {
      console.error('Add doctor error:', error);
      toast.error('Doktorni qo\'shishda xatolik yuz berdi');
    }
  };

  const handleDeleteDoctor = async (id: string) => {
    try {
      await deleteDoctor(id);
      toast.success('Doktor o\'chirildi');
    } catch (error) {
      console.error('Delete doctor error:', error);
      toast.error('Doktorni o\'chirishda xatolik yuz berdi');
    }
  };

  const handleEditDoctor = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    setFormData({
      name: doctor.name,
      specialization: doctor.specialization,
      experience: String(doctor.experience),
      room: doctor.room,
      floor: String(doctor.floor),
      workHours: doctor.workHours,
      bio: doctor.bio
    });
  };

  const handleUpdateDoctor = async () => {
    if (!editingDoctor) return;

    try {
      const updatedData: Partial<Doctor> = {
        name: formData.name,
        specialization: formData.specialization,
        experience: parseInt(formData.experience) || 0,
        room: formData.room,
        floor: parseInt(formData.floor) || 1,
        workHours: formData.workHours,
        bio: formData.bio
      };

      await updateDoctor(editingDoctor.id, updatedData);
      setEditingDoctor(null);
      setFormData({ name: '', specialization: '', experience: '', room: '', floor: '', workHours: '', bio: '' });
      toast.success('Doktor ma\'lumotlari yangilandi');
    } catch (error) {
      console.error('Update doctor error:', error);
      toast.error('Ma\'lumotlarni yangilashda xatolik yuz berdi');
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-bold text-3xl mb-2">Doktorlarni boshqarish</h1>
          <p className="text-gray-600">Xodimlarni qo'shish, tahrirlash va o'chirish</p>
        </div>
        
        <div className="flex gap-2">
          {doctors.length === 0 && (
            <Button onClick={handleSeedData} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Dastlabki ma'lumotlarni yuklash
            </Button>
          )}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Yangi doktor
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Yangi doktor qo'shish</DialogTitle>
                <DialogDescription>Doktor ma'lumotlarini kiriting</DialogDescription>
              </DialogHeader>
              <div className="grid md:grid-cols-2 gap-4 py-4">
                <div>
                  <Label>Ism-familiya</Label>
                  <Input
                    placeholder="Dr. Ism Familiya"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Mutaxassislik</Label>
                  <Select value={formData.specialization} onValueChange={(v) => handleInputChange('specialization', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      {specializations.map(spec => (
                        <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Tajriba (yil)</Label>
                  <Input
                    type="number"
                    placeholder="10"
                    value={formData.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Xona raqami</Label>
                  <Input
                    placeholder="201"
                    value={formData.room}
                    onChange={(e) => handleInputChange('room', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Qavat</Label>
                  <Select value={formData.floor} onValueChange={(v) => handleInputChange('floor', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1-qavat</SelectItem>
                      <SelectItem value="2">2-qavat</SelectItem>
                      <SelectItem value="3">3-qavat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Ish vaqti</Label>
                  <Input
                    placeholder="09:00 - 17:00"
                    value={formData.workHours}
                    onChange={(e) => handleInputChange('workHours', e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>Qisqacha ma'lumot</Label>
                  <Input
                    placeholder="Mutaxassislik haqida qisqacha"
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddDoctor} className="flex-1">
                  Qo'shish
                </Button>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Bekor qilish
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* No doctors alert */}
      {doctors.length === 0 && (
        <Alert className="mb-6 border-yellow-500 bg-yellow-50">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            Hozircha doktorlar mavjud emas. "Dastlabki ma'lumotlarni yuklash" tugmasini bosing yoki yangi doktor qo'shing.
          </AlertDescription>
        </Alert>
      )}

      {/* Statistics */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Jami doktorlar</p>
            <p className="text-3xl font-bold mt-1">{doctors.length}</p>
          </CardContent>
        </Card>
        {specializations.slice(0, 3).map(spec => (
          <Card key={spec}>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600">{spec}</p>
              <p className="text-3xl font-bold mt-1">
                {doctors.filter(d => d.specialization === spec).length}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Doctors Table */}
      <Card>
        <CardHeader>
          <CardTitle>Barcha doktorlar</CardTitle>
          <CardDescription>Barcha xodimlar ro'yxati</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Doktor</TableHead>
                <TableHead>Mutaxassislik</TableHead>
                <TableHead>Tajriba</TableHead>
                <TableHead>Xona</TableHead>
                <TableHead>Reyting</TableHead>
                <TableHead>Ish vaqti</TableHead>
                <TableHead className="text-right">Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {doctors.map((doctor) => (
                <TableRow key={doctor.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={doctor.image}
                        alt={doctor.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium">{doctor.name}</p>
                        <p className="text-sm text-gray-500">{doctor.bio}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{doctor.specialization}</Badge>
                  </TableCell>
                  <TableCell>{doctor.experience} yil</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <MapPin className="w-3 h-3" />
                      {doctor.floor}-qavat, {doctor.room}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      {doctor.rating}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{doctor.workHours}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Dialog open={editingDoctor?.id === doctor.id} onOpenChange={(open) => {
                        if (!open) setEditingDoctor(null);
                      }}>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditDoctor(doctor)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Doktor ma'lumotlarini tahrirlash</DialogTitle>
                            <DialogDescription>O'zgarishlarni kiriting</DialogDescription>
                          </DialogHeader>
                          <div className="grid md:grid-cols-2 gap-4 py-4">
                            <div>
                              <Label>Ism-familiya</Label>
                              <Input
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                              />
                            </div>
                            <div>
                              <Label>Mutaxassislik</Label>
                              <Select value={formData.specialization} onValueChange={(v) => handleInputChange('specialization', v)}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {specializations.map(spec => (
                                    <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label>Tajriba (yil)</Label>
                              <Input
                                type="number"
                                value={formData.experience}
                                onChange={(e) => handleInputChange('experience', e.target.value)}
                              />
                            </div>
                            <div>
                              <Label>Xona raqami</Label>
                              <Input
                                value={formData.room}
                                onChange={(e) => handleInputChange('room', e.target.value)}
                              />
                            </div>
                            <div>
                              <Label>Qavat</Label>
                              <Select value={formData.floor} onValueChange={(v) => handleInputChange('floor', v)}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">1-qavat</SelectItem>
                                    <SelectItem value="2">2-qavat</SelectItem>
                                    <SelectItem value="3">3-qavat</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label>Ish vaqti</Label>
                              <Input
                                value={formData.workHours}
                                onChange={(e) => handleInputChange('workHours', e.target.value)}
                              />
                            </div>
                            <div className="md:col-span-2">
                              <Label>Qisqacha ma'lumot</Label>
                              <Input
                                value={formData.bio}
                                onChange={(e) => handleInputChange('bio', e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button onClick={handleUpdateDoctor} className="flex-1">
                              Saqlash
                            </Button>
                            <Button variant="outline" onClick={() => setEditingDoctor(null)}>
                              Bekor qilish
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteDoctor(doctor.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
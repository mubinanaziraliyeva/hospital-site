export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  experience: number;
  rating: number;
  image: string;
  room: string;
  floor: number;
  workDays: string[];
  workHours: string;
  bio: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  queueNumber: number;
  symptoms?: string;
}

export interface Room {
  id: string;
  number: string;
  floor: number;
  doctorId: string | null;
  status: 'available' | 'occupied' | 'maintenance';
}

export const doctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Farrux Rahimov',
    specialization: 'Kardiolog',
    experience: 15,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop',
    room: '201',
    floor: 2,
    workDays: ['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma'],
    workHours: '09:00 - 17:00',
    bio: '15 yillik tajribaga ega yurak kasalliklari mutaxassisi'
  },
  {
    id: '2',
    name: 'Dr. Nodira Karimova',
    specialization: 'Stomatolog',
    experience: 10,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop',
    room: '105',
    floor: 1,
    workDays: ['Dushanba', 'Chorshanba', 'Juma', 'Shanba'],
    workHours: '10:00 - 18:00',
    bio: 'Tish kasalliklari bo\'yicha malakali mutaxassis'
  },
  {
    id: '3',
    name: 'Dr. Aziz Tursunov',
    specialization: 'Nevrolog',
    experience: 12,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop',
    room: '305',
    floor: 3,
    workDays: ['Seshanba', 'Chorshanba', 'Payshanba', 'Juma'],
    workHours: '08:00 - 16:00',
    bio: 'Asab tizimi kasalliklari mutaxassisi'
  },
  {
    id: '4',
    name: 'Dr. Dilnoza Ahmedova',
    specialization: 'Pediatr',
    experience: 8,
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop',
    room: '102',
    floor: 1,
    workDays: ['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'],
    workHours: '09:00 - 15:00',
    bio: 'Bolalar shifokori, 8 yillik tajriba'
  },
  {
    id: '5',
    name: 'Dr. Bobur Rashidov',
    specialization: 'Terapevt',
    experience: 20,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop',
    room: '203',
    floor: 2,
    workDays: ['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma'],
    workHours: '08:00 - 17:00',
    bio: 'Umumiy amaliyot shifokori, 20 yillik tajriba'
  }
];

export const appointments: Appointment[] = [
  {
    id: '1',
    patientId: '1',
    patientName: 'Javohir Karimov',
    doctorId: '1',
    doctorName: 'Dr. Farrux Rahimov',
    date: '2026-04-16',
    time: '10:00',
    status: 'confirmed',
    queueNumber: 3,
    symptoms: 'Yurak og\'rig\'i'
  },
  {
    id: '2',
    patientId: '2',
    patientName: 'Gulnora Salimova',
    doctorId: '2',
    doctorName: 'Dr. Nodira Karimova',
    date: '2026-04-15',
    time: '14:00',
    status: 'pending',
    queueNumber: 1
  },
  {
    id: '3',
    patientId: '3',
    patientName: 'Alisher Yusupov',
    doctorId: '3',
    doctorName: 'Dr. Aziz Tursunov',
    date: '2026-04-15',
    time: '15:30',
    status: 'pending',
    queueNumber: 2
  }
];

export const rooms: Room[] = [
  { id: '1', number: '101', floor: 1, doctorId: null, status: 'available' },
  { id: '2', number: '102', floor: 1, doctorId: '4', status: 'occupied' },
  { id: '3', number: '103', floor: 1, doctorId: null, status: 'available' },
  { id: '4', number: '104', floor: 1, doctorId: null, status: 'maintenance' },
  { id: '5', number: '105', floor: 1, doctorId: '2', status: 'occupied' },
  { id: '6', number: '201', floor: 2, doctorId: '1', status: 'occupied' },
  { id: '7', number: '202', floor: 2, doctorId: null, status: 'available' },
  { id: '8', number: '203', floor: 2, doctorId: '5', status: 'occupied' },
  { id: '9', number: '204', floor: 2, doctorId: null, status: 'available' },
  { id: '10', number: '301', floor: 3, doctorId: null, status: 'available' },
  { id: '11', number: '302', floor: 3, doctorId: null, status: 'available' },
  { id: '12', number: '305', floor: 3, doctorId: '3', status: 'occupied' }
];

export const hospitalInfo = {
  name: 'Sog\'lom Hayot Shifoxonasi',
  address: 'Toshkent sh., Yunusobod tumani, Amir Temur ko\'chasi 108',
  phone: '+998 71 123 45 67',
  email: 'info@soglomlkhayot.uz',
  workingHours: 'Dushanba - Shanba: 08:00 - 20:00',
  emergency: '+998 71 103',
  description: 'Zamonaviy uskunalar bilan jihozlangan ko\'p tarmoqli shifoxona. Bizda yuqori malakali mutaxassislar ishlaydi.',
  floors: [
    { number: 1, departments: ['Stomatologiya', 'Pediatriya', 'Qabul xonasi'] },
    { number: 2, departments: ['Kardiologiya', 'Terapiya', 'Diagnostika'] },
    { number: 3, departments: ['Nevrologiya', 'Laboratoriya', 'Operatsiya xonalari'] }
  ]
};

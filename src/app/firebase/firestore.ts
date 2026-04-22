import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  QuerySnapshot,
  DocumentData
} from 'firebase/firestore';
import { db } from './config';
import { Doctor, Appointment, Room } from '../data/mockData';

// ============= DOCTORS =============

export const getDoctors = async (): Promise<Doctor[]> => {
  const querySnapshot = await getDocs(collection(db, 'doctors'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Doctor));
};

export const getDoctorById = async (id: string): Promise<Doctor | null> => {
  const docRef = doc(db, 'doctors', id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Doctor : null;
};

export const addDoctor = async (doctor: Omit<Doctor, 'id'>): Promise<string> => {
  const docRef = await addDoc(collection(db, 'doctors'), doctor);
  return docRef.id;
};

export const updateDoctor = async (id: string, doctor: Partial<Doctor>): Promise<void> => {
  const docRef = doc(db, 'doctors', id);
  await updateDoc(docRef, doctor as any);
};

export const deleteDoctor = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, 'doctors', id));
};

// Real-time doctors listener
export const subscribeToDoctors = (callback: (doctors: Doctor[]) => void) => {
  return onSnapshot(collection(db, 'doctors'), (snapshot: QuerySnapshot<DocumentData>) => {
    const doctors = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Doctor));
    callback(doctors);
  });
};

// ============= APPOINTMENTS =============

export const getAppointments = async (): Promise<Appointment[]> => {
  const querySnapshot = await getDocs(collection(db, 'appointments'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Appointment));
};

export const getAppointmentsByPatient = async (patientId: string): Promise<Appointment[]> => {
  const q = query(
    collection(db, 'appointments'),
    where('patientId', '==', patientId)
  );
  const querySnapshot = await getDocs(q);
  const appointments = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Appointment));
  // Sort by date on client side to avoid composite index requirement
  return appointments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const getAppointmentsByDoctor = async (doctorId: string): Promise<Appointment[]> => {
  const q = query(
    collection(db, 'appointments'),
    where('doctorId', '==', doctorId)
  );
  const querySnapshot = await getDocs(q);
  const appointments = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Appointment));
  // Sort by date on client side to avoid composite index requirement
  return appointments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const getAppointmentsByDate = async (date: string): Promise<Appointment[]> => {
  const q = query(
    collection(db, 'appointments'),
    where('date', '==', date)
  );
  const querySnapshot = await getDocs(q);
  const appointments = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Appointment));
  // Sort by time on client side to avoid composite index requirement
  return appointments.sort((a, b) => a.time.localeCompare(b.time));
};

export const addAppointment = async (appointment: Omit<Appointment, 'id'>): Promise<string> => {
  const docRef = await addDoc(collection(db, 'appointments'), appointment);
  return docRef.id;
};

export const updateAppointment = async (id: string, appointment: Partial<Appointment>): Promise<void> => {
  const docRef = doc(db, 'appointments', id);
  await updateDoc(docRef, appointment as any);
};

export const deleteAppointment = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, 'appointments', id));
};

// Real-time appointments listener for patient
export const subscribeToPatientAppointments = (patientId: string, callback: (appointments: Appointment[]) => void) => {
  const q = query(
    collection(db, 'appointments'),
    where('patientId', '==', patientId)
  );
  return onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
    const appointments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Appointment));
    callback(appointments);
  });
};

// Real-time appointments listener for doctor
export const subscribeToDoctorAppointments = (doctorId: string, callback: (appointments: Appointment[]) => void) => {
  const q = query(
    collection(db, 'appointments'),
    where('doctorId', '==', doctorId)
  );
  return onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
    const appointments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Appointment));
    callback(appointments);
  });
};

// Real-time all appointments listener (for admin)
export const subscribeToAllAppointments = (callback: (appointments: Appointment[]) => void) => {
  return onSnapshot(collection(db, 'appointments'), (snapshot: QuerySnapshot<DocumentData>) => {
    const appointments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Appointment));
    callback(appointments);
  });
};

// ============= ROOMS =============

export const getRooms = async (): Promise<Room[]> => {
  const querySnapshot = await getDocs(collection(db, 'rooms'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Room));
};

export const getRoomsByFloor = async (floor: number): Promise<Room[]> => {
  const q = query(
    collection(db, 'rooms'),
    where('floor', '==', floor)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Room));
};

export const addRoom = async (room: Omit<Room, 'id'>): Promise<string> => {
  const docRef = await addDoc(collection(db, 'rooms'), room);
  return docRef.id;
};

export const updateRoom = async (id: string, room: Partial<Room>): Promise<void> => {
  const docRef = doc(db, 'rooms', id);
  await updateDoc(docRef, room as any);
};

export const deleteRoom = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, 'rooms', id));
};

// Real-time rooms listener
export const subscribeToRooms = (callback: (rooms: Room[]) => void) => {
  return onSnapshot(collection(db, 'rooms'), (snapshot: QuerySnapshot<DocumentData>) => {
    const rooms = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Room));
    callback(rooms);
  });
};

// ============= UTILITY =============

// Get queue number for new appointment
export const getNextQueueNumber = async (doctorId: string, date: string): Promise<number> => {
  const appointments = await getAppointmentsByDate(date);
  const doctorAppointments = appointments.filter(apt => apt.doctorId === doctorId);
  return doctorAppointments.length + 1;
};

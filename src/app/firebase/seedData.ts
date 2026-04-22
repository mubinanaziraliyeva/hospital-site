import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from './config';
import { doctors, rooms } from '../data/mockData';

// Bu funksiya Firebase ga dastlabki ma'lumotlarni yuklash uchun
// Faqat birinchi marta ishlatiladi
export const seedFirestore = async () => {
  try {
    // Check if doctors already exist
    const doctorsSnapshot = await getDocs(collection(db, 'doctors'));
    if (doctorsSnapshot.empty) {
      console.log('Doktorlarni yuklash...');
      for (const doctor of doctors) {
        const { id, ...doctorData } = doctor;
        await addDoc(collection(db, 'doctors'), doctorData);
      }
      console.log('Doktorlar yuklandi!');
    } else {
      console.log('Doktorlar allaqachon mavjud');
    }

    // Check if rooms already exist
    const roomsSnapshot = await getDocs(collection(db, 'rooms'));
    if (roomsSnapshot.empty) {
      console.log('Xonalarni yuklash...');
      for (const room of rooms) {
        const { id, ...roomData } = room;
        await addDoc(collection(db, 'rooms'), roomData);
      }
      console.log('Xonalar yuklandi!');
    } else {
      console.log('Xonalar allaqachon mavjud');
    }

    return { success: true };
  } catch (error) {
    console.error('Ma\'lumotlarni yuklashda xatolik:', error);
    return { success: false, error };
  }
};

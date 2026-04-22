import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './config';
import { UserRole } from '../contexts/AuthContext';

export interface UserData {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  specialization?: string;
  experience?: number;
  room?: string;
  floor?: number;
  createdAt: Date;
}

// Ro'yxatdan o'tish (faqat bemorlar uchun)
export const registerUser = async (
  email: string,
  password: string,
  name: string,
  phone: string
): Promise<UserData> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Bemor ma'lumotlarini Firestore ga saqlash
    const userData: UserData = {
      uid: user.uid,
      email: user.email!,
      name,
      phone,
      role: 'patient',
      createdAt: new Date()
    };

    await setDoc(doc(db, 'users', user.uid), userData);

    return userData;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Kirish
export const loginUser = async (email: string, password: string): Promise<UserData> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Foydalanuvchi ma'lumotlarini olish
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (!userDoc.exists()) {
      throw new Error('Foydalanuvchi ma\'lumotlari topilmadi');
    }

    return userDoc.data() as UserData;
  } catch (error: any) {
    if (error.code === 'auth/invalid-credential') {
      throw new Error('Email yoki parol noto\'g\'ri');
    }
    throw new Error(error.message);
  }
};

// Chiqish
export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Joriy foydalanuvchini olish
export const getCurrentUser = (callback: (user: UserData | null) => void) => {
  return onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
    if (firebaseUser) {
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (userDoc.exists()) {
        callback(userDoc.data() as UserData);
      } else {
        callback(null);
      }
    } else {
      callback(null);
    }
  });
};

// Admin yoki doktor yaratish (faqat admin tomonidan)
export const createStaffUser = async (
  email: string,
  password: string,
  userData: Omit<UserData, 'uid' | 'email' | 'createdAt'>
): Promise<UserData> => {
  try {
    // MUHIM: Bu funksiya foydalanuvchini logout qilib qo'yadi
    // Chunki createUserWithEmailAndPassword avtomatik login qiladi
    // Real loyihada bu backend da amalga oshirilishi kerak (Firebase Admin SDK)
    
    // Hozirgi foydalanuvchini eslab qolish
    const currentUser = auth.currentUser;
    
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const fullUserData: UserData = {
      uid: user.uid,
      email: user.email!,
      ...userData,
      createdAt: new Date()
    };

    await setDoc(doc(db, 'users', user.uid), fullUserData);
    
    // Yangi foydalanuvchidan chiqish (admin qaytadan login bo'lishi uchun)
    await firebaseSignOut(auth);
    
    // Admin yana login bo'lishi kerak - lekin bu muammoli!
    // Shuning uchun biz faqat ma'lumotlarni qaytaramiz
    
    return fullUserData;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
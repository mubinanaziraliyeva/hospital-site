# Firebase Setup Yo'riqnomasi

Bu shifoxona boshqaruv tizimini Firebase bilan ishlatish uchun qadamlar.

## 1. Firebase Project yaratish

1. [Firebase Console](https://console.firebase.google.com/) ga kiring
2. "Add project" tugmasini bosing
3. Project nomini kiriting (masalan: "shifoxona-app")
4. Google Analytics ni istasangiz yoqing (ixtiyoriy)
5. "Create project" tugmasini bosing

## 2. Web App qo'shish

1. Firebase Console da yangi yaratilgan projectingizni oching
2. Chap menuda "Build" bo'limidan "Authentication" ni tanlang
3. "Get started" tugmasini bosing
4. "Sign-in method" tabidan "Email/Password" ni yoqing
5. Bosh sahifaga qayting va "Project Overview" yonidagi </> (web) belgisini bosing
6. App nickname kiriting (masalan: "shifoxona-web")
7. "Register app" tugmasini bosing
8. Firebase SDK konfiguratsiyasini ko'chirib oling

## 3. Firebase Configuration

`/src/app/firebase/config.ts` faylini oching va Firebase Console dan olgan konfiguratsiyangizni qo'ying:

```typescript
const firebaseConfig = {
  apiKey: "AIzaSy...",  // Sizning API key
  authDomain: "shifoxona-app.firebaseapp.com",
  projectId: "shifoxona-app",
  storageBucket: "shifoxona-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

## 4. Firestore Database yaratish

1. Firebase Console da chap menuda "Build" > "Firestore Database" ni tanlang
2. "Create database" tugmasini bosing
3. "Start in production mode" ni tanlang (keyinroq security rules o'rnatamiz)
4. Location tanlang (masalan: asia-south1)
5. "Enable" tugmasini bosing

## 5. Firestore Security Rules o'rnatish

1. Firestore Database sahifasida "Rules" tabini oching
2. `/firestore.rules` faylining mazmunini ko'chirib, Firebase Console ga joylashtiring
3. "Publish" tugmasini bosing

Bu security rules quyidagilarni ta'minlaydi:
- Bemorlar faqat o'z navbatlarini ko'radi
- Doktorlar faqat o'z navbatlarini ko'radi
- Adminlar hamma narsani ko'radi va boshqaradi
- Foydalanuvchilar faqat o'z rollariga tegishli sahifalarga kiradi

## 6. Demo foydalanuvchilar yaratish

Firebase Console da "Authentication" > "Users" > "Add user" orqali demo foydalanuvchilar yarating:

### Admin
- Email: admin@shifoxona.uz
- Password: admin123

Keyin Firestore Database da `users` collection yarating va quyidagi document qo'shing:
- Document ID: (Admin ning UID si)
- Fields:
  ```json
  {
    "uid": "admin_uid",
    "email": "admin@shifoxona.uz",
    "name": "Administrator",
    "role": "admin",
    "createdAt": "2026-04-16T00:00:00Z"
  }
  ```

### Doktor
- Email: doctor@shifoxona.uz
- Password: doctor123

Firestore da:
```json
{
  "uid": "doctor_uid",
  "email": "doctor@shifoxona.uz",
  "name": "Dr. Farrux Rahimov",
  "role": "doctor",
  "specialization": "Kardiolog",
  "room": "201",
  "floor": 2,
  "experience": 15,
  "createdAt": "2026-04-16T00:00:00Z"
}
```

### Bemor (ularni saytda ro'yxatdan o'tkazish mumkin)
- Email: patient@shifoxona.uz
- Password: patient123

Firestore da:
```json
{
  "uid": "patient_uid",
  "email": "patient@shifoxona.uz",
  "name": "Javohir Karimov",
  "role": "patient",
  "phone": "+998 90 123 45 67",
  "createdAt": "2026-04-16T00:00:00Z"
}
```

## 7. Dastlabki ma'lumotlarni yuklash

Loyiha ishga tushgandan so'ng, browser console da quyidagi kodni ishga tushiring:

```javascript
// Import seedData function
import { seedFirestore } from './firebase/seedData';

// Ishga tushirish
seedFirestore();
```

Bu doktorlar va xonalar haqidagi dastlabki ma'lumotlarni Firebase ga yuklaydi.

## 8. Firebase Hosting (Ixtiyoriy)

Saytni Firebase Hosting ga deploy qilish uchun:

```bash
# Firebase CLI ni o'rnatish
npm install -g firebase-tools

# Firebase ga login
firebase login

# Firebase ni ishga tushirish
firebase init

# Hosting ni tanlang
# Build papkasini: dist
# Single page app: Yes

# Build qilish
npm run build

# Deploy qilish
firebase deploy
```

## Muhim eslatmalar

### Xavfsizlik
- Production da Firebase config ma'lumotlarini environment variables da saqlang
- API keys ni ochiq GitHub repository ga yuklmang
- Firestore Security Rules ni doim tekshirib turing

### Real-time Updates
Tizimda real-time yangilanishlar yoqilgan:
- Doktor "Keyingi bemor" ni bosganda, bemorning ekranida navbat avtomatik yangilanadi
- Admin biror doktorni o'chirganda, barcha joylarda avtomatik yangilanadi
- Navbatlar, xonalar holati real-time da yangilanadi

### Rollar va Ruxsatlar
- **Bemor**: Faqat o'z navbatlarini ko'radi, doktorlar ro'yxatini ko'radi, navbatga yoziladi
- **Doktor**: Faqat o'z navbatlarini ko'radi va boshqaradi
- **Admin**: Hammasi - doktorlar, bemorlar, navbatlar, xonalarni boshqaradi

### Ma'lumotlar Strukturasi

**users** collection:
- uid (string)
- email (string)
- name (string)
- role (string): 'patient' | 'doctor' | 'admin'
- phone (string, optional)
- specialization (string, optional - doktorlar uchun)
- room (string, optional - doktorlar uchun)
- floor (number, optional - doktorlar uchun)
- experience (number, optional - doktorlar uchun)
- createdAt (timestamp)

**doctors** collection:
- name (string)
- specialization (string)
- experience (number)
- rating (number)
- image (string)
- room (string)
- floor (number)
- workDays (array of strings)
- workHours (string)
- bio (string)

**appointments** collection:
- patientId (string)
- patientName (string)
- doctorId (string)
- doctorName (string)
- date (string)
- time (string)
- status (string): 'pending' | 'confirmed' | 'completed' | 'cancelled'
- queueNumber (number)
- symptoms (string, optional)

**rooms** collection:
- number (string)
- floor (number)
- doctorId (string | null)
- status (string): 'available' | 'occupied' | 'maintenance'

## Muammolarni hal qilish

### "Permission denied" xatoligi
- Firestore Security Rules to'g'ri o'rnatilganini tekshiring
- Foydalanuvchi to'g'ri rol bilan kirilganini tekshiring

### "Firebase app not initialized" xatoligi
- `/src/app/firebase/config.ts` da to'g'ri konfiguratsiya kiritilganini tekshiring
- Browser ni yangilang

### Ma'lumotlar yuklanmayapti
- Internet ulanishini tekshiring
- Browser console da xatolarni tekshiring
- Firebase Console da Firestore Database ishlab turganini tekshiring

## Yordam

Qo'shimcha yordam kerak bo'lsa:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Authentication](https://firebase.google.com/docs/auth)

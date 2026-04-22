# Shifoxona Boshqaruv Tizimi

Firebase bilan to'liq ishlaydigan shifoxona boshqaruv tizimi.

## Xususiyatlar

### 🏥 Uch xil foydalanuvchi roli

**1. Bemor (Patient)**
- Doktorlar ro'yxatini ko'rish va qidirish
- Doktor haqida batafsil ma'lumot
- Navbatga yozilish (sana, vaqt tanlash)
- O'z navbatlarini ko'rish va boshqarish
- Navbatni bekor qilish
- Shifoxona haqida ma'lumotlar
- Xonalar xaritasi

**2. Doktor (Doctor)**
- Bugungi bemorlar ro'yxati
- Joriy navbat ko'rsatkichi
- "Keyingi bemor" funksiyasi
- Holat o'zgartirish (Faol/Tanaffus/Band)
- Barcha navbatlar tarixi
- Bemor haqida ma'lumotlar

**3. Administrator (Admin)**
- Umumiy statistika va analitika
- Doktorlarni qo'shish/tahrirlash/o'chirish
- Xonalarni boshqarish
- Doktorlarni xonalarga tayinlash
- Navbatlar nazorati
- Samaradorlik ko'rsatkichlari

## Firebase Integration

### Autentifikatsiya
- Email/Parol orqali kirish
- Ro'yxatdan o'tish (bemorlar uchun)
- Role-based access control (RBAC)
- Har bir rol faqat o'z sahifalariga kiradi

### Ma'lumotlar bazasi (Firestore)
- **users** - Foydalanuvchilar (bemor, doktor, admin)
- **doctors** - Doktorlar ma'lumotlari
- **appointments** - Navbatlar
- **rooms** - Xonalar

### Real-time yangilanishlar
- Doktor "Keyingi bemor" ni bosgan zahoti, bemorning ekranida avtomatik yangilanadi
- Admin doktor qo'shsa/o'chirsa, barchada darhol ko'rinadi
- Navbatlar real-time da yangilanadi

### Xavfsizlik
Firebase Security Rules orqali:
- Bemorlar faqat o'z navbatlarini ko'radi
- Doktorlar faqat o'z bemorlarini ko'radi  
- Adminlar hammasi

## O'rnatish va sozlash

### 1. Loyihani klonlash

```bash
git clone <repository-url>
cd shifoxona-app
npm install
```

### 2. Firebase sozlash

Batafsil yo'riqnoma: `FIREBASE_SETUP.md` fayliga qarang.

Qisqacha:
1. [Firebase Console](https://console.firebase.google.com/) ga kiring
2. Yangi project yarating
3. Authentication va Firestore ni yoqing
4. Web app yarating va config olinger
5. `/src/app/firebase/config.ts` faylida config ni almashtiring

### 3. Demo foydalanuvchilar

Login sahifasida demo akkauntlar ko'rsatilgan:

- **Admin**: admin@shifoxona.uz / admin123
- **Doktor**: doctor@shifoxona.uz / doctor123
- **Bemor**: patient@shifoxona.uz / patient123

**Eslatma**: Bu akkauntlarni Firebase Console da qo'lda yaratish kerak. Keyin Firestore da ularning ma'lumotlarini qo'shish kerak (`FIREBASE_SETUP.md` ga qarang).

### 4. Ishga tushirish

```bash
npm run dev
```

Browser da `http://localhost:5173` ni oching.

## Loyiha strukturasi

```
/src
  /app
    /components        - UI komponentlar
      /ui              - Shadcn/ui komponentlari
      Layout.tsx       - Asosiy layout
      Navbar.tsx       - Navigatsiya
      ProtectedRoute.tsx - Xavfsizlik
    
    /contexts          - React Context
      AuthContext.tsx  - Autentifikatsiya
    
    /firebase          - Firebase xizmatlari
      config.ts        - Firebase konfiguratsiya
      auth.ts          - Autentifikatsiya funksiyalari
      firestore.ts     - Ma'lumotlar bazasi operatsiyalari
      seedData.ts      - Dastlabki ma'lumotlar
    
    /pages             - Sahifalar
      /patient         - Bemor sahifalari
      /doctor          - Doktor sahifalari
      /admin           - Admin sahifalari
      Login.tsx        - Kirish sahifasi
    
    /data              - Mock ma'lumotlar
      mockData.ts
    
    App.tsx            - Asosiy komponent
    routes.tsx         - Routing konfiguratsiyasi
  
  /styles              - CSS
```

## Texnologiyalar

- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Firebase** - Backend (Auth + Firestore)
- **React Router** - Routing
- **Shadcn/ui** - UI komponentlar
- **Lucide React** - Ikonlar
- **Sonner** - Toast notifications

## Xavfsizlik xususiyatlari

1. **Role-based Access Control (RBAC)**
   - Har bir foydalanuvchi faqat o'z roliga tegishli sahifalarga kiradi
   - Bemor doktor panelini ko'ra olmaydi va aksincha

2. **Firestore Security Rules**
   - Server-side xavfsizlik
   - Har bir query tekshiriladi
   - Ma'lumotlarga ruxsatsiz kirish mumkin emas

3. **Protected Routes**
   - Client-side xavfsizlik
   - Authentication tekshiruvi
   - Noto'g'ri sahifaga kirishda avtomatik yo'naltirish

4. **Data Privacy**
   - Bemorlar faqat o'z navbatlarini ko'radi
   - Boshqa bemorlar ma'lumotlari ko'rinmaydi
   - Doktorlar faqat o'z bemorlarini ko'radi

## Firebase Firestore Strukturasi

### users collection
```typescript
{
  uid: string;
  email: string;
  name: string;
  role: 'patient' | 'doctor' | 'admin';
  phone?: string;
  specialization?: string; // doktorlar uchun
  room?: string;           // doktorlar uchun
  floor?: number;          // doktorlar uchun
  experience?: number;     // doktorlar uchun
  createdAt: timestamp;
}
```

### doctors collection
```typescript
{
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
```

### appointments collection
```typescript
{
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
```

### rooms collection
```typescript
{
  number: string;
  floor: number;
  doctorId: string | null;
  status: 'available' | 'occupied' | 'maintenance';
}
```

## Real-time Features

1. **Navbat yangilanishi**
   - Doktor "Keyingi bemor" ni bosgan zahoti
   - Bemorning telefonida navbat avtomatik yangilanadi
   - `onSnapshot` listener orqali

2. **Doktorlar ro'yxati**
   - Admin doktor qo'shsa/o'chirsa
   - Barcha joylarda darhol ko'rinadi

3. **Xonalar holati**
   - Admin xona holatini o'zgartirsa
   - Real-time yangilanadi

## Keyingi qadamlar

1. ✅ Firebase integratsiyasi
2. ✅ Autentifikatsiya va xavfsizlik
3. ✅ Role-based access control
4. ✅ Real-time yangilanishlar
5. 🔄 SMS xabarnomalar (Twilio)
6. 🔄 Email xabarnomalar (SendGrid)
7. 🔄 Tibbiy kartalar tizimi
8. 🔄 Online to'lov (Stripe/PayPal)
9. 🔄 Reyting tizimi
10. 🔄 Chat funksiyasi

## Yordam

Savollar bo'lsa yoki yordam kerak bo'lsa, `FIREBASE_SETUP.md` fayliga qarang.

## Litsenziya

MIT License

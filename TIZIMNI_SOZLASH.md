# Shifoxona Boshqaruv Tizimini Sozlash

Ushbu faylda tizimni to'g'ri sozlash va ishlashini ta'minlash bo'yicha qadamma-qadam yo'riqnoma mavjud.

## Muammo: Doktorlar ko'rinmayapti

Agar siz tizimga kirgandan so'ng doktorlar ro'yxati bo'sh bo'lsa, quyidagi amallarni bajaring:

### 1-usul: Avtomatik yuklash (Patient uchun)

1. **Patient** sifatida tizimga kiring
2. **Doktorlar** sahifasiga o'ting
3. Tizim avtomatik ravishda doktorlar yo'qligini aniqlaydi va ularni yuklashga harakat qiladi
4. Muvaffaqiyatli yuklangandan so'ng, doktorlar ro'yxati paydo bo'ladi

### 2-usul: Sozlamalar sahifasi orqali (Admin uchun)

1. **Admin** sifatida tizimga kiring
2. Navbar'dan **Sozlamalar** (Settings) sahifasiga o'ting yoki `/setup` URL'iga kiring
3. **"Dastlabki ma'lumotlarni yuklash"** tugmasini bosing
4. Ma'lumotlar muvaffaqiyatli yuklangach, **"Diagnostika o'tkazish"** tugmasini bosib tizim holatini tekshiring
5. **Doktorlar** sahifasiga qaytib, doktorlarni ko'ring

### 3-usul: Admin panel orqali doktor qo'shish

1. **Admin** sifatida tizimga kiring
2. **Admin > Doktorlar** sahifasiga o'ting
3. Agar doktorlar bo'sh bo'lsa, **"Dastlabki ma'lumotlarni yuklash"** tugmasini bosing
4. Yoki **"Yangi doktor"** tugmasi orqali qo'lda doktor qo'shishingiz mumkin

## Diagnostika

Agar muammolar davom etsa, quyidagi diagnostika amallarini bajaring:

1. `/setup` sahifasiga o'ting
2. **"Diagnostika o'tkazish"** tugmasini bosing
3. Quyidagi holatlarni tekshiring:
   - ✓ Firebase SDK - Ishlayapti
   - ✓ Authentication - Foydalanuvchi tizimga kirgan
   - ✓ Firestore - Ma'lumotlar bazasi ulangan
   - ✓ User Document - Foydalanuvchi ma'lumotlari mavjud

4. **"Ruxsatlarni tekshirish"** tugmasi orqali Firebase Security Rules ishlayotganini tekshiring

## Firebase sozlamalari

Agar diagnostikada xatolar bo'lsa:

1. `FIREBASE_SETUP.md` faylini o'qing
2. Firebase Console'da Firestore Security Rules to'g'ri o'rnatilganini tekshiring
3. `/src/app/firebase/config.ts` faylida Firebase konfiguratsiyasi to'g'riligini tekshiring

## Demo foydalanuvchilar

Tizimni test qilish uchun demo foydalanuvchilar yaratish kerak. Qadamma-qadam yo'riqnoma:

1. `DEMO_USERS_SETUP.md` faylini o'qing
2. Firebase Console'da Authentication bo'limiga o'ting
3. Uchta rol uchun foydalanuvchilar yarating:
   - **Patient**: patient@test.uz / password123
   - **Doctor**: doctor@test.uz / password123
   - **Admin**: admin@test.uz / password123

4. Firestore'da `users` collection'ida har bir foydalanuvchi uchun hujjat yarating

## Tizim arxitekturasi

### Patient (Bemor)
- Doktorlarni ko'rish va qidirish
- Navbatga yozilish
- O'z navbatlarini kuzatish
- Shifoxona haqida ma'lumot olish

### Doctor (Doktor)
- Kunlik grafigini ko'rish
- Navbatni boshqarish
- "Keyingi bemor" tugmasi orqali navbatni yangilash
- O'z holatini (faol/tanaffus/band) o'zgartirish

### Admin
- Xodimlarni boshqarish (doktorlarni qo'shish, tahrirlash, o'chirish)
- Navbatlarni nazorat qilish
- Xonalar taqsimotini boshqarish
- Analitika ko'rish

## Real-time yangilanishlar

Tizim Firebase Firestore real-time listeners'dan foydalanadi:

- **Doktorlar**: Yangi doktor qo'shilganda yoki tahrirlanganda avtomatik yangilanadi
- **Navbatlar**: Navbat yaratilganda, o'zgartirilganda yoki bekor qilinganda real-time yangilanadi
- **Xonalar**: Xona holati o'zgarganda avtomatik yangilanadi

## Yordam

Agar muammolarni hal qila olmasangiz:

1. Browser Console'da xatolarni tekshiring (F12 > Console)
2. Firestore Rules'ni tekshiring
3. `FIXES_APPLIED.md` faylida hal qilingan muammolarni ko'ring
4. `FIREBASE_SETUP.md` va `DEMO_USERS_SETUP.md` fayllarini qayta o'qing

## Xulosa

Ushbu tizim to'liq Firebase bilan integratsiya qilingan va real-time ma'lumotlar almashinuvini ta'minlaydi. Barcha muammolar avtomatik ravishda hal qilinadi yoki ogohlantirish xabarlari bilan ko'rsatiladi.

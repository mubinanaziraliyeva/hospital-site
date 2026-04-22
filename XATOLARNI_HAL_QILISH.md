# Xatolarni Hal Qilish

Bu faylda tizimda ko'p uchraydigan xatolar va ularni hal qilish usullari berilgan.

## ❌ Xato: "Permission denied" yoki "Missing or insufficient permissions"

### Sababi
Firebase Firestore Security Rules to'g'ri sozlanmagan yoki foydalanuvchi ma'lumotlari `/users/` collection'ida mavjud emas.

### Hal qilish

#### 1-qadam: Firestore Security Rules yangilash

1. [Firebase Console](https://console.firebase.google.com/) ga kiring
2. Loyihangizni tanlang
3. **Build** > **Firestore Database** > **Rules** tabiga o'ting
4. `/firestore.rules` faylining yangi versiyasini ko'chiring va **Publish** qiling

Rules fayli yangilandi va endi quyidagilarni qiladi:
- Foydalanuvchi mavjud emasligini tekshiradi (`userExists()` funksiyasi)
- Firestore'ga kirishdan oldin xavfsizlik tekshiruvlarini amalga oshiradi
- Authenticated foydalanuvchilarga to'g'ri ruxsatlar beradi

#### 2-qadam: Foydalanuvchi ma'lumotlarini tekshirish

Har bir foydalanuvchi uchun `/users/{uid}` collection'ida document mavjud bo'lishi kerak.

**Firebase Console da tekshirish:**
1. **Firestore Database** ga o'ting
2. `users` collection ni oching
3. Sizning UID ingiz bilan document bor-yo'qligini tekshiring

**Agar yo'q bo'lsa:**
1. **Authentication** > **Users** dan UID ni ko'chiring
2. `users` collection'ida yangi document yarating:
   - Document ID: `{your_uid}`
   - Fields:
     ```
     uid: "{your_uid}" (string)
     email: "your@email.com" (string)
     name: "Sizning ismingiz" (string)
     role: "patient" | "doctor" | "admin" (string)
     createdAt: (timestamp - hozirgi vaqt)
     ```

#### 3-qadam: Tizimni qayta yuklash

1. Brauzerdan chiqing (logout)
2. Yana kiriting (login)
3. `/setup` sahifasiga o'ting va diagnostika o'tkazing

## ❌ Xato: React ref warning (Dialog komponenti)

### Sababi
Radix UI primitives `ref` kutadi, lekin `DialogOverlay` komponenti `forwardRef` ishlatmagan.

### Hal qilish
✅ **Hal qilindi!** Dialog komponenti yangilandi va endi `React.forwardRef` ishlatadi.

Agar xato davom etsa, brauzer cache'ni tozalang:
- Chrome: Ctrl+Shift+Delete > Cache images and files > Clear data
- Firefox: Ctrl+Shift+Delete > Cached Web Content > Clear Now

## ❌ Xato: Ma'lumotlar yuklanmayapti

### Sababi
1. Firebase konfiguratsiyasi noto'g'ri
2. Internet ulanishi yo'q
3. Firestore'da ma'lumotlar yo'q

### Hal qilish

#### 1. Firebase konfiguratsiyasini tekshirish

`/src/app/firebase/config.ts` faylini oching va konfiguratsiya to'g'ri ekanligini tekshiring:

```typescript
const firebaseConfig = {
  apiKey: "AIzaSy...",  // To'g'ri API key
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

**Qayerdan olish:**
1. Firebase Console > Project Settings (⚙️ belgi)
2. "Your apps" bo'limida web app'ingizni tanlang
3. Config ma'lumotlarini ko'chiring

#### 2. Dastlabki ma'lumotlarni yuklash

Doktorlar va xonalar haqida ma'lumot yuklash:

1. Saytga kiring (login)
2. `/setup` sahifasiga o'ting
3. "Dastlabki ma'lumotlarni yuklash" tugmasini bosing
4. "Ruxsatlarni tekshirish" tugmasini bosing

Yoki brauzer console'da:

```javascript
// F12 ni bosing va Console tabiga o'ting
// Quyidagi kodni kiriting:
window.location.href = '/setup';
```

#### 3. Internet ulanishini tekshirish

Browser console'da (F12 > Console):
```javascript
navigator.onLine  // true bo'lishi kerak
```

## ❌ Xato: "Firebase app not initialized"

### Sababi
Firebase SDK to'g'ri import qilinmagan yoki konfiguratsiya xato.

### Hal qilish

1. `/src/app/firebase/config.ts` faylida to'g'ri konfiguratsiya bor-yo'qligini tekshiring
2. Brauzer console'da (F12) quyidagi xatolarni qidiring:
   - API key errors
   - Network errors
   - CORS errors

3. Loyihani qayta ishga tushiring:
```bash
# Terminal'da:
npm run dev
```

## ❌ Xato: Tizimga kirish mumkin emas (Login error)

### Sababi
1. Email/Password noto'g'ri
2. Foydalanuvchi Authentication'da yo'q
3. Email/Password authentication yoqilmagan

### Hal qilish

#### Demo foydalanuvchilar

Sistemada quyidagi demo akkauntlar bo'lishi kerak:

**Admin:**
- Email: `admin@shifoxona.uz`
- Parol: `admin123`

**Doktor:**
- Email: `doctor@shifoxona.uz`
- Parol: `doctor123`

**Bemor:**
- Email: `patient@shifoxona.uz`
- Parol: `patient123`

#### Yangi foydalanuvchi yaratish

`DEMO_USERS_SETUP.md` faylini o'qing - qadamma-qadam yo'riqnoma mavjud.

#### Email/Password authentication yoqish

1. Firebase Console > **Authentication**
2. **Sign-in method** tabiga o'ting
3. **Email/Password** ni topib, **Enable** qiling
4. **Save** ni bosing

## 🔧 Diagnostika vositalari

### /setup sahifasi

Tizimni tekshirish uchun maxsus sahifa yaratildi:

1. Saytga kiring
2. URL qatoriga `/setup` qo'shing (masalan: `http://localhost:5173/setup`)
3. Sahifa ochiladi va quyidagi imkoniyatlar mavjud:
   - **Tizim diagnostikasi** - Firebase ulanishini tekshiradi
   - **Dastlabki ma'lumotlarni yuklash** - Doktorlar va xonalarni yuklaydi
   - **Ruxsatlarni tekshirish** - Security Rules ishlayotganini tekshiradi

### Browser Console

Chrome/Firefox'da F12 ni bosing va **Console** tabini oching.

**Foydali buyruqlar:**

```javascript
// Joriy foydalanuvchini ko'rish
firebase.auth().currentUser

// Firestore'ga ulanishni tekshirish
firebase.firestore().collection('doctors').get()
  .then(snap => console.log('Doktorlar:', snap.size))
  .catch(err => console.error('Xato:', err))
```

## 📚 Qo'shimcha resurslar

### Loyiha fayllari
- `FIREBASE_SETUP.md` - Firebase sozlash bo'yicha to'liq yo'riqnoma
- `DEMO_USERS_SETUP.md` - Demo foydalanuvchilar yaratish
- `README.md` - Loyiha haqida umumiy ma'lumot

### Firebase Documentation
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firestore Data Model](https://firebase.google.com/docs/firestore/data-model)

## ⚡ Tez yordam

Agar yuqoridagi usullar yordam bermasa:

1. ✅ **Logout/Login** - Tizimdan chiqib, qaytadan kiring
2. ✅ **Cache tozalash** - Brauzer cache'ni tozalang
3. ✅ **Loyihani qayta ishga tushiring** - `npm run dev` ni qaytadan ishga tushiring
4. ✅ **/setup sahifasiga o'ting** - Diagnostika o'tkazing
5. ✅ **Firebase Console** - Ma'lumotlar mavjudligini tekshiring

## 🆘 Yordam olish

Agar muammo hal bo'lmasa:

1. Browser console screenshot oling (F12 > Console)
2. Firebase Console da Security Rules ni tekshiring
3. `/setup` sahifasida diagnostika natijalarini ko'ring
4. Barcha xatolar va screenshot'larni saqlang

---

**Oxirgi yangilanish:** 2026-04-20

# Demo Foydalanuvchilar Yaratish

Sistemada test qilish uchun doktor va bemor foydalanuvchilarini qo'lda yaratish kerak.

## ❗ MUHIM

Firebase Authentication da yangi foydalanuvchi yaratish uchun **Firebase Console** dan foydalanish kerak.

## 📋 Qadamlar

### 1. Firebase Console ga kiring

1. [https://console.firebase.google.com/](https://console.firebase.google.com/) ga kiring
2. Loyihangizni tanlang: `fast-hospital-9a19d`

### 2. Doktor foydalanuvchisini yarating

#### Firebase Authentication

1. Chap menyudan **Build** > **Authentication** > **Users** ni tanlang
2. **Add user** tugmasini bosing
3. Quyidagi ma'lumotlarni kiriting:
   - Email: `doctor@shifoxona.uz`
   - Password: `doctor123`
4. **Add user** tugmasini bosing
5. Yaratilgan foydalanuvchining **UID** ni ko'chirib oling (masalan: `abc123xyz`)

#### Firestore Database

1. Chap menyudan **Build** > **Firestore Database** ni tanlang
2. **users** collection ga kiring (agar yo'q bo'lsa, yarating)
3. **Add document** tugmasini bosing
4. **Document ID** ga yuqorida ko'chirilgan UID ni kiriting
5. Quyidagi fieldlarni qo'shing:

```
uid: "abc123xyz" (string) - Yuqoridagi UID
email: "doctor@shifoxona.uz" (string)
name: "Dr. Farrux Rahimov" (string)
role: "doctor" (string)
specialization: "Kardiolog" (string)
room: "201" (string)
floor: 2 (number)
experience: 15 (number)
createdAt: (timestamp) - Hozirgi vaqt
```

### 3. Bemor foydalanuvchisini yarating

#### Firebase Authentication

1. **Authentication** > **Users** da yana **Add user** tugmasini bosing
2. Quyidagi ma'lumotlarni kiriting:
   - Email: `patient@shifoxona.uz`
   - Password: `patient123`
3. **Add user** tugmasini bosing
4. Yaratilgan foydalanuvchining **UID** ni ko'chirib oling

#### Firestore Database

1. **users** collection ga kiring
2. **Add document** tugmasini bosing
3. **Document ID** ga yangi UID ni kiriting
4. Quyidagi fieldlarni qo'shing:

```
uid: "xyz789abc" (string) - Yangi UID
email: "patient@shifoxona.uz" (string)
name: "Javohir Karimov" (string)
role: "patient" (string)
phone: "+998 90 123 45 67" (string)
createdAt: (timestamp) - Hozirgi vaqt
```

## ✅ Tugadi!

Endi quyidagi akkauntlar bilan tizimga kirishingiz mumkin:

### Admin
- Email: `admin@shifoxona.uz`
- Parol: `admin123`

### Doktor
- Email: `doctor@shifoxona.uz`
- Parol: `doctor123`

### Bemor
- Email: `patient@shifoxona.uz`
- Parol: `patient123`

## 🔐 Xavfsizlik

- Parollar Firebase Authentication da shifrlangan holda saqlanadi
- Firestore da faqat foydalanuvchi ma'lumotlari (ism, email, rol) saqlanadi
- Parol **hech qachon** Firestore da saqlanmaydi

## ❓ Nima uchun qo'lda yaratish kerak?

Firebase ning cheklovi - yangi foydalanuvchi yaratganda avtomatik login qiladi va hozirgi sessiyani tugatadi. Shuning uchun:
- Real loyihalarda bu Backend (Firebase Admin SDK) orqali amalga oshiriladi
- Test loyihalarda qo'lda yaratish eng oson usul

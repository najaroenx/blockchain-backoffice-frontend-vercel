# Firebase Phone Authentication Setup

## ภาพรวม (Overview)
ระบบ OTP ได้ถูก implement ด้วย Firebase Phone Authentication ซึ่งจะส่ง SMS OTP โดยอัตโนมัติผ่าน Firebase

## การตั้งค่า Firebase Console

### 1. เปิดใช้งาน Phone Authentication
1. ไปที่ [Firebase Console](https://console.firebase.google.com/)
2. เลือก Project ของคุณ
3. ไปที่ **Authentication** → **Sign-in method**
4. เปิดใช้งาน **Phone**
5. คลิก **Save**

### 2. เพิ่ม Test Phone Numbers (สำหรับ Development)
1. ใน **Authentication** → **Sign-in method**
2. เลื่อนลงมาที่ **Phone numbers for testing**
3. เพิ่มเบอร์ทดสอบ เช่น:
   - Phone: +66812345678
   - Code: 123456

### 3. ตั้งค่า Firebase Admin SDK
1. ไปที่ **Project Settings** → **Service accounts**
2. คลิก **Generate new private key**
3. เก็บไฟล์ JSON ไว้อย่างปลอดภัย
4. ใส่ค่าลงใน Environment Variables:

```bash
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### 4. ตั้งค่า reCAPTCHA (สำหรับ Production)
1. ไปที่ [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin)
2. สร้าง Site Key ใหม่ (reCAPTCHA v3)
3. เพิ่ม Domain ของคุณ
4. คัดลอก Site Key และ Secret Key
5. ตั้งค่าใน Firebase Console:
   - **Authentication** → **Settings** → **Authorized domains**
   - เพิ่ม domain ของคุณ

## Environment Variables

สร้างไฟล์ `.env.local`:

```bash
# Firebase Client (Public)
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-ABCDEFGH

# Firebase Admin (Private - Server Only)
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key-Here\n-----END PRIVATE KEY-----\n"
```

## การทำงานของระบบ

### Flow การ Authentication

```
1. ผู้ใช้กรอกเบอร์โทร (PinPhoneNumber)
   ↓
2. Firebase ส่ง SMS OTP อัตโนมัติ
   ↓
3. ผู้ใช้กรอกรหัส OTP (PinOTP)
   ↓
4. Firebase verify OTP
   ↓
5. Backend ตรวจสอบ ID Token
   ↓
6. สร้าง Custom Token สำหรับ Session
   ↓
7. Success!
```

### Components

**PinPhoneNumber.tsx**
- รับเบอร์โทร 10 หลัก
- ใช้ `RecaptchaVerifier` (invisible)
- เรียก `signInWithPhoneNumber()` 
- เก็บ `confirmationResult` ไว้ใน window object

**PinOTP.tsx**
- รับรหัส OTP 6 หลัก
- เรียก `confirmationResult.confirm(code)`
- ส่ง ID Token ไปยัง Backend
- Backend verify กับ Firebase Admin SDK

### API Routes

**POST /api/otp/request**
- Validate phone number format
- Return success message
- Firebase จะส่ง SMS โดยอัตโนมัติจาก client-side

**POST /api/otp/verify**
- รับ Firebase ID Token
- Verify ด้วย Firebase Admin SDK
- สร้าง Custom Token
- Return user data

## การทดสอบ

### Local Development

```bash
yarn dev
```

1. เปิด http://localhost:3000/otp
2. ใส่เบอร์ทดสอบ: 0812345678
3. กด "รับรหัส OTP"
4. ใส่รหัส OTP จาก SMS หรือใช้ Test Code: 123456
5. กด "ยืนยันรหัส OTP"

### Test Phone Numbers (Development)
ตั้งค่าใน Firebase Console → Authentication → Phone numbers for testing:

```
0812345678 → OTP: 123456
0898765432 → OTP: 654321
```

## Error Handling

### Client-Side Errors
- `auth/invalid-phone-number` - เบอร์โทรไม่ถูกต้อง
- `auth/too-many-requests` - ส่ง OTP บ่อยเกินไป
- `auth/captcha-check-failed` - reCAPTCHA ล้มเหลว
- `auth/invalid-verification-code` - รหัส OTP ผิด
- `auth/code-expired` - รหัส OTP หมดอายุ

### Server-Side Errors
- Invalid ID Token - Token ไม่ถูกต้อง
- User not found - ไม่พบผู้ใช้

## Security Best Practices

1. **Rate Limiting**: จำกัดจำนวนครั้งที่ส่ง OTP
2. **Phone Verification**: ตรวจสอบรูปแบบเบอร์โทร
3. **Environment Variables**: เก็บ credentials ไว้ใน .env.local
4. **HTTPS Only**: ใช้ HTTPS ใน Production
5. **Token Validation**: ตรวจสอบ Firebase Token ทุกครั้ง

## Production Deployment

### 1. ตั้งค่า Authorized Domains
- Firebase Console → Authentication → Settings
- เพิ่ม production domain

### 2. ตั้งค่า Environment Variables
```bash
# Vercel
vercel env add FIREBASE_PRIVATE_KEY
vercel env add FIREBASE_CLIENT_EMAIL
```

### 3. Enable Production reCAPTCHA
- ใช้ reCAPTCHA v3 สำหรับ production
- ตั้งค่า site key ใน Firebase Console

## Troubleshooting

### SMS ไม่ถูกส่ง
1. ตรวจสอบว่าเปิดใช้งาน Phone Authentication แล้ว
2. ตรวจสอบว่าเบอร์โทรอยู่ในรูปแบบ +66xxxxxxxxx
3. ตรวจสอบ quota ของ Firebase (100 SMS/day สำหรับ free tier)

### reCAPTCHA Error
1. ตรวจสอบว่า domain ถูกเพิ่มใน Firebase Authorized domains
2. ลองใช้ Incognito mode
3. Clear browser cache

### Token Verification Failed
1. ตรวจสอบ Firebase Admin SDK credentials
2. ตรวจสอบว่า FIREBASE_PRIVATE_KEY มี `\n` ที่ถูกต้อง
3. Restart dev server

## Resources

- [Firebase Phone Auth Documentation](https://firebase.google.com/docs/auth/web/phone-auth)
- [Firebase Admin SDK Documentation](https://firebase.google.com/docs/admin/setup)
- [reCAPTCHA Documentation](https://developers.google.com/recaptcha/docs/display)

## Support

หากพบปัญหา กรุณาตรวจสอบ:
1. Firebase Console → Authentication → Users (ดูว่ามี user ถูกสร้างหรือไม่)
2. Browser Console (F12) → Console tab (ดู error messages)
3. Terminal logs (ดู server-side errors)

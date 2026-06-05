# Firebase Phone Authentication - Technical Flow

## Architecture Overview

```
┌─────────────────┐      ┌──────────────┐      ┌──────────────┐
│  PinPhoneNumber │─────▶│   Firebase   │─────▶│  User Phone  │
│   (Component)   │      │  Phone Auth  │      │  (SMS OTP)   │
└─────────────────┘      └──────────────┘      └──────────────┘
         │                                              │
         │                                              │
         ▼                                              ▼
┌─────────────────┐                            ┌──────────────┐
│    PinOTP       │◀───────────────────────────│  User Enter  │
│  (Component)    │                            │     OTP      │
└─────────────────┘                            └──────────────┘
         │
         ▼
┌─────────────────┐      ┌──────────────┐
│ /api/otp/verify │─────▶│   Firebase   │
│  (Backend API)  │      │  Admin SDK   │
└─────────────────┘      └──────────────┘
         │
         ▼
┌─────────────────┐
│     Success     │
│   + Auth Token  │
└─────────────────┘
```

## Detailed Flow

### Step 1: Request OTP (PinPhoneNumber.tsx)

```typescript
// 1. User enters phone number: 0812345678
const phoneNumber = "0812345678";

// 2. Format to international: +66812345678
const formattedPhone = `+66${phoneNumber.substring(1)}`;

// 3. Send via Firebase Phone Auth
const confirmation = await signInWithPhoneNumber(
  auth,
  formattedPhone,
  recaptchaVerifier
);

// 4. Firebase sends SMS automatically
// SMS Content: "Your verification code is: 123456"

// 5. Store confirmation result
window.confirmationResult = confirmation;
setPhoneNumber(phoneNumber);
setToken(confirmation.verificationId);

// 6. Navigate to OTP verification screen
onChangeStep(VerifyPhoneStep.PIN_OTP);
```

### Step 2: Verify OTP (PinOTP.tsx)

```typescript
// 1. User enters OTP: 123456
const otpCode = "123456";

// 2. Get confirmation result from window
const confirmationResult = window.confirmationResult;

// 3. Verify with Firebase
const result = await confirmationResult.confirm(otpCode);

// 4. Get Firebase ID Token
const user = result.user;
const idToken = await user.getIdToken();

// 5. Send to backend for verification
const response = await fetch("/api/otp/verify", {
  method: "POST",
  body: JSON.stringify({ idToken })
});

// 6. Backend verifies token with Firebase Admin SDK
// 7. Return custom token and user data
const data = await response.json();

// 8. Store in context
setOtpCode(otpCode);
setToken(data.token);

// 9. Navigate to success screen
onChangeStep(VerifyPhoneStep.SUCCESS);
```

### Step 3: Backend Verification (api/otp/verify/route.ts)

```typescript
// 1. Receive ID Token from client
const { idToken } = await request.json();

// 2. Verify with Firebase Admin SDK
const decodedToken = await adminAuth.verifyIdToken(idToken);

// 3. Extract user info
const uid = decodedToken.uid;
const phoneNumber = decodedToken.phone_number;

// 4. Get user record
const userRecord = await adminAuth.getUser(uid);

// 5. Create custom token for session
const customToken = await adminAuth.createCustomToken(uid);

// 6. Return user data and token
return {
  success: true,
  token: customToken,
  user: {
    uid,
    phoneNumber,
    displayName: userRecord.displayName
  }
};
```

## Key Components

### 1. RecaptchaVerifier
```typescript
// Invisible reCAPTCHA for bot protection
const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
  'size': 'invisible',
  'callback': () => {
    // reCAPTCHA solved, allow phone auth
  }
});
```

### 2. signInWithPhoneNumber
```typescript
// Firebase method to send OTP via SMS
const confirmation = await signInWithPhoneNumber(
  auth,              // Firebase Auth instance
  formattedPhone,    // +66xxxxxxxxx
  recaptchaVerifier  // reCAPTCHA verifier
);
// Returns: ConfirmationResult object
```

### 3. confirmationResult.confirm()
```typescript
// Verify the OTP code
const result = await confirmationResult.confirm(otpCode);
// Returns: UserCredential with user object
```

### 4. Firebase Admin SDK
```typescript
// Server-side verification
const decodedToken = await adminAuth.verifyIdToken(idToken);
// Returns: DecodedIdToken with uid, phone_number, etc.
```

## Data Flow

### Context State
```typescript
{
  phoneNumber: "0812345678",           // User's phone number
  token: "custom-firebase-token-...",  // Custom token from backend
  otpCode: "123456"                    // Verified OTP code
}
```

### Firebase Authentication State
```typescript
{
  uid: "firebase-uid-...",
  phoneNumber: "+66812345678",
  emailVerified: false,
  isAnonymous: false,
  metadata: {
    creationTime: "...",
    lastSignInTime: "..."
  }
}
```

## Security Flow

```
┌─────────────────────────────────────────────────────────┐
│ 1. reCAPTCHA Challenge (Bot Protection)                 │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│ 2. Firebase validates phone number format               │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│ 3. Firebase generates secure OTP (6 digits)             │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│ 4. SMS sent via Firebase's SMS provider                 │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│ 5. User enters OTP within 60 seconds                    │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│ 6. Firebase verifies OTP on client side                 │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│ 7. Generate Firebase ID Token (JWT)                     │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│ 8. Backend verifies ID Token with Admin SDK             │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│ 9. Create custom token for session management           │
└─────────────────────────────────────────────────────────┘
```

## Error Handling

### Client-Side Errors
```typescript
try {
  const confirmation = await signInWithPhoneNumber(...);
} catch (error) {
  if (error.code === 'auth/invalid-phone-number') {
    // Phone format is wrong
  } else if (error.code === 'auth/too-many-requests') {
    // Rate limit exceeded
  } else if (error.code === 'auth/captcha-check-failed') {
    // reCAPTCHA failed
  }
}
```

### OTP Verification Errors
```typescript
try {
  const result = await confirmationResult.confirm(code);
} catch (error) {
  if (error.code === 'auth/invalid-verification-code') {
    // Wrong OTP
  } else if (error.code === 'auth/code-expired') {
    // OTP expired (> 60 seconds)
  }
}
```

### Server-Side Errors
```typescript
try {
  const decodedToken = await adminAuth.verifyIdToken(idToken);
} catch (error) {
  // Invalid or expired token
  // User needs to sign in again
}
```

## Best Practices Implemented

✅ **Security**
- reCAPTCHA bot protection
- Server-side token verification
- Rate limiting by Firebase
- OTP expiration (60 seconds)

✅ **User Experience**
- Loading states
- Clear error messages
- Disabled buttons during loading
- Real-time validation

✅ **Error Handling**
- Specific error messages for each error type
- Graceful fallbacks
- User-friendly Thai messages

✅ **Code Quality**
- TypeScript strict typing
- Component separation
- Context for state management
- Clean error handling

## Production Checklist

- [ ] Enable Phone Authentication in Firebase Console
- [ ] Add production domain to Authorized domains
- [ ] Set up Firebase Admin SDK credentials
- [ ] Configure SMS quota (Free: 100/day, Paid: unlimited)
- [ ] Add monitoring and logging
- [ ] Implement rate limiting on backend
- [ ] Add user database integration
- [ ] Set up proper session management
- [ ] Configure CORS properly
- [ ] Test with real phone numbers

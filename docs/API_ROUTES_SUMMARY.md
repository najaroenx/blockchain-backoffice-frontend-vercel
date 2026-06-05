# 📋 API Routes Summary

> **Last Updated:** 2026-01-07  
> **Project:** Merchant Back Office Frontend

---

## 📊 Overview

| Category | Count |
|----------|-------|
| Total API Routes | 28 |
| Uses `MERCHANT_BACKEND` (port 4000) | 25 |
| Uses `NEXT_PUBLIC_BACKEND_URL` (port 4000) | 3 |

---

## 🛒 Seller APIs

### `/api/seller`

| Method | Backend Endpoint | Description |
|--------|------------------|-------------|
| **POST** | `/coupon/dev/interim-seller` | Create seller coupon |
| **GET** | `/coupon/seller/vouchers` | Get seller vouchers |

**Environment:** `MERCHANT_BACKEND` → `localhost:4000`

<details>
<summary><strong>POST Request/Response</strong></summary>

**Request Body:**
```json
{
  // Coupon data to create
}
```

**Response:**
```json
{
  "message": "success"
}
```
</details>

<details>
<summary><strong>GET Request/Response</strong></summary>

**Query Params:**
- `walletAddress`: Seller wallet address

**Response:**
```json
{
  "message": "success",
  "data": [ /* voucher list */ ]
}
```
</details>

---

### `/api/seller/list-to-marketplace`

| Method | Backend Endpoint | Description |
|--------|------------------|-------------|
| **POST** | `/coupon/seller/list-on-marketplace` | List coupon on marketplace |
| **GET** | `/coupon/seller/vouchers` | Get seller vouchers |

**Environment:** `MERCHANT_BACKEND` → `localhost:4000`

<details>
<summary><strong>POST Request/Response</strong></summary>

**Request Body:**
```json
{
  // Coupon listing data
}
```

**Response:**
```json
{
  "message": "success"
}
```
</details>

---

## 🎟️ Coupon APIs

### `/api/coupon/create`

| Method | Backend Endpoint | Description |
|--------|------------------|-------------|
| **POST** | `/coupon/dev/interim-seller` | Create new coupon |

**Environment:** `NEXT_PUBLIC_BACKEND_URL` → `localhost:4000`

<details>
<summary><strong>POST Request/Response</strong></summary>

**Request Body:**
```json
{
  "sellerWalletAddress": "string (required)",
  "price": "number (required, > 0)",
  "coupon": {
    "name": "string (required)",
    "description": "string (required)",
    "status": "upcoming (required)",
    "merchantId": "string (required)",
    "valueType": "cash | percentage | gift | multiplier | aispoint",
    "value": "number (required, > 0)",
    "pointId": "string (required)",
    "pointsCost": "number",
    "startDate": "string (required)",
    "endDate": "string (required)",
    "totalIssued": "number (required, > 0)",
    "imageUrl": "string",
    "merchantRef": "string (optional)"
  }
}
```

**Response (201):**
```json
{
  // Created coupon data from backend
}
```

**Error Response:**
```json
{
  "message": "Error description",
  "error": {}
}
```
</details>

---

### `/api/coupon/value-types`

| Method | Backend Endpoint | Description |
|--------|------------------|-------------|
| **GET** | `/coupon/value-types` | Get available value types |

**Environment:** `NEXT_PUBLIC_BACKEND_URL` → `localhost:4000`

**Auth Required:** Yes (Bearer Token)

<details>
<summary><strong>GET Request/Response</strong></summary>

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  // Value types data
}
```
</details>

---

## 🏪 Merchant APIs

### `/api/merchant`

| Method | Backend Endpoint | Description |
|--------|------------------|-------------|
| **GET** | `/merchant` | Get merchants list |
| **POST** | `/merchant` | Create new merchant |

**Environment:** `MERCHANT_BACKEND` → `localhost:4000`

**Auth Required:** Yes (Bearer Token)

<details>
<summary><strong>GET Request/Response</strong></summary>

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    // merchant data
  }
]
```

**Response Headers:**
- `X-Total-Count`: Total number of merchants
</details>

<details>
<summary><strong>POST Request/Response</strong></summary>

**Request Body:**
```json
{
  // Merchant data
  // userId is added automatically from session
}
```

**Response:**
```json
{
  "message": "success"
}
```
</details>

---

### `/api/merchant/all`

| Method | Backend Endpoint | Description |
|--------|------------------|-------------|
| **GET** | `/merchant/all` | Get all merchants (paginated) |

**Environment:** `NEXT_PUBLIC_BACKEND_URL` → `localhost:4000`

**Auth Required:** No

<details>
<summary><strong>GET Request/Response</strong></summary>

**Query Params:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 20 | Items per page |
| `name` | string | - | Filter by name |
| `location` | string | - | Filter by location |
| `website` | string | - | Filter by website |
| `hasWallet` | boolean | - | Filter by wallet status |
| `pointId` | string | - | Filter by point ID |

**Response:**
```json
{
  // Paginated merchants data
}
```
</details>

---

### `/api/[id]/merchant`

| Method | Backend Endpoint | Description |
|--------|------------------|-------------|
| **GET** | `/merchant` | Get merchant by session |
| **POST** | `/merchant` | Create merchant |

**Environment:** `MERCHANT_BACKEND` → `localhost:4000`

---

### `/api/[id]/merchant/[merchantId]`

| Method | Backend Endpoint | Description |
|--------|------------------|-------------|
| **GET** | `/merchant/{merchantId}` | Get merchant by ID |
| **PATCH** | `/merchant/{merchantId}` | Update merchant |
| **DELETE** | `/merchant/{merchantId}` | Delete merchant |

**Environment:** `MERCHANT_BACKEND` → `localhost:4000`

**Auth Required:** Yes (Bearer Token)

---

## 🎫 Voucher APIs

### `/api/[id]/voucher`

| Method | Backend Endpoint | Description |
|--------|------------------|-------------|
| **GET** | `/coupon/merchant/{merchantId}` | Get vouchers by merchant |

**Environment:** `MERCHANT_BACKEND` → `localhost:4000`

**Auth Required:** Configurable via `ADMIN_REQUIRE_AUTH`

<details>
<summary><strong>GET Request/Response</strong></summary>

**Query Params:**
| Param | Type | Description |
|-------|------|-------------|
| `_start` | number | Pagination start |
| `_end` | number | Pagination end |

**Response:**
```json
[
  {
    "id": "string",
    "name": "string",
    "description": "string",
    "status": "string",
    "merchantId": "string",
    "merchantName": "string",
    "valueType": "string",
    "value": "number",
    "currency": "string",
    "startDate": "string",
    "endDate": "string",
    "totalIssued": "number",
    "totalRedeemed": "number",
    "availableCount": "number",
    "imageUrl": "string",
    "limitPerMember": "number",
    "pointsCost": "number",
    "createdAt": "string",
    "updatedAt": "string"
  }
]
```

**Response Headers:**
- `X-Total-Count`: Total count
- `Content-Range`: `items {start}-{end}/{total}`
</details>

---

### `/api/[id]/voucher/activate/[voucherId]`

| Method | Backend Endpoint | Description |
|--------|------------------|-------------|
| **PATCH** | `/coupon/activate/{voucherId}` | Activate voucher |

**Environment:** `MERCHANT_BACKEND` → `localhost:4000`

**Auth Required:** Yes (Bearer Token)

<details>
<summary><strong>PATCH Request/Response</strong></summary>

**Request Body:**
```json
{
  "pointId": "string",
  "pointsCost": "number (>= 0)",
  "amount": "number (> 0)",
  "currency": "string (required)"
}
```

**Response (200):**
```json
{
  "message": "Voucher activated successfully",
  "voucher": { /* voucher data */ }
}
```
</details>

---

## 📱 OTP APIs

### `/api/otp`

| Method | Backend Endpoint | Description |
|--------|------------------|-------------|
| **POST** | - | OTP endpoint (currently returns success) |

**Environment:** `MERCHANT_BACKEND` → `localhost:4000`

---

### `/api/otp/request`

| Method | Backend Endpoint | Description |
|--------|------------------|-------------|
| **POST** | `/templink/send-otp` | Request OTP |
| **GET** | `/templink/{requestId}` | Validate request ID |

**Environment:** `MERCHANT_BACKEND` → `localhost:4000`

<details>
<summary><strong>POST Request/Response</strong></summary>

**Request Body:**
```json
{
  "phoneNumber": "string (10 digits)",
  "requestId": "string",
  "merchantId": "string"
}
```

**Response:**
```json
{
  "message": "สามารถลงทะเบียนใหม่ได้"
}
```
</details>

<details>
<summary><strong>GET Request/Response</strong></summary>

**Query Params:**
- `requestid`: Request ID to validate

**Response (200):**
```json
{
  "message": "RequestId is valid",
  "uid": "string",
  "phoneNumber": "string",
  "merchantId": "string",
  "expire": "string (ISO date)"
}
```
</details>

---

### `/api/otp/verify`

| Method | Backend Endpoint | Description |
|--------|------------------|-------------|
| **POST** | `/templink/verify-otp` | Verify OTP code |

**Environment:** `MERCHANT_BACKEND` → `localhost:4000`

<details>
<summary><strong>POST Request/Response</strong></summary>

**Request Body:**
```json
{
  "phoneNumber": "string",
  "merchantId": "string",
  "otpCode": "string"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "ยืนยัน OTP สำเร็จ"
}
```

**Error Response (400):**
```json
{
  "message": "รหัส OTP ไม่ถูกต้อง"
}
```
</details>

---

### `/api/otp/verify-request-id`

| Method | Backend Endpoint | Description |
|--------|------------------|-------------|
| **GET** | `/templink/{requestId}` | Verify request ID |

**Environment:** `MERCHANT_BACKEND` → `localhost:4000`

---

### `/api/otp/uid`

| Method | Backend Endpoint | Description |
|--------|------------------|-------------|
| **GET** | - | Get UID related data |

**Environment:** `MERCHANT_BACKEND` → `localhost:4000`

---

### `/api/otp/re-send-otp`

| Method | Backend Endpoint | Description |
|--------|------------------|-------------|
| **POST** | `/templink/resend-otp` | Resend OTP |

**Environment:** `MERCHANT_BACKEND` → `localhost:4000`

---

## 💰 Points APIs

### `/api/points/all`

| Method | Backend Endpoint | Description |
|--------|------------------|-------------|
| **GET** | `/points/all` | Get all points (paginated) |

**Environment:** `NEXT_PUBLIC_BACKEND_URL` → `localhost:4000`

<details>
<summary><strong>GET Request/Response</strong></summary>

**Query Params:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 20 | Items per page |
| `name` | string | - | Filter by name |
| `symbol` | string | - | Filter by symbol |
| `merchantId` | string | - | Filter by merchant |
| `merchantName` | string | - | Filter by merchant name |
| `pointName` | string | - | Filter by point name |

**Response:**
```json
{
  // Paginated points data
}
```
</details>

---

### `/api/[id]/point`

| Method | Backend Endpoint | Description |
|--------|------------------|-------------|
| **GET** | `/{merchantId}/point/` | Get points by merchant |
| **POST** | `/{merchantId}/point` | Create point |

**Environment:** `MERCHANT_BACKEND` → `localhost:4000`

---

### `/api/[id]/point/[pointId]`

| Method | Backend Endpoint | Description |
|--------|------------------|-------------|
| **GET** | `/{merchantId}/point/{pointId}` | Get point by ID |
| **PATCH** | `/{merchantId}/point/{pointId}` | Update point |
| **POST** | `/{merchantId}/transaction/{pointId}` | Create transaction |
| **DELETE** | `/{merchantId}/point/{pointId}` | Delete point |

**Environment:** `MERCHANT_BACKEND` → `localhost:4000`

---

## 👥 Customer APIs

### `/api/[id]/customer`

| Method | Backend Endpoint | Description |
|--------|------------------|-------------|
| **GET** | `/{merchantId}/customer` | Get customers by merchant |

**Environment:** `MERCHANT_BACKEND` → `localhost:4000`

---

### `/api/[id]/customer/[customerId]`

| Method | Backend Endpoint | Description |
|--------|------------------|-------------|
| **GET** | `/{merchantId}/customer/{customerId}` | Get customer by ID |

**Environment:** `MERCHANT_BACKEND` → `localhost:4000`

---

## 🔑 API Key APIs

### `/api/[id]/api-key`

| Method | Backend Endpoint | Description |
|--------|------------------|-------------|
| **GET** | `/{merchantId}/api-key/` | Get API keys |
| **POST** | `/{merchantId}/api-key` | Create API key |

**Environment:** `MERCHANT_BACKEND` → `localhost:4000`

---

### `/api/[id]/api-key/[apiKeyId]`

| Method | Backend Endpoint | Description |
|--------|------------------|-------------|
| **DELETE** | `/{merchantId}/api-key/{apiKeyId}` | Delete API key |

**Environment:** `MERCHANT_BACKEND` → `localhost:4000`

---

## 📊 Dashboard & Transaction APIs

### `/api/[id]/dashboard`

| Method | Backend Endpoint | Description |
|--------|------------------|-------------|
| **GET** | `/dashboard/{merchantId}/` | Get dashboard data |

**Environment:** `MERCHANT_BACKEND` → `localhost:4000`

---

### `/api/[id]/transaction`

| Method | Backend Endpoint | Description |
|--------|------------------|-------------|
| **GET** | `/{merchantId}/transaction/` | Get transactions |

**Environment:** `MERCHANT_BACKEND` → `localhost:4000`

---

### `/api/[id]/transaction/[transactionId]/balance`

| Method | Backend Endpoint | Description |
|--------|------------------|-------------|
| **GET** | `/{walletAddress}/transaction/{transactionId}/balance` | Get transaction balance |

**Environment:** `MERCHANT_BACKEND` → `localhost:4000`

---

## 🔐 Auth APIs

### `/api/register`

| Method | Backend Endpoint | Description |
|--------|------------------|-------------|
| **POST** | `/auth/register` | Register new user |

**Environment:** `MERCHANT_BACKEND` → `localhost:4000`

<details>
<summary><strong>POST Request/Response</strong></summary>

**Request Body:**
```json
{
  // Registration data
}
```

**Response:**
```json
{
  "message": "success"
}
```
</details>

---

### `/api/auth/[...nextauth]`

NextAuth.js authentication routes.

**Environment:** `MERCHANT_BACKEND` → `localhost:4000`

---

## ✅ Notes

### Environment Variables

| Env Variable | Used By | Default Port |
|--------------|---------|-------------|
| `MERCHANT_BACKEND` | Most API routes | `4000` |
| `NEXT_PUBLIC_BACKEND_URL` | `/api/coupon/create`, `/api/merchant/all`, `/api/points/all`, `/api/coupon/value-types` | `4000` |

> **Note:** All API routes use port `4000` as default.

---

## 🔧 Environment Variables

```env
# Backend URLs
MERCHANT_BACKEND=http://localhost:4000
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000

# Auth settings
PORTAL_REQUIRE_AUTH=true
ADMIN_REQUIRE_AUTH=true
```

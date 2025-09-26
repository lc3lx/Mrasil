# إصلاح مشكلة رفع البروفيل

## المشكلة

كانت المشكلة في الـ `customBaseQuery.ts` حيث يتم إضافة `Content-Type: application/json` لجميع الطلبات، بما في ذلك FormData.

## الحل المطبق

### 1. إصلاح customBaseQuery.ts

```typescript
// قبل الإصلاح
export const customBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");
    if (token) {
      const cleanToken = token.replace(/^Bearer\s+/i, "");
      headers.set("Authorization", `Bearer ${cleanToken}`);
    }
    headers.set("Content-Type", "application/json"); // ❌ هذا يسبب المشكلة
    return headers;
  },
});

// بعد الإصلاح
export const customBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { endpoint }) => {
    const token = localStorage.getItem("token");
    if (token) {
      const cleanToken = token.replace(/^Bearer\s+/i, "");
      headers.set("Authorization", `Bearer ${cleanToken}`);
    }

    // لا نضيف Content-Type للـ FormData
    // فقط للـ JSON requests
    if (!headers.get("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    return headers;
  },
});
```

### 2. كيف يعمل الآن

#### للـ FormData (رفع الصور):

```typescript
const formData = new FormData();
formData.append("profileImage", file);
formData.append("firstName", "أحمد");

// الـ headers ستكون:
// Authorization: Bearer TOKEN
// Content-Type: multipart/form-data; boundary=... (يتم إضافته تلقائياً)
```

#### للـ JSON (البيانات العادية):

```typescript
const payload = {
  firstName: "أحمد",
  lastName: "محمد",
};

// الـ headers ستكون:
// Authorization: Bearer TOKEN
// Content-Type: application/json
```

## اختبار الإصلاح

### 1. اختبار رفع صورة البروفيل

```javascript
// في الفرونت
const formData = new FormData();
formData.append("profileImage", fileInput.files[0]);
formData.append("firstName", "أحمد");

const response = await updateCustomerMe(formData).unwrap();
```

### 2. اختبار رفع معلومات الشركة

```javascript
// في الفرونت
const formData = new FormData();
formData.append("brand_logo", logoFile);
formData.append("company_name_ar", "شركة الاختبار");
formData.append("brand_email", "info@test.com");

const response = await updateCustomerMe(formData).unwrap();
```

### 3. اختبار البيانات العادية (بدون ملفات)

```javascript
// في الفرونت
const payload = {
  firstName: "أحمد",
  lastName: "محمد",
  email: "ahmed@test.com",
};

const response = await updateCustomerMe(payload).unwrap();
```

## التحقق من الإصلاح

### 1. تحقق من الـ Network Tab

في Developer Tools → Network:

- يجب أن ترى `Content-Type: multipart/form-data` للـ FormData
- يجب أن ترى `Content-Type: application/json` للـ JSON

### 2. تحقق من الـ Console Logs

في الـ server console:

```
📁 الملفات المستلمة: { profileImage: [File] }
📝 البيانات المستلمة: { firstName: 'أحمد', profileImage: 'filename.jpg' }
✅ تم حفظ صورة البروفيل: filename.jpg
```

### 3. تحقق من الـ Database

```javascript
// في MongoDB
db.customers.findOne({ email: "test@example.com" });
// يجب أن ترى profileImage و brand_logo محدثة
```

## نصائح مهمة

1. **لا تضيف Content-Type للـ FormData** - المتصفح يضيفه تلقائياً
2. **تأكد من أن الـ file input له name صحيح** - `profileImage` أو `brand_logo`
3. **تأكد من أن الـ token صحيح** - تحقق من الـ Authorization header
4. **تأكد من أن الـ server يعمل** - تحقق من الـ console logs

## استكشاف الأخطاء

### إذا استمر الخطأ:

1. **تحقق من الـ Network Tab:**

   - هل Content-Type صحيح؟
   - هل الـ FormData يصل بشكل صحيح؟

2. **تحقق من الـ Console:**

   - هل هناك أخطاء في الفرونت؟
   - هل الـ server logs تظهر البيانات؟

3. **تحقق من الـ Backend:**
   - هل الـ middleware يعمل؟
   - هل الـ validation يمر؟

### رسائل الخطأ الشائعة:

| الخطأ                                 | السبب               | الحل             |
| ------------------------------------- | ------------------- | ---------------- |
| `Cannot read properties of undefined` | البيانات لا تصل     | تحقق من FormData |
| `Unexpected token - in JSON`          | Content-Type خاطئ   | تأكد من الإصلاح  |
| `File too large`                      | الملف أكبر من 5MB   | قلل حجم الملف    |
| `Invalid file type`                   | نوع الملف غير مدعوم | استخدم JPG/PNG   |

## الملفات المحدثة

1. `Mrasil-master/app/api/customBaseQuery.ts` - إصلاح Content-Type
2. `mararsil-main/controllers/adminController.js` - تحسين معالجة البيانات
3. `mararsil-main/utils/validators/customerValidator.js` - إضافة حقول الشركة
4. `mararsil-main/server.js` - إزالة express.json() المكرر

## الاختبار

```bash
# تشغيل اختبار الفرونت
node test-profile-upload-frontend.js

# تشغيل اختبار الباك
node test-profile-upload.js
```

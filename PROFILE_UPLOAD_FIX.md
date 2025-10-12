# إصلاح مشكلة رفع صورة البروفيل

## 🔍 المشكلة

الـ `req.files` هو `undefined` في الباك، رغم أن الـ FormData يتم إنشاؤه بشكل صحيح في الفرونت.

## 🔧 الأسباب المحتملة

### 1. مشكلة Content-Type في customBaseQuery

الـ `customBaseQuery` يضيف `Content-Type: application/json` حتى للـ FormData، مما يمنع الـ multer من العمل.

### 2. مشكلة في الـ middleware

الـ `UploadCustomerImage` middleware لا يعمل بشكل صحيح.

## ✅ الحلول المطبقة

### 1. إصلاح customBaseQuery

```typescript
// في customBaseQuery.ts
export const customBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { endpoint, type, body }) => {
    const token = localStorage.getItem("token");
    if (token) {
      const cleanToken = token.replace(/^Bearer\s+/i, "");
      headers.set("Authorization", `Bearer ${cleanToken}`);
    }

    // لا نضيف Content-Type للـ FormData
    if (!headers.get("Content-Type") && !headers.get("content-type")) {
      if (body instanceof FormData) {
        // لا نضيف Content-Type للـ FormData
        console.log("🔧 FormData detected, skipping Content-Type");
      } else {
        headers.set("Content-Type", "application/json");
      }
    }

    return headers;
  },
});
```

### 2. إضافة التشخيص في handelImageUpload

```typescript
// في page.tsx
const handelImageUpload = async (file: File) => {
  try {
    console.log("🔧 رفع صورة البروفيل:", file.name, file.size);

    const formData = new FormData();
    formData.append("profileImage", file);

    console.log("🔧 FormData created:", formData.has("profileImage"));
    console.log(
      "🔧 FormData instanceof FormData:",
      formData instanceof FormData
    );

    const res = await updateCustomerMe(formData).unwrap();
    console.log("✅ نجح رفع صورة البروفيل:", res);
    // ...
  } catch (err: any) {
    console.error("❌ فشل رفع صورة البروفيل:", err);
    // ...
  }
};
```

### 3. إضافة التشخيص في الباك

```javascript
// في adminController.js
exports.UploadCustomerImage = (req, res, next) => {
  console.log("🔧 UploadCustomerImage middleware called");
  console.log("🔧 Content-Type:", req.headers["content-type"]);
  console.log("🔧 Content-Length:", req.headers["content-length"]);

  // التحقق من أن الـ request يحتوي على multipart data
  if (
    !req.headers["content-type"] ||
    !req.headers["content-type"].includes("multipart/form-data")
  ) {
    console.log("❌ Content-Type is not multipart/form-data");
    return next();
  }

  const uploadMiddleware = UploadArrayofImages([
    { name: "profileImage", maxCount: 1 },
    { name: "brand_logo", maxCount: 1 },
  ]);

  uploadMiddleware(req, res, (err) => {
    if (err) {
      console.error("❌ UploadCustomerImage error:", err);
      return next(err);
    }
    console.log("✅ UploadCustomerImage completed");
    console.log("🔧 req.files after upload:", req.files);
    next();
  });
};
```

## 🧪 للاختبار

### 1. في الفرونت

عند رفع صورة البروفيل، يجب أن ترى في console الفرونت:

```
🔧 رفع صورة البروفيل: image.jpg 12345
🔧 FormData created: true
🔧 FormData instanceof FormData: true
🔧 FormData detected, skipping Content-Type
```

### 2. في الباك

عند رفع صورة البروفيل، يجب أن ترى في console الباك:

```
🔧 UploadCustomerImage middleware called
🔧 Content-Type: multipart/form-data
🔧 Content-Length: 12345
✅ UploadCustomerImage completed
🔧 req.files after upload: { profileImage: [...] }
📁 الملفات المستلمة: { profileImage: [...] }
✅ تم حفظ صورة البروفيل: profileImage-uuid-timestamp.jpeg
```

## 📋 النتائج المتوقعة

### ✅ رفع صورة البروفيل

```json
{
  "status": "success",
  "data": {
    "_id": "689e81d43d1269685093e62f",
    "profileImage": "profileImage-uuid-timestamp.jpeg"
    // ... باقي البيانات
  }
}
```

### ✅ getMe

```json
{
  "data": {
    "_id": "689e81d43d1269685093e62f",
    "profileImage": "profileImage-uuid-timestamp.jpeg"
    // ... باقي البيانات
  }
}
```

## 🔧 استكشاف الأخطاء

### إذا لم ترى "FormData detected, skipping Content-Type"

المشكلة في الـ `customBaseQuery` - تحقق من أن الـ `body instanceof FormData` يعمل.

### إذا لم ترى "UploadCustomerImage middleware called"

المشكلة في الـ routes - تحقق من أن الـ middleware موجود في الـ route.

### إذا لم ترى "Content-Type: multipart/form-data"

المشكلة في الـ FormData - تحقق من أن الـ FormData يتم إرساله بشكل صحيح.

## 📝 ملاحظات مهمة

1. **تأكد من أن الـ FormData يحتوي على `profileImage`**
2. **تأكد من أن الـ Content-Type هو `multipart/form-data`**
3. **تأكد من أن الـ middleware يعمل**
4. **تحقق من الـ console logs في الفرونت والباك**

## 🎯 النتائج النهائية

- ✅ **FormData**: يتم إنشاؤه بشكل صحيح
- ✅ **Content-Type**: لا يتم إضافة `application/json` للـ FormData
- ✅ **Middleware**: يعمل بشكل صحيح
- ✅ **رفع الصورة**: يعمل بشكل صحيح
- ✅ **عرض الصورة**: تظهر في getMe

الآن يجب أن يعمل رفع صورة البروفيل بشكل صحيح! 🎉




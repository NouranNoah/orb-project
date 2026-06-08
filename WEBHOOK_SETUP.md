# إعداد Webhook للمدفوعات (EasyKash)

## نظرة عامة
يتم استخدام webhook لتلقي تحديثات حالة الدفع من easykash فور حدوثها، بدلاً من الاعتماد على polling.

## الـ API المطلوب في الباك اند

### 1. POST /webhook/easykash
يستقبل الـ webhook من easykash عند تغيير حالة الدفع.

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "customerReference": "{{paymentId}}",
  "Amount": "100",
  "status": "PAID", // أو "FAILED"
  "easykashRef": "123456",
  "signatureHash": "test_signature"
}
```

**Response:** لا يرجع body (204 No Content)

### 2. POST /payments/verify (اختياري)
للتحقق اليدوي من حالة الدفع.

**Body:**
```json
{
  "paymentId": "payment_id_here"
}
```

## إعداد الباك اند

### 1. إنشاء الـ endpoint
```javascript
// routes/webhook.js
const express = require('express');
const router = express.Router();

// Webhook للمدفوعات
router.post('/easykash', async (req, res) => {
  try {
    const { customerReference, status, Amount, easykashRef, signatureHash } = req.body;

    // التحقق من signature (مهم للأمان)
    // const isValidSignature = verifySignature(signatureHash, req.body);

    // تحديث حالة الدفع في قاعدة البيانات
    const payment = await Payment.findById(customerReference);
    if (payment) {
      payment.status = status.toLowerCase(); // "paid" أو "failed"
      payment.easykashRef = easykashRef;
      payment.updatedAt = new Date();
      await payment.save();

      // إرسال إشعار real-time للمستخدم
      io.to(`payment_${customerReference}`).emit('payment_updated', {
        paymentId: customerReference,
        status: payment.status
      });
    }

    res.status(204).send(); // لا نرجع محتوى
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).send();
  }
});

// التحقق اليدوي
router.post('/verify', async (req, res) => {
  try {
    const { paymentId } = req.body;

    // استدعاء API easykash للتحقق
    const response = await axios.post('https://back.easykash.net/api/cash-api/inquire', {
      customerReference: paymentId
    }, {
      headers: {
        'authorization': process.env.EASYKASH_API_KEY,
        'Content-Type': 'application/json'
      }
    });

    // تحديث حالة الدفع بناءً على الرد
    const payment = await Payment.findById(paymentId);
    if (payment && response.data.status) {
      payment.status = response.data.status.toLowerCase();
      await payment.save();
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Verification failed' });
  }
});

module.exports = router;
```

### 2. إعداد Socket.io للتحديثات الفورية
```javascript
// في server.js
const io = require('socket.io')(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  socket.on('join_payment_room', (paymentId) => {
    socket.join(`payment_${paymentId}`);
  });
});
```

### 3. متغيرات البيئة المطلوبة
```env
EASYKASH_API_KEY=your_api_key_here
WEBHOOK_SECRET=your_webhook_secret_for_signature_verification
```

## إعداد easykash
1. في لوحة تحكم easykash، اضبط Webhook URL إلى:
   `https://your-domain.com/webhook/easykash`

2. تأكد من أن الـ signature verification يعمل بشكل صحيح

## الأمان
- **التحقق من Signature:** تأكد من التحقق من `signatureHash` للتأكد من أن الطلب من easykash
- **Rate Limiting:** حد من عدد الطلبات للـ webhook
- **Logging:** سجل جميع الـ webhooks المستلمة للمراجعة

## الفرونت اند
تم تحديث `payment-result.jsx` ليدعم:
- Socket.io للتحديثات الفورية
- زر التحقق اليدوي
- Polling كـ fallback كل 10 ثواني
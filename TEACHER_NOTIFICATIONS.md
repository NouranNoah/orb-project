# إعداد إشعارات المدفوعات للمدرس

## نظرة عامة
عندما يدفع الطالب بنجاح، يتم إرسال إشعار فوري للمدرس لإعلامه باستلام الدفع.

## المتطلبات في الباك اند

### 1. إنشاء إشعار عند استلام webhook
في `/webhook/easykash`، أضف إرسال إشعار للمدرس:

```javascript
// في webhook handler
if (payment.status === "paid") {
  // إرسال إشعار للمدرس
  const lesson = await Lesson.findById(payment.lessonId);
  if (lesson && lesson.teacherId) {
    const notification = new Notification({
      userId: lesson.teacherId,
      title: "تم استلام الدفع",
      body: `لقد تم استلام دفعة جديدة بقيمة ${payment.amount} جنيه من طالب`,
      type: "payment_received",
      data: {
        lessonId: payment.lessonId,
        paymentId: payment._id,
        amount: payment.amount
      }
    });

    await notification.save();

    // إرسال إشعار real-time عبر socket
    io.to(`user_${lesson.teacherId}`).emit('new_notification', {
      _id: notification._id,
      title: notification.title,
      body: notification.body,
      createdAt: notification.createdAt,
      read: false
    });
  }
}
```

### 2. إضافة API لإرسال إشعار يدوي (اختياري)
```javascript
// POST /notifications/teacher-payment
router.post('/teacher-payment', authMiddleware, async (req, res) => {
  try {
    const { lessonId, amount } = req.body;

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    const notification = new Notification({
      userId: lesson.teacherId,
      title: "تم استلام الدفع",
      body: `لقد تم استلام دفعة جديدة بقيمة ${amount} جنيه من طالب`,
      type: "payment_received"
    });

    await notification.save();

    // إرسال إشعار real-time
    io.to(`user_${lesson.teacherId}`).emit('new_notification', notification);

    res.json({ message: "Notification sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to send notification" });
  }
});
```

### 3. تحديث Socket.io لدعم غرف المستخدمين
```javascript
// في server.js
io.on('connection', (socket) => {
  const userId = socket.handshake.auth.userId; // من JWT token

  if (userId) {
    socket.join(`user_${userId}`);
  }

  socket.on('disconnect', () => {
    if (userId) {
      socket.leave(`user_${userId}`);
    }
  });
});
```

## نموذج الإشعار في قاعدة البيانات

```javascript
const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['payment_received', 'lesson_booked', 'lesson_cancelled'],
    default: 'general'
  },
  data: {
    type: mongoose.Schema.Types.Mixed
  },
  read: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});
```

## الفرونت اند
تم تحديث المكونات التالية:

### 1. `Notifications.jsx`
- يستمع للإشعارات الجديدة عبر socket
- يعرض الإشعارات فورياً

### 2. `Header.jsx`
- يحدث عدد الإشعارات غير المقروءة فورياً
- يدعم كل من Firebase و Socket.io

### 3. `payment-result.jsx`
- يرسل إشعار للمدرس عند اكتمال الدفع
- يدعم التحقق اليدوي

## الترجمات
أضيفت ترجمات جديدة في `messages/ar.json` و `messages/en.json`:

```json
{
  "paymentReceived": "تم استلام الدفع",
  "paymentReceivedDesc": "لقد تم استلام دفعة جديدة بقيمة {amount} جنيه من طالب"
}
```

## كيف يعمل التدفق:

1. **الطالب يدفع** → يتم توجيهه لـ easykash
2. **easykash ترسل webhook** → الباك اند يحدث حالة الدفع
3. **الباك اند يرسل إشعار** → للمدرس عبر socket
4. **المدرس يرى الإشعار فورياً** → في الـ header وصفحة الإشعارات

## الأمان
- الإشعارات تُرسل فقط للمدرس المعني بالدرس
- يتم التحقق من صحة البيانات قبل إرسال الإشعار
- Socket.io محمي بـ JWT token
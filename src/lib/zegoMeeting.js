/**
 * توحيد شكل استجابة الباكند لـ create-meeting مع اختلاف مفاتيح JSON.
 */

export function pickCreateMeetingPayload(res) {
  const body = res?.data;
  return body?.data ?? body;
}

/** room id للغرفة (يتوقع Zego أن يطابق الـ kit token) */
export function pickRoomId(meeting) {
  if (!meeting || typeof meeting !== "object") return null;
  return (
    meeting.meetingRoomId ??
    null
  );
}

/** تشخيص سريع لسلسلة التوكن (للـ console في التطوير) */
export function tokenDiagnostics(s) {
  if (!s || typeof s !== "string") {
    return { length: 0, dotCount: 0, looksLikeKitJwt: false, preview: "" };
  }
  const dotCount = (s.match(/\./g) ?? []).length;
  return {
    length: s.length,
    dotCount,
    looksLikeKitJwt: looksLikeZegoKitTokenString(s),
    preview: s.slice(0, 48),
    ends: s.slice(-24),
  };
}

function tryUnwrapJsonStringToken(s) {
  const t = s.trim();
  if (!t.startsWith("{") && !t.startsWith("[")) return t;
  try {
    const j = JSON.parse(t);
    if (!j || typeof j !== "object") return t;
    const inner =
      j.kitToken ??
      j.kit_token ??
      j.token ??
      j.jwt ??
      j.accessToken ??
      j.access_token ??
      j.student ??
      j.data;
    return typeof inner === "string" && inner.length > 0 ? inner.trim() : t;
  } catch {
    return t;
  }
}

/**
 * إصلاح توكن وصل من ?token= بعد تعرّضه لـ URL:
 * - استبدال المسافات بـ + (لأن + في query تُقرأ كمسافة)
 * - نقطة يونيكود → نقطة ASCII
 * - إن اختفت النقطة بين payload والتوقيع (صيغة Zego جزئين)، نُدرج `.` بعد `In0`
 *   (نهاية شائعة لـ base64 يمثل `}` في الـ JSON)
 */
export function normalizeZegoKitTokenFromUrl(raw) {
  if (!raw || typeof raw !== "string") return raw;
  let s = raw.trim().replace(/\uFF0E/g, ".");
  s = s.replace(/ /g, "+");
  if (!s.includes(".")) {
    const marker = "In0";
    const i = s.indexOf(marker);
    if (i !== -1 && i + marker.length < s.length) {
      const after = s.slice(i + marker.length);
      if (after.length > 0 && !after.startsWith(".")) {
        s = `${s.slice(0, i + marker.length)}.${after}`;
      }
    }
  }
  return s;
}

/**
 * Kit Token من Zego قد يكون:
 * - جزئين: payload_base64url.signature (شائع من توليد السيرفر)
 * - ثلاثة أجزاء: JWT كلاسيكي header.payload.signature
 */
// export function looksLikeZegoKitTokenString(s) {
//   if (!s || typeof s !== "string") return false;
//   const parts = s.split(".");
//   return (
//     parts.length >= 2 &&
//     parts.every((p) => p.length > 0) &&
//     parts[0].length >= 8
//   );
// }
// داخل src/lib/zegoMeeting.js
export function looksLikeZegoKitTokenString(token) {
  if (!token) return false;
  return typeof token === "string" && token.length > 20;
}

function decodeB64UrlPayload(segment) {
  const b64 = segment.replace(/-/g, "+").replace(/_/g, "/");
  const pad = b64.length % 4 === 0 ? "" : "=".repeat(4 - (b64.length % 4));
  return JSON.parse(atob(b64 + pad));
}

/**
 * وقت انتهاء صلاحية الـ kit token (ms من epoch)، أو null إن لم يُستخرج.
 * يدعم JWT (exp) وصيغة Zego (ctime + expire).
 */
export function getZegoKitTokenExpiryMs(kitToken) {
  if (!kitToken || typeof kitToken !== "string") return null;
  const parts = kitToken.split(".");
  if (parts.length < 2) return null;
  try {
    /** توكن غرفة Express: JWT بثلاثة أجزاء — الـ exp في الجزء الأوسط */
    if (parts.length >= 3) {
      try {
        const mid = decodeB64UrlPayload(parts[1]);
        if (typeof mid.exp === "number") return mid.exp * 1000;
      } catch {
        /* ignore */
      }
    }
    let payload;
    try {
      payload = decodeB64UrlPayload(parts[0]);
    } catch {
      payload = decodeB64UrlPayload(parts[1]);
    }
    if (typeof payload.exp === "number") {
      return payload.exp * 1000;
    }
    if (
      typeof payload.ctime === "number" &&
      typeof payload.expire === "number"
    ) {
      return (payload.ctime + payload.expire) * 1000;
    }
    return null;
  } catch {
    return null;
  }
}

/** هامش أمان بسيط قبل اعتبار التوكن منتهيًا */
export function isZegoKitTokenExpired(kitToken) {
  const exp = getZegoKitTokenExpiryMs(kitToken);
  if (exp == null) return false;
  return Date.now() > exp;
}

/** مفتاح sessionStorage للتوكن بين اللوبي وصفحة Express / UIKit */
export function meetingTokenStorageKey(meetingId) {
  return `orb_zego_rtc_${meetingId}`;
}

function collectTokenStringsFromTokensObject(tokens) {
  const out = [];
  if (!tokens || typeof tokens !== "object") return out;

  for (const [key, val] of Object.entries(tokens)) {
    if (typeof val === "string") {
      out.push({ key, value: val.trim() });
    } else if (val && typeof val === "object") {
      for (const [ik, iv] of Object.entries(val)) {
        if (typeof iv === "string") {
          out.push({ key: `${key}.${ik}`, value: iv.trim() });
        }
      }
    }
  }
  return out;
}

function legacyPickRaw(meeting) {
  if (!meeting || typeof meeting !== "object") return null;
  const raw =
    meeting.tokens?.student ??
    meeting.tokens?.studentToken ??
    meeting.studentToken ??
    meeting.studentKitToken ??
    meeting.kitToken ??
    meeting.tokens?.kitToken;
  if (typeof raw === "string" && raw.length > 0) return tryUnwrapJsonStringToken(raw);
  if (raw && typeof raw === "object") {
    const inner =
      raw.token ?? raw.kitToken ?? raw.accessToken ?? raw.value ?? raw.jwt;
    if (typeof inner === "string" && inner.length > 0) {
      return tryUnwrapJsonStringToken(inner);
    }
  }
  return null;
}

/**
 * سلسلة kit token لـ ZegoUIKitPrebuilt.create(kitToken)
 * يبحث في كل حقول tokens عن قيمة تشبه JWT، مع تفضيل مفتاح فيه "student".
 */
// export function pickTeacherKitToken(meeting) {
//   const fromEntries = collectTokenStringsFromTokensObject(meeting?.tokens);

//   const normalized = fromEntries.map(({ key, value }) => ({
//     key,
//     value: normalizeZegoKitTokenFromUrl(tryUnwrapJsonStringToken(value)),
//   }));

//   const teacherJwt = normalized.find(
//     (x) => /teacher/i.test(x.key) && looksLikeZegoKitTokenString(x.value)
//   );

//   if (teacherJwt) return teacherJwt.value;

//   return null;
// }




// export function pickStudentKitToken(meeting) {
//   const fromEntries = collectTokenStringsFromTokensObject(meeting?.tokens);

//   const normalized = fromEntries.map(({ key, value }) => ({
//     key,
//     value: normalizeZegoKitTokenFromUrl(tryUnwrapJsonStringToken(value)),
//   }));

//   const studentJwt = normalized.find(
//     (x) => /student/i.test(x.key) && looksLikeZegoKitTokenString(x.value)
//   );

//   if (studentJwt) return studentJwt.value;

//   return null;
// }

export function pickTeacherKitToken(meeting) {
  return meeting?.tokens?.teacher ?? null;
}

export function pickStudentKitToken(meeting) {
  return meeting?.tokens?.student ?? null;
}
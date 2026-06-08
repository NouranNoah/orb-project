import { NextResponse } from "next/server";

/**
 * يتحقق من التوكن والرول ويقرر هل نعمل redirect ولا لا.
 * يرجع NextResponse.redirect(...) لو محتاجين نمنع الدخول، أو null لو المسار مسموح.
 */
// الباكند ممكن يرجع "teacher" أو "teachers" و "student" أو "students" — نطبّع الرول
const normalizeRole = (role) => {
    if (!role) return role;
    if (role === "teacher" || role === "teachers") return "teachers";
    if (role === "student" || role === "students") return "students";
    return role;
};

const roleToPath = {
    teachers: "/teachers",
    students: "/students",
    admin: "/dashboard",
};

export function authRedirect(request) {
    const token = request.cookies.get("token")?.value;
    const roleRaw = request.cookies.get("roleUser")?.value;
    const role = normalizeRole(roleRaw);
    const { pathname } = request.nextUrl;

    const locale = pathname.split("/")[1] || "ar";

    const roleRoutes = {
        admin: ["/dashboard"],
        teachers: ["/teachers"],
        students: ["/students"],
    };

    const protectedRoutes = Object.values(roleRoutes).flat();

    const isProtected = protectedRoutes.some((route) =>
        pathname.startsWith(`/${locale}${route}`)
    );

    // لو مش عامل login ومحاول يدخل صفحة محمية
    if (isProtected && !token) {
        return NextResponse.redirect(new URL(`/${locale}/auth/login`, request.url));
    }

    // لو عامل login: لو دخل على /en أو /ar بس، ودّه لصفحة الرول بتاعه
    if (token && role && (pathname === `/${locale}` || pathname === `/${locale}/`)) {
        const fallbackPath = roleToPath[role] || "/teachers";
        return NextResponse.redirect(new URL(`/${locale}${fallbackPath}`, request.url));
    }

    // لو عامل login بس الرول غلط (يدخل صفحة مش بتاعته)
    if (token && role) {
        let allowed = false;

        for (const [r, routes] of Object.entries(roleRoutes)) {
            if (routes.some((route) => pathname.startsWith(`/${locale}${route}`))) {
                if (r === role) allowed = true;
                break;
            }
        }

        if (isProtected && !allowed) {
            const fallbackPath = roleToPath[role] || "/teachers";
            return NextResponse.redirect(new URL(`/${locale}${fallbackPath}`, request.url));
        }
    }

    return null;
}

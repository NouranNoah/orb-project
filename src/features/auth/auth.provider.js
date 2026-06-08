// "use client";

// import { useState, useEffect } from "react";
// import { AuthContext } from "./auth.context";

// export default function AuthProvider({ children }) {
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const storedUser = localStorage.getItem("user");
//         if (storedUser) {
//         setUser(JSON.parse(storedUser));
//         }
//         setLoading(false);
//     }, []);

//     const login = (userData) => {
//         setUser(userData);
//         localStorage.setItem("user", JSON.stringify(userData));
//     };

//     const logout = () => {
//         setUser(null);
//         localStorage.removeItem("user");
//     };

//     return (
//         <AuthContext.Provider value={{ user, login, logout, loading }}>
//             {children}
//         </AuthContext.Provider>
//     );
// }

"use client";

import { useState, useEffect } from "react";
import { AuthContext } from "./auth.context";
import Cookies from "js-cookie";

// الباكند ممكن يرجع "teacher" أو "teachers" — نطبّع عشان الروت والـ RouteGuard
function normalizeRole(role) {
    if (!role) return role;
    if (role === "teacher" || role === "teachers") return "teachers";
    if (role === "student" || role === "students") return "students";
    return role;
}

export default function AuthProvider({ children }) {
    const [token, setToken] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = Cookies.get("token");
        const storedRole = Cookies.get("roleUser");
        if (storedToken) setToken(storedToken);
        if (storedRole) setRole(normalizeRole(storedRole));
        setLoading(false);
    }, []);

    const login = (tokenUser, roleUser) => {
        setToken(tokenUser);
        setRole(normalizeRole(roleUser));
        Cookies.set("token", tokenUser);
        if (roleUser) Cookies.set("roleUser", roleUser);
    };

    const logout = () => {
        setToken(null);
        setRole(null);
        Cookies.remove("token");
        Cookies.remove("roleUser");
        Cookies.remove("nameUser");
        Cookies.remove("idUser");
    };

    return (
        <AuthContext.Provider value={{ token, role, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

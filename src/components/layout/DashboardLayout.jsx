"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "../sidebar/Sidebar";
import Footer from "../footer/Footer";
import FloatingNotification from "./FloatingNotification";
import styles from "./LayoutControls.module.css";

export default function DashboardLayout({ children, roleUser }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="dashboardLayout">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} roleUser={roleUser} />
      
      <div className="dashboardMain">
        {/* Floating hamburger for mobile */}
        <button 
          className={styles.floatingHamburger} 
          onClick={() => setIsSidebarOpen(true)}
        >
          <i className="fa-solid fa-bars"></i>
        </button>

        <main className="dashboardContent">
          {children}
        </main>
        
        <Footer />
        <FloatingNotification />
      </div>
    </div>
  );
}

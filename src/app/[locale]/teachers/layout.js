import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import RouteGuard from "@/features/auth/RouteGuard";

export default function TeachersLayout({ children }) {
    return (
      <RouteGuard allowedRole="teachers">
        <div className="pageLayout">
          <Header />
  
          <main>
            {children}
          </main>
  
          <Footer />
        </div>
      </RouteGuard>
      );
}

import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import RouteGuard from "@/features/auth/RouteGuard";

export default function StudentsLayout({ children }) {
  return (
    <RouteGuard allowedRole="students">
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
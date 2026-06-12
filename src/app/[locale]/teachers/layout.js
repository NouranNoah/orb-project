import RouteGuard from "@/features/auth/RouteGuard";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function TeachersLayout({ children }) {
    return (
      <RouteGuard allowedRole="teachers">
        <DashboardLayout roleUser="teacher">
          {children}
        </DashboardLayout>
      </RouteGuard>
      );
}

import RouteGuard from "@/features/auth/RouteGuard";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function StudentsLayout({ children }) {
  return (
    <RouteGuard allowedRole="students">
      <DashboardLayout roleUser="student">
        {children}
      </DashboardLayout>
    </RouteGuard>
  );
}
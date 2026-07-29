import AdminSidebar from "./AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 p-6 lg:p-8 mr-64 max-lg:mr-0 max-lg:mb-16">
        {children}
      </div>
    </div>
  );
}

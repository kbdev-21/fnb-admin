import { Outlet, useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar.tsx";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { useAuth } from "@/contexts/auth-context";
import { useEffect } from "react";

export default function AdminLayout() {
  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    if (auth.isReady && (!auth.isLoggedIn() || auth.myInfo?.role !== "ADMIN")) {
      navigate("/login");
    }
  }, [auth, navigate]);

  return (
    <div>
      <SidebarProvider>
        <AdminSidebar />
        <main className={"p-8 bg-background w-full flex flex-col"}>
          <Outlet />
        </main>
      </SidebarProvider>
    </div>
  );
}

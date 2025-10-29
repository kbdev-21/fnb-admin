import {Outlet, useNavigate} from "react-router-dom";
import {SidebarProvider} from "@/components/ui/sidebar.tsx";
import MenuSidebar from "@/components/layout/MenuSidebar.tsx";
import {useAuth} from "@/contexts/AuthContext.tsx";
import {useEffect} from "react";

export default function MainLayout() {
  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    if(auth.isReady && !auth.isLoggedIn()) {
      navigate("/login");
    }
  }, [auth, navigate]);

  return (
    <div>
      <SidebarProvider>
        <MenuSidebar/>
        <main className={"p-8 bg-border w-full flex flex-col"}>
          <Outlet />
        </main>
      </SidebarProvider>
    </div>
  );
}
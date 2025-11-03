import { Outlet, useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar.tsx";
import NavSidebar from "@/components/layout/NavSidebar";
import { useAuth } from "@/contexts/AuthContext.tsx";
import { useEffect } from "react";

export default function MainLayout() {
    const navigate = useNavigate();
    const auth = useAuth();

    useEffect(() => {
        if (auth.isReady && !auth.isLoggedIn()) {
            navigate("/login");
        }
    }, [auth, navigate]);

    return (
        <div>
            <SidebarProvider>
                <NavSidebar />
                <main className={"p-8 bg-background w-full flex flex-col"}>
                    <Outlet />
                </main>
            </SidebarProvider>
        </div>
    );
}

import {
  Sidebar,
  SidebarContent, SidebarFooter,
  SidebarGroup,
  SidebarGroupContent, SidebarHeader, SidebarMenu
} from "@/components/ui/sidebar.tsx";
import {
  CirclePercent,
  Gauge, LaptopMinimal, LogOut,
  ShoppingCart,
  Users,
  Utensils
} from "lucide-react";
import {Link, useLocation} from "react-router-dom";
import {useAuth} from "@/contexts/AuthContext.tsx";
import {Separator} from "@/components/ui/separator.tsx";


export default function MenuSidebar() {
  const location = useLocation();
  const auth = useAuth();

  const items = [
    {title: "Dashboard", url: "/dashboard", icon: Gauge},
    {title: "Orders", url: "/orders", icon: ShoppingCart},
    {title: "Menu", url: "/menu", icon: Utensils},
    {title: "Customers", url: "/customers", icon: Users},
    {title: "Users", url: "/staff", icon: LaptopMinimal},
    {title: "Discounts", url: "/discounts", icon: CirclePercent},
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <div className={"w-full flex gap-2 items-center p-2 h-16"}>
          <div>
            <img
              src={"https://www.shutterstock.com/image-vector/portrait-cat-glasses-vector-art-600nw-2284410025.jpg"}
              alt={"avt"}
              sizes={"40px"}
              className={"w-10 h-10 rounded-full"}
            />
          </div>
          <div>
            <div className={"flex"}>
              {auth.myInfo?.firstName} {auth.myInfo?.lastName}
            </div>
            <div>
              {auth.myInfo?.role}
            </div>
          </div>
        </div>
        <Separator/>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = location.pathname.startsWith(item.url);
                return (
                  <Link to={item.url} className={`flex rounded-lg gap-2.5 items-center py-2 px-3 transition-all
                      ${isActive ? "bg-primary text-primary-foreground hover:bg-primary" : "hover:bg-primary/10"}`}
                  >
                    <item.icon size={18}/>
                    <span>{item.title}</span>
                  </Link>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <button
            className={`text-sm py-2 px-3 flex items-center gap-2 transition-all rounded-lg text-destructive cursor-pointer hover:bg-destructive/10`}
            onClick={() => {
              auth.clearTokenAndMyInfo()
            }}>
            <LogOut size={18}/>
            <span>Log out</span>
          </button>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

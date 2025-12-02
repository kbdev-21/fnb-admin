import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
} from "@/components/ui/sidebar.tsx";
import {
  Book,
  ChartNoAxesColumnIncreasing,
  CirclePercent,
  Clock4,
  Gauge,
  Globe,
  LaptopMinimal,
  LayoutGrid,
  LogOut,
  Martini,
  Notebook,
  Receipt,
  ReceiptText,
  ShoppingCart,
  Store,
  TableProperties,
  User,
  Users,
  Utensils,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { Separator } from "@/components/ui/separator.tsx";
import { SidebarGroupLabel } from "@/components/ui/sidebar.tsx";
import RoleBadge from "../app/RoleBadge";

export default function AdminSidebar() {
  const location = useLocation();
  const auth = useAuth();

  const group1Items = [
    {
      title: "Analytics",
      url: "/admin/analytics",
      icon: ChartNoAxesColumnIncreasing,
    },
    { title: "Orders", url: "/admin/orders", icon: TableProperties },
    { title: "Users", url: "/admin/users", icon: Users },
  ];

  const group2Items = [
    { title: "Menu", url: "/admin/menu", icon: Utensils },
    { title: "Categories", url: "/admin/categories", icon: LayoutGrid },
    { title: "Discounts", url: "/admin/discounts", icon: CirclePercent },
    { title: "Stores", url: "/admin/stores", icon: Store },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <div className={"w-full flex gap-2 items-center p-2 h-16"}>
          <div>
            <img
              src={
                "https://www.shutterstock.com/image-vector/portrait-cat-glasses-vector-art-600nw-2284410025.jpg"
              }
              alt={"avt"}
              sizes={"40px"}
              className={"w-12 h-12 rounded-full"}
            />
          </div>
          <div>
            <div className={"flex font-[600]"}>
              {auth.myInfo?.firstName} {auth.myInfo?.lastName}
            </div>
            <div>
              <RoleBadge
                role={
                  auth.myInfo?.role as
                  | "CUSTOMER"
                  | "STAFF"
                  | "ADMIN"
                }
              />
            </div>
          </div>
        </div>
        <Separator />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarGroupLabel className="font-[600]">
              Operations
            </SidebarGroupLabel>
            <SidebarMenu>
              {group1Items.map((item) => {
                const isActive = location.pathname.startsWith(
                  item.url
                );
                return (
                  <Link
                    to={item.url}
                    className={`flex rounded-lg gap-2.5 items-center py-2 px-3 transition-all
                      ${isActive
                        ? "bg-primary text-primary-foreground hover:bg-primary"
                        : "hover:bg-primary/10"
                      }`}
                  >
                    <item.icon size={18} />
                    <span>{item.title}</span>
                  </Link>
                );
              })}
            </SidebarMenu>
            <SidebarGroupLabel className="mt-2.5 font-[600]">
              Data management
            </SidebarGroupLabel>
            <SidebarMenu>
              {group2Items.map((item) => {
                const isActive = location.pathname.startsWith(
                  item.url
                );
                return (
                  <Link
                    to={item.url}
                    className={`flex rounded-lg gap-2.5 items-center py-2 px-3 transition-all
                      ${isActive
                        ? "bg-primary text-primary-foreground hover:bg-primary"
                        : "hover:bg-primary/10"
                      }`}
                  >
                    <item.icon size={18} />
                    <span>{item.title}</span>
                  </Link>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <button
            className={`text-sm py-2 px-3 flex items-center gap-2 transition-all rounded-lg cursor-pointer hover:bg-primary/10`}
            onClick={() => {
              window.location.replace("/");
            }}
          >
            <Globe size={18} />
            <span>Go to Website</span>
          </button>
        </SidebarMenu>
        <SidebarMenu>
          <button
            className={`text-sm py-2 px-3 flex items-center gap-2 transition-all rounded-lg text-destructive cursor-pointer hover:bg-destructive/10`}
            onClick={() => {
              auth.clearTokenAndMyInfo();
            }}
          >
            <LogOut size={18} />
            <span>Log out</span>
          </button>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

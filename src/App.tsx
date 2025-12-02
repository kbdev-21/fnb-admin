import LoginPage from "@/pages/LoginPage.tsx";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProductsPage from "@/pages/admin/ProductsPage";
import AdminLayout from "@/components/layout/AdminLayout.tsx";
import OrdersPage from "@/pages/admin/OrdersPage";
import DiscountsPage from "@/pages/admin/DiscountsPage";
import StoresPage from "@/pages/admin/StoresPage";
import AnalyticsPage from "@/pages/admin/AnalyticsPage";
import UsersPage from "@/pages/admin/UsersPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/auth-context";
import { OrderProvider } from "@/contexts/order-context";
import ProductDetailPage from "@/pages/admin/ProductDetailPage";
import ProductCreatePage from "@/pages/admin/ProductCreatePage";
import CategoriesPage from "@/pages/admin/CategoriesPage";
import LandingPage from "./pages/LandingPage";
import WebLayout from "./components/layout/WebLayout";
import MenuPage from "./pages/MenuPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderDetailPage from "./pages/admin/OrderDetailPage";
import StaffDashboardPage from "./pages/StaffDashboardPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";
import FindStorePage from "./pages/FindStorePage";
import ContactUsPage from "./pages/ContactUsPage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <OrderProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route element={<WebLayout />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/menu" element={<MenuPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/staff/dashboard" element={<StaffDashboardPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/stores" element={<FindStorePage />} />
                <Route path="/contact" element={<ContactUsPage />} />
              </Route>
              <Route element={<AdminLayout />}>
                <Route
                  path="/admin"
                  element={
                    <Navigate
                      to="/admin/analytics"
                      replace
                    />
                  }
                />
                <Route
                  path="/admin/menu"
                  element={<ProductsPage />}
                />
                <Route
                  path="/admin/menu/new-product"
                  element={<ProductCreatePage />}
                />
                <Route
                  path="/admin/menu/:productSlug"
                  element={<ProductDetailPage />}
                />
                <Route
                  path="/admin/categories"
                  element={<CategoriesPage />}
                />
                <Route
                  path="/admin/orders"
                  element={<OrdersPage />}
                />
                <Route
                  path="/admin/orders/:orderId"
                  element={<OrderDetailPage />}
                />
                <Route
                  path="/admin/discounts"
                  element={<DiscountsPage />}
                />
                <Route
                  path="/admin/stores"
                  element={<StoresPage />}
                />
                <Route
                  path="/admin/analytics"
                  element={<AnalyticsPage />}
                />
                <Route
                  path="/admin/users"
                  element={<UsersPage />}
                />
              </Route>
            </Routes>
          </BrowserRouter>
        </OrderProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

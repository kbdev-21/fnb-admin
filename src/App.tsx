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
import { AuthProvider } from "@/contexts/AuthContext.tsx";
import ProductDetailPage from "@/pages/admin/ProductDetailPage";
import ProductCreatePage from "@/pages/admin/ProductCreatePage";
import CategoriesPage from "@/pages/admin/CategoriesPage";
import LandingPage from "./pages/LandingPage";
import WebLayout from "./components/layout/WebLayout";
import MenuPage from "./pages/MenuPage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<WebLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/menu" element={<MenuPage />} />
            </Route>
            <Route element={<AdminLayout />}>
              <Route
                path="/admin"
                element={
                  <Navigate to="/admin/analytics" replace />
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
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

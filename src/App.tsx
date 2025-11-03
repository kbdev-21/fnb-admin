import LoginPage from "@/pages/LoginPage.tsx";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MenuPage from "@/pages/MenuPage.tsx";
import MainLayout from "@/components/layout/MainLayout.tsx";
import OrdersPage from "@/pages/OrdersPage.tsx";
import CustomersPage from "@/pages/CustomersPage.tsx";
import DiscountsPage from "@/pages/DiscountsPage.tsx";
import StoresPage from "@/pages/StoresPage.tsx";
import DashboardPage from "@/pages/DashboardPage.tsx";
import UsersPage from "@/pages/UsersPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext.tsx";
import ProductDetailPage from "@/pages/ProductDetailPage.tsx";
import ProductCreatePage from "@/pages/ProductCreatePage.tsx";

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <BrowserRouter>
                    <Routes>
                        <Route element={<MainLayout />}>
                            <Route
                                path="/"
                                element={<Navigate to="/dashboard" replace />}
                            />
                            <Route path="/menu" element={<MenuPage />} />
                            <Route
                                path="/menu/new-product"
                                element={<ProductCreatePage />}
                            />
                            <Route
                                path="/menu/:productSlug"
                                element={<ProductDetailPage />}
                            />
                            <Route path="/orders" element={<OrdersPage />} />
                            <Route
                                path="/customers"
                                element={<CustomersPage />}
                            />
                            <Route
                                path="/discounts"
                                element={<DiscountsPage />}
                            />
                            <Route path="/stores" element={<StoresPage />} />
                            <Route
                                path="/dashboard"
                                element={<DashboardPage />}
                            />
                            <Route path="/users" element={<UsersPage />} />
                        </Route>
                        <Route path="/login" element={<LoginPage />} />
                    </Routes>
                </BrowserRouter>
            </AuthProvider>
        </QueryClientProvider>
    );
}

export default App;

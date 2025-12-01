import {
  fetchCategories,
  fetchProducts,
  fetchStores,
  previewOrder,
} from "@/api/fnb-api";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import ProductCard from "@/components/app/ProductCard";
import SelectDropdown from "@/components/app/SelectDropdown";
import { useOrder } from "@/contexts/order-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatVnd } from "@/utils/string-utils";
import { Plus, Minus, X, Utensils } from "lucide-react";
import type { OrderPreviewLine } from "@/api/types";
import { useNavigate } from "react-router-dom";
import OrderSummary from "@/components/app/OrderSummary";

export default function MenuPage() {
  const navigate = useNavigate();

  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const { storeCode, setStoreCode } = useOrder();

  const storesQuery = useQuery({
    queryKey: ["stores"],
    queryFn: () => fetchStores(),
  });

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: () => fetchCategories(),
  });

  const productsQuery = useQuery({
    queryKey: ["products", selectedCategoryId],
    queryFn: () => fetchProducts("", 0, 20, "name", selectedCategoryId),
  });

  if (categoriesQuery.isLoading || storesQuery.isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner className="text-primary size-8" />
      </div>
    );
  }

  return (
    <div className="flex pt-10 pb-20">
      {/* Left Side */}
      <div className="w-full">
        <div className="flex items-center gap-2 mb-6">
          <div className="text-sm font-semibold whitespace-nowrap">
            Pick a store for your order:
          </div>
          <SelectDropdown
            selections={
              storesQuery.data?.map((store) => ({
                label: store.displayName,
                value: store.code,
              })) || []
            }
            onValueChange={(value: string) => setStoreCode(value)}
            placeholder="Select a store"
            initValue={storeCode || undefined}
            className="w-full"
          />
        </div>
        <div className="flex flex-wrap gap-3 mb-8 pb-4 border-b">
          <CategorySelection
            categories={categoriesQuery.data}
            selectedCategoryId={selectedCategoryId}
            setSelectedCategoryId={setSelectedCategoryId}
          />
        </div>
        {productsQuery.isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Spinner className="text-primary size-8" />
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {productsQuery.data?.content.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
      {/* Right Side */}
      <OrderSummary buttonText="Proceed to Checkout" buttonOnClick={() => navigate("/checkout")} />
    </div>
  );

  function CategorySelection({
    categories,
    selectedCategoryId,
    setSelectedCategoryId,
  }: {
    categories?: Array<{ id: string; name: string }>;
    selectedCategoryId: string;
    setSelectedCategoryId: (categoryId: string) => void;
  }) {
    return (
      <>
        <button
          onClick={() => setSelectedCategoryId("")}
          className={`cursor-pointer px-6 py-2 rounded-full text-sm font-semibold transition-all ${selectedCategoryId === ""
              ? "bg-primary text-primary-foreground"
              : "bg-accent text-accent-foreground hover:bg-accent/80"
            }`}
        >
          All
        </button>
        {categories?.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategoryId(category.id)}
            className={`cursor-pointer px-6 py-2 rounded-full text-sm font-semibold transition-all ${selectedCategoryId === category.id
                ? "bg-primary text-primary-foreground"
                : "bg-accent text-accent-foreground hover:bg-accent/80"
              }`}
          >
            {category.name}
          </button>
        ))}
      </>
    );
  }
}


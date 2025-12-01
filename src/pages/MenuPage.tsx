import { fetchCategories, fetchProducts } from "@/api/fnb-api";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import ProductCard from "@/components/app/ProductCard";

export default function MenuPage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: () => fetchCategories(),
  });

  const productsQuery = useQuery({
    queryKey: ["products", selectedCategoryId],
    queryFn: () => fetchProducts("", 0, 20, "name", selectedCategoryId),
  });

  if (categoriesQuery.isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner className="text-primary size-8" />
      </div>
    );
  }

  return (
    <div className="flex pt-10 pb-20">
      <div className="w-full">
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
      <div className="min-w-[400px] pl-10">Menu</div>
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

import { ChevronRight, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { useRef } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createProduct, fetchCategories } from "@/api/fnb-api";
import ProductForm from "@/components/app/ProductForm.tsx";
import { useAuth } from "@/contexts/auth-context";
import { Link, useNavigate } from "react-router-dom";

export default function ProductCreatePage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const formDataRef = useRef<{
    name: string;
    description: string;
    imgUrls: string[];
    basePrice: string;
    comparePrice: string;
    categoryId: string;
    options: any[];
    toppings: any[];
  } | null>(null);

  const createProductMutation = useMutation({
    mutationFn: () => {
      const data = formDataRef.current;
      if (!data) throw new Error("Form data not available");
      return createProduct(auth.token ?? "", {
        name: data.name,
        description: data.description,
        imgUrls: data.imgUrls,
        basePrice: Number(data.basePrice),
        comparePrice: Number(data.comparePrice) || null,
        categoryId: data.categoryId,
        options: data.options,
        toppings: data.toppings,
      });
    },
    onSuccess: (data) => {
      alert("Create product successfully!");
      navigate(`/admin/menu/${data.slug}`);
    },
    onError: (err) => {
      alert(err instanceof Error ? err.message : "Upload failed");
    },
  });

  return (
    <div className={"flex flex-col gap-4"}>
      {/* Header */}
      <div className={"flex justify-between items-start"}>
        <div
          className={
            "text-xl font-[600] flex justify-between items-center gap-2"
          }
        >
          <Link to={"/admin/menu"}>
            <Utensils size={16} />
          </Link>
          <ChevronRight size={14} />
          <div>New Product</div>
        </div>
        <Button
          variant={"default"}
          className={"cursor-pointer"}
          onClick={() => createProductMutation.mutate()}
        >
          Save product
        </Button>
      </div>

      {/* Body */}
      <div className={"flex gap-4"}>
        <ProductForm
          onFormDataChange={(formData: any) => {
            formDataRef.current = formData;
          }}
        />
      </div>
    </div>
  );
}

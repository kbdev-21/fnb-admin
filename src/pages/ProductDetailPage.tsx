import { Button } from "@/components/ui/button.tsx";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
    fetchCategories,
    fetchProductBySlug,
    updateProduct,
} from "@/service/fnb-api.ts";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ChevronDown, ChevronRight, Utensils } from "lucide-react";
import { Spinner } from "@/components/ui/spinner.tsx";
import { ProductForm } from "@/components/app/ProductForm.tsx";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext.tsx";

export default function ProductDetailPage() {
    const auth = useAuth();
    const navigate = useNavigate();
    const { productSlug } = useParams();

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
    const [formData, setFormData] = useState<{
        name: string;
        description: string;
        imgUrls: string[];
        basePrice: string;
        comparePrice: string;
        categoryId: string;
        options: any[];
        toppings: any[];
    } | null>(null);
    const [savable, setSavable] = useState(false);

    const productQuery = useQuery({
        queryKey: ["product", productSlug],
        queryFn: () => fetchProductBySlug(productSlug!),
    });

    const updateProductMutation = useMutation({
        mutationFn: () => {
            const data = formDataRef.current;
            const original = productQuery.data;
            if (!data || !original) throw new Error("Form data not available");

            return updateProduct(auth.token ?? "", original.id, {
                name: data.name !== original.name ? data.name : undefined,
                description:
                    data.description !== original.description
                        ? data.description
                        : undefined,
                imgUrls:
                    JSON.stringify(data.imgUrls) !==
                    JSON.stringify(original.imgUrls)
                        ? data.imgUrls
                        : undefined,
                basePrice:
                    data.basePrice !== String(original.basePrice)
                        ? Number(data.basePrice)
                        : undefined,
                comparePrice:
                    data.comparePrice !== String(original.comparePrice ?? "")
                        ? data.comparePrice === ""
                            ? null
                            : Number(data.comparePrice)
                        : undefined,
                categoryId:
                    data.categoryId !== original.categoryId
                        ? data.categoryId
                        : undefined,
                options:
                    JSON.stringify(data.options) !==
                    JSON.stringify(original.options)
                        ? data.options
                        : undefined,
                toppings:
                    JSON.stringify(data.toppings) !==
                    JSON.stringify(original.toppings)
                        ? data.toppings
                        : undefined,
            });
        },
        onSuccess: (data) => {
            alert("Update success");
            productQuery.refetch();
            navigate(`/menu/${data.slug}`);
        },
        onError: (e) => {
            alert(`Update failed: ${e.message}`);
        },
    });

    useEffect(() => {
        if (!productQuery.data || !formData) return;

        const original = productQuery.data;
        const current = formData;

        // Normalize original data for comparison (convert priceChange to strings)
        const normalizeOptions = (options: any[]) => {
            return options.map((option) => ({
                name: option.name ?? "",
                selections: (option.selections ?? []).map((selection: any) => ({
                    name: selection.name ?? "",
                    priceChange: String(selection.priceChange ?? ""),
                })),
            }));
        };

        const normalizeToppings = (toppings: any[]) => {
            return toppings.map((topping: any) => ({
                name: topping.name ?? "",
                priceChange: String(topping.priceChange ?? ""),
            }));
        };

        const isNameChanged = current.name !== original.name;
        const isDescriptionChanged =
            current.description !== original.description;
        const isImgUrlsChanged =
            JSON.stringify(current.imgUrls) !==
            JSON.stringify(original.imgUrls);
        const isBasePriceChanged =
            current.basePrice !== String(original.basePrice);
        const isComparePriceChanged =
            current.comparePrice !== String(original.comparePrice ?? "");
        const isCategoryChanged = current.categoryId !== original.categoryId;
        const isOptionsChanged =
            JSON.stringify(current.options) !==
            JSON.stringify(normalizeOptions(original.options ?? []));
        const isToppingsChanged =
            JSON.stringify(current.toppings) !==
            JSON.stringify(normalizeToppings(original.toppings ?? []));

        const hasChanged =
            isNameChanged ||
            isDescriptionChanged ||
            isImgUrlsChanged ||
            isBasePriceChanged ||
            isComparePriceChanged ||
            isCategoryChanged ||
            isOptionsChanged ||
            isToppingsChanged;

        setSavable(hasChanged);
    }, [productQuery.data, formData]);

    if (
        productQuery.isLoading ||
        productQuery.error
    ) {
        return <Spinner className={"text-primary size-8"} />;
    }
    const product = productQuery.data;

    return (
        <div className={"flex flex-col gap-4"}>
            {/* Header */}
            <div className={"flex justify-between items-start"}>
                <div
                    className={
                        "text-xl font-[600] flex justify-between items-center gap-2"
                    }
                >
                    <Link to={"/menu"}>
                        <Utensils size={16} />
                    </Link>
                    <ChevronRight size={14} />
                    <div>{product.name}</div>
                </div>
                <div className={"flex gap-2"}>
                    <Button
                        variant={"ghost"}
                        className={"bg-muted cursor-pointer"}
                    >
                        <div>Actions</div>
                        <ChevronDown />
                    </Button>
                    <Button
                        onClick={() => updateProductMutation.mutate()}
                        variant={"default"}
                        disabled={!savable}
                        className={"cursor-pointer"}
                    >
                        Save changes
                    </Button>
                </div>
            </div>

            {/* Body */}
            <div className={"flex gap-4"}>
                <ProductForm
                    initData={product}
                    onFormDataChange={(formData) => {
                        formDataRef.current = formData;
                        setFormData(formData);
                    }}
                />
            </div>
        </div>
    );
}

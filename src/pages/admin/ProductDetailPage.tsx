import { Button } from "@/components/ui/button.tsx";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
    deleteProduct,
    fetchProductBySlug,
    updateProduct,
} from "@/api/fnb-api";
import type { Product } from "@/api/types";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ChevronDown, ChevronRight, Utensils } from "lucide-react";
import { Spinner } from "@/components/ui/spinner.tsx";
import ProductForm from "@/components/app/ProductForm.tsx";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

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
            navigate(`/admin/menu/${data.slug}`);
        },
        onError: (e) => {
            alert(`Update failed: ${e.message}`);
        },
    });

    const deleteProductMutation = useMutation({
        mutationFn: () => {
            return deleteProduct(auth.token ?? "", productQuery.data?.id ?? "");
        },
        onSuccess: () => {
            alert("Delete product successfully");
            navigate("/admin/menu");
        },
        onError: () => {
            alert(`Delete failed`);
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

    if (productQuery.isLoading || productQuery.error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spinner className={"text-primary size-8"} />
            </div>
        );
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
                    <Link to={"/admin/menu"}>
                        <Utensils size={16} />
                    </Link>
                    <ChevronRight size={14} />
                    <div>{product?.name}</div>
                </div>
                <div className={"flex gap-2"}>
                    <ActionsButtonDropdown
                        productName={product?.name ?? ""}
                        onDelete={() => deleteProductMutation.mutate()}
                        isDeleting={deleteProductMutation.isPending}
                    />
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
                    onFormDataChange={(formData: any) => {
                        formDataRef.current = formData;
                        setFormData(formData);
                    }}
                />
            </div>
        </div>
    );

    function ActionsButtonDropdown({
        productName,
        onDelete,
        isDeleting,
    }: {
        productName: string;
        onDelete: () => void;
        isDeleting: boolean;
    }) {
        const [isDialogOpen, setIsDialogOpen] = useState(false);

        return (
            <>
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button variant={"ghost"} className={"bg-muted"}>
                            <div>Actions</div>
                            <ChevronDown />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem
                            className="cursor-pointer"
                            variant="destructive"
                            onClick={() => setIsDialogOpen(true)}
                        >
                            Delete product
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete Product</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete "{productName}"?
                                This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-end gap-2 mt-4">
                            <Button
                                variant="outline"
                                onClick={() => setIsDialogOpen(false)}
                                disabled={isDeleting}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={() => {
                                    onDelete();
                                    setIsDialogOpen(false);
                                }}
                                disabled={isDeleting}
                            >
                                {isDeleting ? "Deleting..." : "Delete"}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </>
        );
    }
}

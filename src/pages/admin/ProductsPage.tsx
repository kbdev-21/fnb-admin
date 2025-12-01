import { useQuery } from "@tanstack/react-query";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table.tsx";
import { formatVnd } from "@/utils/string-utils.ts";
import { Button } from "@/components/ui/button.tsx";
import { Link } from "react-router-dom";
import { fetchProducts } from "@/api/fnb-api";
import type { Product } from "@/api/types";
import { Plus, Search, Package } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import CustomPagination from "@/components/app/CustomPagination";
import SelectDropdown from "@/components/app/SelectDropdown";

export default function ProductsPage() {
    const [pageNumber, setPageNumber] = useState(0);
    const [searchKey, setSearchKey] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [sortBy, setSortBy] = useState("name");

    const productsQuery = useQuery({
        queryKey: ["products", pageNumber, searchKey, sortBy],
        queryFn: () => fetchProducts(searchKey, pageNumber, 20, sortBy, ""),
    });

    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSearchKey(searchInput);
        setPageNumber(0); // Reset to first page when searching
    };

    return (
        <div className={"flex flex-col gap-4"}>
            <div className={"flex justify-between items-center"}>
                <div className={"text-xl font-[600]"}>Menu</div>
                <div className={"flex justify-end items-center gap-2 w-[50%]"}>
                    <div className="flex gap-1.5 items-center">
                        <div className="text-sm whitespace-nowrap">Sort by</div>
                        <SortSelector />
                    </div>
                    <form
                        className="relative max-w-96 w-full"
                        onSubmit={handleSearchSubmit}
                    >
                        <Input
                            className="pr-10"
                            placeholder="Search product"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                        <Button
                            type="submit"
                            variant="ghost"
                            size="icon-sm"
                            className="absolute right-1 top-1/2 -translate-y-1/2 cursor-pointer"
                        >
                            <Search />
                        </Button>
                    </form>
                    <Link to={"/admin/menu/new-product"}>
                        <Button className={"cursor-pointer"}>
                            <Plus />
                            New product
                        </Button>
                    </Link>
                </div>
            </div>
            <div className="rounded-lg border border-border bg-card">
                {productsQuery.isLoading ? (
                    <div className="flex justify-center items-center py-16">
                        <Spinner className={"text-primary size-8"} />
                    </div>
                ) : productsQuery.error ? (
                    <div className="flex justify-center items-center py-16 text-destructive">
                        Error loading products
                    </div>
                ) : productsQuery.data?.content.length === 0 ? (
                    <div className="flex flex-col justify-center items-center py-16 gap-4">
                        <Package className="text-muted-foreground size-12" />
                        <div className="flex flex-col items-center gap-2">
                            <div className="text-lg font-[600]">
                                {searchKey
                                    ? "No products found"
                                    : "No products yet"}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                {searchKey
                                    ? "Try adjusting your search criteria"
                                    : "Get started by creating your first product"}
                            </div>
                            {!searchKey && (
                                <Link to={"/menu/new-product"} className="mt-2">
                                    <Button className={"cursor-pointer"}>
                                        <Plus />
                                        Create product
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                ) : (
                    <Table>
                        <TableHeader className={"bg-muted"}>
                            <TableRow>
                                <TableHead
                                    className={
                                        "text-muted-foreground text-center"
                                    }
                                >
                                    No.
                                </TableHead>
                                <TableHead
                                    className={
                                        "text-muted-foreground text-center"
                                    }
                                >
                                    Image
                                </TableHead>
                                <TableHead className={"text-muted-foreground"}>
                                    Name
                                </TableHead>
                                <TableHead className={"text-muted-foreground"}>
                                    Base price
                                </TableHead>
                                <TableHead className={"text-muted-foreground"}>
                                    Options and Toppings
                                </TableHead>
                                <TableHead className={"text-muted-foreground"}>
                                    Category
                                </TableHead>
                                <TableHead className={"text-muted-foreground"}>
                                    Status
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {productsQuery.data?.content.map(
                                (product: Product, index: number) => {
                                    return (
                                        <TableRow
                                            key={product.id}
                                            className={"h-14"}
                                        >
                                            <TableCell
                                                className={"text-center"}
                                            >
                                                {index + 1}
                                            </TableCell>
                                            <TableCell
                                                className={
                                                    "flex justify-center items-center h-14"
                                                }
                                            >
                                                <img
                                                    src={product.imgUrls[0]}
                                                    alt={"product-img"}
                                                    sizes={"40px"}
                                                    className={
                                                        "w-10 h-10 rounded-sm"
                                                    }
                                                />
                                            </TableCell>
                                            <TableCell className={"font-[600]"}>
                                                <Link
                                                    to={`/admin/menu/${product.slug}`}
                                                    className={
                                                        "hover:underline"
                                                    }
                                                >
                                                    {product.name}
                                                </Link>
                                            </TableCell>
                                            <TableCell>
                                                {formatVnd(product.basePrice)}đ
                                            </TableCell>
                                            <TableCell>
                                                <Link
                                                    to={`/menu/${product.slug}`}
                                                    className={
                                                        "hover:underline"
                                                    }
                                                >
                                                    {product.options.length ??
                                                        0}{" "}
                                                    options,{" "}
                                                    {product.toppings.length ??
                                                        0}{" "}
                                                    toppings
                                                </Link>
                                            </TableCell>
                                            <TableCell>
                                                {product.category.name}
                                            </TableCell>
                                            <TableCell>
                                                {product.unavailableAtStoreCodes
                                                    .length === 0
                                                    ? "Available at all stores"
                                                    : `Unavailable at ${product.unavailableAtStoreCodes.length} stores`}
                                            </TableCell>
                                        </TableRow>
                                    );
                                }
                            )}
                        </TableBody>
                    </Table>
                )}
            </div>
            <div className="w-full flex justify-end">
                <CustomPagination
                    totalPages={productsQuery.data?.totalPages ?? 0}
                    currentPage={productsQuery.data?.number ?? 0}
                    onPageChange={setPageNumber}
                    isLoading={productsQuery.isLoading}
                    error={productsQuery.error}
                />
            </div>
        </div>
    );

    function SortSelector() {
        const sortOptions = [
            { label: "Name (A-Z)", value: "name" },
            { label: "Name (Z-A)", value: "-name" },
            { label: "Newest", value: "-createdAt" },
            { label: "Oldest", value: "createdAt" },
            { label: "Price (Low to High)", value: "basePrice" },
            { label: "Price (High to Low)", value: "-basePrice" },
        ];

        return (
            <SelectDropdown
                selections={sortOptions}
                onValueChange={(value: string) => {
                    setSortBy(value);
                }}
                placeholder="Sort by"
                initValue={sortBy}
                className="w-full"
            />
        );
    }
}

import { useQuery, useMutation } from "@tanstack/react-query";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { createDiscount, deleteDiscount, fetchDiscounts } from "@/api/fnb-api";
import { Spinner } from "@/components/ui/spinner";
import { Package, Trash, Plus } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useState } from "react";
import CustomPagination from "@/components/app/CustomPagination";
import SelectDropdown from "@/components/app/SelectDropdown";
import { formatVnd } from "@/utils/string-utils";
import { formatDateTime } from "@/utils/string-utils";

export default function DiscountsPage() {
    const auth = useAuth();
    const [pageNumber, setPageNumber] = useState(0);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [code, setCode] = useState("");
    const [discountType, setDiscountType] = useState("FIXED");
    const [discountValue, setDiscountValue] = useState("");
    const [maxFixedAmount, setMaxFixedAmount] = useState("");
    const [minApplicablePrice, setMinApplicablePrice] = useState("");
    const [expiredAt, setExpiredAt] = useState("");

    const discountsQuery = useQuery({
        queryKey: ["discounts", pageNumber],
        queryFn: () => fetchDiscounts(auth.token ?? "", pageNumber, 20),
    });

    const newDiscountMutation = useMutation({
        mutationFn: () => {
            let expiredAtISO: string | null = null;
            if (expiredAt) {
                // Convert datetime-local to ISO format
                const date = new Date(expiredAt);
                expiredAtISO = date.toISOString();
            }
            // Convert percentage input (e.g., 20) to decimal (e.g., 0.2) for API
            const finalDiscountValue =
                discountType === "PERCENTAGE"
                    ? Number(discountValue) / 100
                    : Number(discountValue);

            return createDiscount(auth.token ?? "", {
                code,
                discountType,
                discountValue: finalDiscountValue,
                maxFixedAmount: maxFixedAmount ? Number(maxFixedAmount) : null,
                minApplicablePrice: minApplicablePrice
                    ? Number(minApplicablePrice)
                    : null,
                expiredAt: expiredAtISO,
            });
        },
        onSuccess: () => {
            discountsQuery.refetch();
            setIsDialogOpen(false);
            setCode("");
            setDiscountType("FIXED");
            setDiscountValue("");
            setMaxFixedAmount("");
            setMinApplicablePrice("");
            setExpiredAt("");
            alert("Create discount successfully!");
        },
        onError: (err) => {
            alert(
                err instanceof Error ? err.message : "Create discount failed"
            );
        },
    });

    const deleteDiscountMutation = useMutation({
        mutationFn: (discountId: string) => {
            return deleteDiscount(auth.token ?? "", discountId);
        },
        onSuccess: () => {
            discountsQuery.refetch();
            alert("Delete discount successfully!");
        },
        onError: (err) => {
            alert(
                err instanceof Error ? err.message : "Delete discount failed"
            );
        },
    });

    const getDiscountValueDisplay = (discount: any) => {
        if (discount.discountType === "FIXED") {
            return `${formatVnd(discount.discountValue)}đ`;
        } else if (discount.discountType === "PERCENTAGE") {
            // Convert decimal (e.g., 0.2) to percentage (e.g., 20%)
            return `${(discount.discountValue * 100).toFixed(0)}%`;
        }
        return discount.discountValue;
    };

    return (
        <div className={"flex flex-col gap-4"}>
            <div className={"flex justify-between items-center"}>
                <div className={"text-xl font-[600]"}>Discounts</div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus />
                            New discount
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>New Discount</DialogTitle>
                            <DialogDescription>
                                Create a new discount code
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <div className="text-sm">Code</div>
                                <Input
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    placeholder="Discount code"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="text-sm">Discount Type</div>
                                <SelectDropdown
                                    selections={[
                                        {
                                            label: "Fixed Amount",
                                            value: "FIXED",
                                        },
                                        {
                                            label: "Percentage",
                                            value: "PERCENTAGE",
                                        },
                                    ]}
                                    onValueChange={(value: string) =>
                                        setDiscountType(value)
                                    }
                                    placeholder="Select discount type"
                                    initValue={discountType}
                                    className="w-full"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="text-sm">Discount Value</div>
                                <Input
                                    type="number"
                                    value={discountValue}
                                    onChange={(e) =>
                                        setDiscountValue(e.target.value)
                                    }
                                    placeholder={
                                        discountType === "FIXED"
                                            ? "Amount in VND"
                                            : "Percentage (0-100)"
                                    }
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="text-sm">
                                    Max Fixed Amount (optional)
                                </div>
                                <Input
                                    type="number"
                                    value={maxFixedAmount}
                                    onChange={(e) =>
                                        setMaxFixedAmount(e.target.value)
                                    }
                                    placeholder="Maximum discount amount"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="text-sm">
                                    Min Subtotal to Use (optional)
                                </div>
                                <Input
                                    type="number"
                                    value={minApplicablePrice}
                                    onChange={(e) =>
                                        setMinApplicablePrice(e.target.value)
                                    }
                                    placeholder="Minimum order amount"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="text-sm">
                                    Expired At (optional)
                                </div>
                                <Input
                                    type="datetime-local"
                                    value={expiredAt}
                                    onChange={(e) =>
                                        setExpiredAt(e.target.value)
                                    }
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setIsDialogOpen(false)}
                                disabled={newDiscountMutation.isPending}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={() => newDiscountMutation.mutate()}
                                disabled={
                                    !code ||
                                    !discountValue ||
                                    newDiscountMutation.isPending
                                }
                            >
                                {newDiscountMutation.isPending
                                    ? "Creating..."
                                    : "Create"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            <div className="rounded-lg border border-border bg-card">
                {discountsQuery.isLoading ? (
                    <div className="flex justify-center items-center py-16">
                        <Spinner className={"text-primary size-8"} />
                    </div>
                ) : discountsQuery.error ? (
                    <div className="flex justify-center items-center py-16 text-destructive">
                        Error loading discounts
                    </div>
                ) : discountsQuery.data?.content.length === 0 ? (
                    <div className="flex flex-col justify-center items-center py-16 gap-4">
                        <Package className="text-muted-foreground size-12" />
                        <div className="flex flex-col items-center gap-2">
                            <div className="text-lg font-[600]">
                                No discounts yet
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Get started by creating your first discount
                            </div>
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
                                <TableHead className={"text-muted-foreground"}>
                                    Code
                                </TableHead>
                                <TableHead className={"text-muted-foreground"}>
                                    Value
                                </TableHead>
                                <TableHead className={"text-muted-foreground"}>
                                    Min subtotal to use
                                </TableHead>
                                <TableHead className={"text-muted-foreground"}>
                                    Usage
                                </TableHead>
                                <TableHead className={"text-muted-foreground"}>
                                    Expired at
                                </TableHead>
                                <TableHead className={"text-muted-foreground"}>
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {discountsQuery.data?.content.map(
                                (discount: any, index: number) => {
                                    return (
                                        <TableRow
                                            key={discount.id}
                                            className={"h-14"}
                                        >
                                            <TableCell
                                                className={"text-center"}
                                            >
                                                {index + 1}
                                            </TableCell>
                                            <TableCell className={"font-[600]"}>
                                                {discount.code}
                                            </TableCell>
                                            <TableCell>
                                                {getDiscountValueDisplay(
                                                    discount
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {discount.minApplicablePrice
                                                    ? `${formatVnd(
                                                          discount.minApplicablePrice
                                                      )}đ`
                                                    : "No minimum"}
                                            </TableCell>
                                            <TableCell>
                                                {discount.used ? (
                                                    <span className="text-destructive">
                                                        Used
                                                    </span>
                                                ) : (
                                                    <span className="text-green-600">
                                                        Available
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {discount.expiredAt
                                                    ? formatDateTime(
                                                          discount.expiredAt
                                                      )
                                                    : "Never"}
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="outline"
                                                    size="icon-sm"
                                                    onClick={() => {
                                                        if (
                                                            confirm(
                                                                `Are you sure you want to delete discount "${discount.code}"?`
                                                            )
                                                        ) {
                                                            deleteDiscountMutation.mutate(
                                                                discount.id
                                                            );
                                                        }
                                                    }}
                                                    disabled={
                                                        deleteDiscountMutation.isPending
                                                    }
                                                >
                                                    <Trash className="size-4 text-destructive" />
                                                </Button>
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
                    totalPages={discountsQuery.data?.totalPages ?? 0}
                    currentPage={discountsQuery.data?.number ?? 0}
                    onPageChange={setPageNumber}
                    isLoading={discountsQuery.isLoading}
                    error={discountsQuery.error}
                />
            </div>
        </div>
    );
}

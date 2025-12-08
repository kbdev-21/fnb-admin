import { useQuery, useMutation } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import {
    fetchOrderById,
    updateOrder,
} from "@/api/fnb-api";
import { useAuth } from "@/contexts/auth-context";
import { useParams, Link } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ArrowLeft, Pencil } from "lucide-react";
import OrderStatusBadge from "@/components/app/OrderStatusBadge";
import { formatVnd, uppercaseFirstLetter } from "@/utils/string-utils";
import SelectDropdown from "@/components/app/SelectDropdown";
import { useState } from "react";

export default function OrderDetailPage() {
    const auth = useAuth();
    const { orderId } = useParams<{ orderId: string }>();
    const dialogOpenRef = useRef<(() => void) | null>(null);

    const orderQuery = useQuery({
        queryKey: ["order", orderId],
        queryFn: () => fetchOrderById(auth.token ?? "", orderId!),
        enabled: !!auth.token && !!orderId,
    });

    const updateOrderMutation = useMutation({
        mutationFn: (params?: {
            status?: "PENDING" | "PREPARING" | "FULFILLED" | "CANCELED";
            paid?: boolean;
            paymentMethod?: string;
        }) => updateOrder(auth.token ?? "", orderId!, params),
        onSuccess: () => {
            alert(`Update order successfully`);
            orderQuery.refetch();
        },
        onError: () => {
            alert(`Update order failed`);
        },
    });

    if (orderQuery.isLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <Spinner className="text-primary size-8" />
            </div>
        );
    }

    if (orderQuery.error || !orderQuery.data) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <p className="text-destructive">Error loading order</p>
                <Link to="/admin/orders">
                    <Button variant="outline">Back to Orders</Button>
                </Link>
            </div>
        );
    }

    const order = orderQuery.data;

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
                <Link to="/admin/orders">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="size-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-semibold">Order Details</h1>
                    <p className="text-sm text-muted-foreground">
                        Order ID: {order.id}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Order Info */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    {/* Order Status */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Order Status</CardTitle>
                            <Button
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => {
                                    if (dialogOpenRef.current) {
                                        dialogOpenRef.current();
                                    }
                                }}
                            >
                                <Pencil />
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {/* Left Column */}
                                <div className="flex flex-col gap-4">
                                    <div>
                                        <div className="text-sm text-muted-foreground mb-2">
                                            Status
                                        </div>
                                        <OrderStatusBadge
                                            status={
                                                order.status as
                                                    | "PENDING"
                                                    | "PREPARING"
                                                    | "FULFILLED"
                                                    | "CANCELED"
                                            }
                                        />
                                    </div>
                                    <div>
                                        <div className="text-sm text-muted-foreground mb-1">
                                            Created At
                                        </div>
                                        <div className="text-sm">
                                            {new Date(
                                                order.createdAt
                                            ).toLocaleString()}
                                        </div>
                                    </div>
                                    {order.completedAt && (
                                        <div>
                                            <div className="text-sm text-muted-foreground mb-1">
                                                Completed At
                                            </div>
                                            <div className="text-sm">
                                                {new Date(
                                                    order.completedAt
                                                ).toLocaleString()}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Right Column */}
                                <div className="flex flex-col gap-4">
                                    <div>
                                        <div className="text-sm text-muted-foreground mb-1">
                                            Payment Method
                                        </div>
                                        <div className="text-sm font-medium">
                                            {uppercaseFirstLetter(
                                                order.paymentMethod
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-muted-foreground mb-1">
                                            Payment Status
                                        </div>
                                        <div className="text-sm font-medium">
                                            {order.paid ? (
                                                <span className="text-green-600">
                                                    Paid
                                                </span>
                                            ) : (
                                                <span className="text-red-600">
                                                    Unpaid
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Order Items */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Items</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            {order.lines.map((line) => (
                                <div
                                    key={line.id}
                                    className="flex gap-4 pb-4 border-b last:border-b-0 last:pb-0"
                                >
                                    <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 border border-border">
                                        <img
                                            src={line.productImgUrl}
                                            alt={line.productName}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 flex flex-col gap-1">
                                        <h4 className="font-semibold">
                                            {line.productName}
                                        </h4>
                                        {line.selectedOptions.length > 0 && (
                                            <div className="text-sm text-muted-foreground">
                                                {line.selectedOptions.map(
                                                    (opt, idx) => (
                                                        <span key={idx}>
                                                            {opt.name}:{" "}
                                                            {opt.selection}
                                                            {idx <
                                                                line
                                                                    .selectedOptions
                                                                    .length -
                                                                    1 && ", "}
                                                        </span>
                                                    )
                                                )}
                                            </div>
                                        )}
                                        {line.selectedToppings.length > 0 && (
                                            <div className="text-sm text-muted-foreground">
                                                +{" "}
                                                {line.selectedToppings
                                                    .map((t) => t.name)
                                                    .join(", ")}
                                            </div>
                                        )}
                                        <div className="flex items-center justify-between mt-2">
                                            <div className="text-sm text-muted-foreground">
                                                {line.quantity} ×{" "}
                                                {formatVnd(line.unitPrice)}đ
                                            </div>
                                            <div className="font-semibold text-primary">
                                                {formatVnd(line.lineAmount)}đ
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Discount Code */}
                            {order.discountCode && (
                                <div className="border-t border-border pt-4 mt-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">
                                            Discount Code
                                        </span>
                                        <span className="font-medium">
                                            {order.discountCode}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Message */}
                            {order.message && (
                                <div className="border-t border-border pt-4 mt-4">
                                    <div className="text-sm text-muted-foreground mb-2">
                                        Message
                                    </div>
                                    <div className="text-sm">
                                        {order.message}
                                    </div>
                                </div>
                            )}

                            {/* Price Summary */}
                            <div className="border-t border-border pt-4 mt-4 flex flex-col gap-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">
                                        Subtotal
                                    </span>
                                    <span>
                                        {formatVnd(order.subtotalAmount)}đ
                                    </span>
                                </div>
                                {order.deliveryFee > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            Delivery Fee
                                        </span>
                                        <span>
                                            {formatVnd(order.deliveryFee)}đ
                                        </span>
                                    </div>
                                )}
                                {order.discountAmount > 0 && (
                                    <div className="flex justify-between text-sm text-green-600">
                                        <span>Discount</span>
                                        <span>
                                            -{formatVnd(order.discountAmount)}đ
                                        </span>
                                    </div>
                                )}
                                <div className="border-t border-border pt-2 mt-2">
                                    <div className="flex justify-between">
                                        <span className="font-semibold">
                                            Total
                                        </span>
                                        <span className="text-xl font-bold text-primary">
                                            {formatVnd(order.totalAmount)}đ
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Order Summary */}
                <div className="flex flex-col gap-6">
                    {/* Order Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Details</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3">
                            <div>
                                <div className="text-sm text-muted-foreground">
                                    Store
                                </div>
                                <div className="font-medium">
                                    {order.storeCode}
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground">
                                    Method
                                </div>
                                <div className="font-medium">
                                    {uppercaseFirstLetter(order.orderMethod)}
                                </div>
                            </div>
                            {order.orderMethod === "DELIVERY" && (
                                <div>
                                    <div className="text-sm text-muted-foreground">
                                        Delivery Address
                                    </div>
                                    <div className="font-medium">
                                        {order.destination}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Customer Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Customer Information</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3">
                            <div>
                                <div className="text-sm text-muted-foreground">
                                    Full Name
                                </div>
                                <div className="font-medium">
                                    {order.customerName}
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground">
                                    Phone
                                </div>
                                <div className="font-medium">
                                    {order.customerPhoneNum}
                                </div>
                            </div>
                            {order.customerEmail && (
                                <div>
                                    <div className="text-sm text-muted-foreground">
                                        Email
                                    </div>
                                    <div className="font-medium">
                                        {order.customerEmail}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
            <EditStatusDialog
                onOpenRef={(openFn) => {
                    dialogOpenRef.current = openFn;
                }}
                updateOrderMutation={updateOrderMutation}
            />
        </div>
    );

    function EditStatusDialog({
        onOpenRef,
        updateOrderMutation,
    }: {
        onOpenRef?: (openFn: () => void) => void;
        updateOrderMutation: ReturnType<typeof useMutation>;
    }) {
        const [isDialogOpen, setIsDialogOpen] = useState(false);
        const [selectedStatus, setSelectedStatus] = useState<
            "PENDING" | "PREPARING" | "FULFILLED" | "CANCELED"
        >("PENDING");
        const [selectedPaid, setSelectedPaid] = useState<string>("false");
        const [selectedPaymentMethod, setSelectedPaymentMethod] =
            useState<string>("CASH");

        // Expose open function to parent
        useEffect(() => {
            if (onOpenRef) {
                onOpenRef(() => setIsDialogOpen(true));
            }
        }, [onOpenRef]);

        // Initialize state when dialog opens
        useEffect(() => {
            if (isDialogOpen && orderQuery.data) {
                setSelectedStatus(
                    orderQuery.data.status as
                        | "PENDING"
                        | "PREPARING"
                        | "FULFILLED"
                        | "CANCELED"
                );
                setSelectedPaid(orderQuery.data.paid ? "true" : "false");
                setSelectedPaymentMethod(orderQuery.data.paymentMethod);
            }
        }, [isDialogOpen, orderQuery.data]);

        const handleSave = () => {
            if (!orderQuery.data) return;

            const hasStatusChanged = selectedStatus !== orderQuery.data.status;
            const hasPaidChanged =
                (selectedPaid === "true") !== orderQuery.data.paid;
            const hasPaymentMethodChanged =
                selectedPaymentMethod !== orderQuery.data.paymentMethod;

            if (
                !hasStatusChanged &&
                !hasPaidChanged &&
                !hasPaymentMethodChanged
            ) {
                setIsDialogOpen(false);
                return;
            }

            const updateParams: {
                status?: "PENDING" | "PREPARING" | "FULFILLED" | "CANCELED";
                paid?: boolean;
                paymentMethod?: string;
            } = {};

            if (hasStatusChanged) {
                updateParams.status = selectedStatus;
            }

            if (hasPaidChanged) {
                updateParams.paid = selectedPaid === "true";
            }

            if (hasPaymentMethodChanged) {
                updateParams.paymentMethod = selectedPaymentMethod;
            }

            updateOrderMutation.mutate(updateParams);
            setIsDialogOpen(false);
        };

        return (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Order Status</DialogTitle>
                        <DialogDescription>
                            Update the order status and payment information.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-4 py-4">
                        <div className="flex flex-col gap-2">
                            <div className="text-sm">Status</div>
                            <SelectDropdown
                                selections={[
                                    { label: "Pending", value: "PENDING" },
                                    { label: "Preparing", value: "PREPARING" },
                                    { label: "Fulfilled", value: "FULFILLED" },
                                    { label: "Canceled", value: "CANCELED" },
                                ]}
                                onValueChange={(value) =>
                                    setSelectedStatus(
                                        value as
                                            | "PENDING"
                                            | "PREPARING"
                                            | "FULFILLED"
                                            | "CANCELED"
                                    )
                                }
                                placeholder="Select status"
                                initValue={selectedStatus}
                                className="w-full"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="text-sm">Payment Status</div>
                            <SelectDropdown
                                selections={[
                                    { label: "Paid", value: "true" },
                                    { label: "Unpaid", value: "false" },
                                ]}
                                onValueChange={setSelectedPaid}
                                placeholder="Select payment status"
                                initValue={selectedPaid}
                                className="w-full"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="text-sm">Payment Method</div>
                            <SelectDropdown
                                selections={[
                                    { label: "Cash", value: "CASH" },
                                    {
                                        label: "Credit Card",
                                        value: "CREDIT_CARD",
                                    },
                                    { label: "Bank", value: "BANK" },
                                    { label: "MoMo", value: "MOMO" },
                                ]}
                                onValueChange={setSelectedPaymentMethod}
                                placeholder="Select payment method"
                                initValue={selectedPaymentMethod}
                                className="w-full"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={updateOrderMutation.isPending}
                        >
                            {updateOrderMutation.isPending
                                ? "Saving..."
                                : "Save"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    }
}

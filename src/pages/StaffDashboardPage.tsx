import { useAuth } from "@/contexts/auth-context";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchOrders, updateOrder } from "@/api/fnb-api";
import type { Order } from "@/api/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Pencil,
  Package,
  MapPin,
  Clock,
  CreditCard,
  Check,
} from "lucide-react";
import OrderStatusBadge from "@/components/app/OrderStatusBadge";
import {
  formatVnd,
  formatDateTime,
  uppercaseFirstLetter,
} from "@/utils/string-utils";
import SelectDropdown from "@/components/app/SelectDropdown";

export default function StaffDashboardPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const storeCode = auth.myInfo?.staffOfStoreCode;

  useEffect(() => {
    if (
      auth.isReady &&
      (!auth.isLoggedIn() || auth.myInfo?.role !== "STAFF")
    ) {
      navigate("/");
    }
  }, [auth, navigate]);

  // Fetch PENDING orders
  const pendingOrdersQuery = useQuery({
    queryKey: ["orders", "PENDING", storeCode],
    queryFn: () =>
      fetchOrders(auth.token ?? "", {
        status: "PENDING",
        storeCode: storeCode ?? undefined,
        pageSize: 50,
        sortBy: "createdAt",
      }),
    enabled: !!auth.token && !!storeCode,
    refetchInterval: 10000, // Auto-refresh every 10 seconds
  });

  // Fetch PREPARING orders
  const preparingOrdersQuery = useQuery({
    queryKey: ["orders", "PREPARING", storeCode],
    queryFn: () =>
      fetchOrders(auth.token ?? "", {
        status: "PREPARING",
        storeCode: storeCode ?? undefined,
        pageSize: 50,
        sortBy: "createdAt",
      }),
    enabled: !!auth.token && !!storeCode,
    refetchInterval: 10000, // Auto-refresh every 10 seconds
  });

  // Fetch FULFILLED orders
  const fulfilledOrdersQuery = useQuery({
    queryKey: ["orders", "FULFILLED", storeCode],
    queryFn: () =>
      fetchOrders(auth.token ?? "", {
        status: "FULFILLED",
        storeCode: storeCode ?? undefined,
        pageSize: 50,
        sortBy: "-createdAt",
      }),
    enabled: !!auth.token && !!storeCode,
    refetchInterval: 10000, // Auto-refresh every 10 seconds
  });

  const refetchOrders = () => {
    queryClient.invalidateQueries({ queryKey: ["orders"] });
  };

  if (!storeCode) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner className="text-primary size-8" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-20 pt-10">
      <div>
        <h1 className="text-2xl font-semibold">Staff Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Store: {storeCode}
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* PENDING Orders Section */}
        <OrderSection
          title="Pending Orders"
          orders={pendingOrdersQuery.data?.content ?? []}
          isLoading={pendingOrdersQuery.isLoading}
          token={auth.token ?? ""}
          onUpdate={refetchOrders}
        />

        {/* PREPARING Orders Section */}
        <OrderSection
          title="Preparing Orders"
          orders={preparingOrdersQuery.data?.content ?? []}
          isLoading={preparingOrdersQuery.isLoading}
          token={auth.token ?? ""}
          onUpdate={refetchOrders}
        />

        {/* FULFILLED Orders Table */}
        <CompletedOrdersTable
          orders={fulfilledOrdersQuery.data?.content ?? []}
          isLoading={fulfilledOrdersQuery.isLoading}
          token={auth.token ?? ""}
          onUpdate={refetchOrders}
        />
      </div>
    </div>
  );
}

function OrderSection({
  title,
  orders,
  isLoading,
  token,
  onUpdate,
}: {
  title: string;
  orders: Order[];
  isLoading: boolean;
  token: string;
  onUpdate: () => void;
}) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center">
            <Spinner className="text-primary size-6" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{title}</span>
          <span className="text-sm font-normal text-muted-foreground">
            ({orders.length})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-row gap-4 overflow-x-auto pb-2">
          {orders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground w-full">
              No {title.toLowerCase()} at the moment
            </div>
          ) : (
            orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                token={token}
                onUpdate={onUpdate}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function OrderCard({
  order,
  token,
  onUpdate,
}: {
  order: Order;
  token: string;
  onUpdate: () => void;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const updateOrderMutation = useMutation({
    mutationFn: (params?: {
      status?: "PENDING" | "PREPARING" | "FULFILLED" | "CANCELED";
      paid?: boolean;
      paymentMethod?: string;
    }) => updateOrder(token, order.id, params),
    onSuccess: () => {
      alert("Update order successfully");
      onUpdate();
      setIsDialogOpen(false);
    },
    onError: () => {
      alert("Update order failed");
    },
  });

  return (
    <>
      <Card className="relative w-80 flex-shrink-0">
        <CardContent className="p-4">
          <div className="flex flex-col space-y-3">
            {/* Header with Order ID and Edit Button */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">
                  #{order.id.slice(0, 8)}
                </span>
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
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsDialogOpen(true)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </div>

            {/* Customer Info */}
            <div className="space-y-1 text-sm">
              <div className="font-medium">
                {order.customerName}
              </div>
              <div className="text-muted-foreground">
                {order.customerPhoneNum}
              </div>
            </div>

            {/* Order Method & Destination */}
            <div className="flex items-start gap-2 text-sm">
              {order.orderMethod === "PICK_UP" ? (
                <Package className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
              ) : (
                <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <span className="font-medium">
                  {uppercaseFirstLetter(
                    order.orderMethod.replace("_", " ")
                  )}
                </span>
                {order.destination && (
                  <div className="text-muted-foreground text-xs mt-0.5 truncate">
                    {order.destination}
                  </div>
                )}
              </div>
            </div>

            {/* Order Lines - What to prepare */}
            <div className="space-y-2 pt-2 border-t">
              <div className="text-xs font-semibold text-muted-foreground">
                Items:
              </div>
              <div className="space-y-1.5 max-h-32 overflow-y-auto">
                {order.lines.map((line) => (
                  <div
                    key={line.id}
                    className="text-sm bg-muted/50 rounded p-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium">
                          {line.productName}
                        </div>
                        {line.selectedOptions.length >
                          0 && (
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {line.selectedOptions
                                .map(
                                  (opt) =>
                                    `${opt.name}: ${opt.selection}`
                                )
                                .join(", ")}
                            </div>
                          )}
                        {line.selectedToppings.length >
                          0 && (
                            <div className="text-xs text-muted-foreground mt-0.5">
                              +{" "}
                              {line.selectedToppings
                                .map((t) => t.name)
                                .join(", ")}
                            </div>
                          )}
                      </div>
                      <div className="text-xs font-semibold flex-shrink-0">
                        x{line.quantity}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Message */}
            {order.message && (
              <div className="space-y-1 pt-2 border-t">
                <div className="text-xs font-semibold text-muted-foreground">
                  Message:
                </div>
                <div className="text-sm text-muted-foreground">
                  {order.message}
                </div>
              </div>
            )}

            {/* Payment Info */}
            <div className="flex items-center gap-2 text-sm pt-2 border-t">
              <CreditCard className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span
                className={
                  order.paid
                    ? "text-green-600 font-medium"
                    : "text-orange-600 font-medium"
                }
              >
                {order.paid ? "Paid" : "Unpaid"}
              </span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground text-xs">
                {uppercaseFirstLetter(
                  order.paymentMethod.replace("_", " ")
                )}
              </span>
            </div>

            {/* Total Amount */}
            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-sm font-semibold">
                Total:
              </span>
              <span className="text-base font-bold">
                {formatVnd(order.totalAmount)}đ
              </span>
            </div>

            {/* Created Time */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{formatDateTime(order.createdAt)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <EditOrderDialog
        order={order}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onUpdateOrder={updateOrderMutation.mutate}
        isUpdating={updateOrderMutation.isPending}
      />
    </>
  );
}

function EditOrderDialog({
  order,
  isOpen,
  onClose,
  onUpdateOrder,
  isUpdating,
}: {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
  onUpdateOrder: (params?: {
    status?: "PENDING" | "PREPARING" | "FULFILLED" | "CANCELED";
    paid?: boolean;
    paymentMethod?: string;
  }) => void;
  isUpdating: boolean;
}) {
  const [selectedStatus, setSelectedStatus] = useState<
    "PENDING" | "PREPARING" | "FULFILLED" | "CANCELED"
  >(order.status as "PENDING" | "PREPARING" | "FULFILLED" | "CANCELED");
  const [selectedPaid, setSelectedPaid] = useState<string>(
    order.paid ? "true" : "false"
  );
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>(
    order.paymentMethod
  );

  useEffect(() => {
    if (isOpen) {
      setSelectedStatus(
        order.status as
        | "PENDING"
        | "PREPARING"
        | "FULFILLED"
        | "CANCELED"
      );
      setSelectedPaid(order.paid ? "true" : "false");
      setSelectedPaymentMethod(order.paymentMethod);
    }
  }, [isOpen, order]);

  const handleSave = () => {
    const hasStatusChanged = selectedStatus !== order.status;
    const hasPaidChanged = (selectedPaid === "true") !== order.paid;
    const hasPaymentMethodChanged =
      selectedPaymentMethod !== order.paymentMethod;

    if (!hasStatusChanged && !hasPaidChanged && !hasPaymentMethodChanged) {
      onClose();
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

    onUpdateOrder(updateParams);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Order Status</DialogTitle>
          <DialogDescription>
            Update the order status and payment information.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-2">
            <div className="text-sm font-medium">Status</div>
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
            <div className="text-sm font-medium">
              Payment Status
            </div>
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
            <div className="text-sm font-medium">
              Payment Method
            </div>
            <SelectDropdown
              selections={[
                { label: "Cash", value: "CASH" },
                { label: "Credit Card", value: "CREDIT_CARD" },
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
            onClick={onClose}
            disabled={isUpdating}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isUpdating}>
            {isUpdating ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CompletedOrdersTable({
  orders,
  isLoading,
  token,
  onUpdate,
}: {
  orders: Order[];
  isLoading: boolean;
  token: string;
  onUpdate: () => void;
}) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Completed Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center py-10">
            <Spinner className="text-primary size-6" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Completed Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-border bg-card">
          {orders.length === 0 ? (
            <div className="flex justify-center items-center py-16 text-muted-foreground">
              No completed orders yet
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
                    className={`text-muted-foreground`}
                  >
                    Order ID
                  </TableHead>
                  <TableHead
                    className={"text-muted-foreground"}
                  >
                    Customer
                  </TableHead>
                  <TableHead
                    className={"text-muted-foreground"}
                  >
                    Phone
                  </TableHead>
                  <TableHead
                    className={"text-muted-foreground"}
                  >
                    Method
                  </TableHead>
                  <TableHead
                    className={"text-muted-foreground"}
                  >
                    Status
                  </TableHead>
                  <TableHead
                    className={"text-muted-foreground"}
                  >
                    Total
                  </TableHead>
                  <TableHead
                    className={"text-muted-foreground"}
                  >
                    Created At
                  </TableHead>
                  <TableHead
                    className={"text-muted-foreground"}
                  >
                    Payment
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order: Order, index: number) => {
                  return (
                    <TableRow
                      key={order.id}
                      className={"h-14"}
                    >
                      <TableCell
                        className={"text-center"}
                      >
                        {index + 1}
                      </TableCell>
                      <TableCell className={"font-[600]"}>
                        {order.id.slice(0, 8)}...
                      </TableCell>
                      <TableCell>
                        {order.customerName}
                      </TableCell>
                      <TableCell>
                        {order.customerPhoneNum}
                      </TableCell>
                      <TableCell>
                        {uppercaseFirstLetter(
                          order.orderMethod.replace(
                            "_",
                            " "
                          )
                        )}
                      </TableCell>
                      <TableCell>
                        <OrderStatusBadge
                          status={
                            order.status as
                            | "PENDING"
                            | "PREPARING"
                            | "FULFILLED"
                            | "CANCELED"
                          }
                        />
                      </TableCell>
                      <TableCell className={"font-[600]"}>
                        {formatVnd(order.totalAmount)}đ
                      </TableCell>
                      <TableCell>
                        {new Date(
                          order.createdAt
                        ).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <PaymentStatusCell
                          order={order}
                          token={token}
                          onUpdate={onUpdate}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function PaymentStatusCell({
  order,
  token,
  onUpdate,
}: {
  order: Order;
  token: string;
  onUpdate: () => void;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const updateOrderMutation = useMutation({
    mutationFn: (params?: {
      status?: "PENDING" | "PREPARING" | "FULFILLED" | "CANCELED";
      paid?: boolean;
      paymentMethod?: string;
    }) => updateOrder(token, order.id, params),
    onSuccess: () => {
      alert("Marked as paid successfully");
      onUpdate();
      setIsDialogOpen(false);
    },
    onError: () => {
      alert("Failed to update payment");
    },
  });

  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <span
          className={
            order.paid
              ? "text-green-600 font-medium"
              : "text-destructive font-medium"
          }
        >
          {order.paid ? "Paid" : "Unpaid"}
        </span>
        {!order.paid && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setIsDialogOpen(true)}
            disabled={updateOrderMutation.isPending}
          >
            <Check className="h-4 w-4" />
          </Button>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm payment</DialogTitle>
            <DialogDescription>
              Do you want to change to Paid?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={updateOrderMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={() =>
                updateOrderMutation.mutate({ paid: true })
              }
              disabled={updateOrderMutation.isPending}
            >
              {updateOrderMutation.isPending
                ? "Updating..."
                : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

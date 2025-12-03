import { useQuery, useMutation } from "@tanstack/react-query";
import {
  fetchCurrentUser,
  updateCurrentUserProfile,
  fetchOrders,
} from "@/api/fnb-api";
import type { Order } from "@/api/types";
import { useAuth } from "@/contexts/auth-context";
import { useEffect, useState } from "react";
import RoleBadge from "@/components/app/RoleBadge.tsx";
import OrderStatusBadge from "@/components/app/OrderStatusBadge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import OpenAddImageDialogButton from "@/components/app/OpenAddImageDialogButton";
import { Spinner } from "@/components/ui/spinner";
import {
  formatDateTime,
  formatVnd,
  uppercaseFirstLetter,
} from "@/utils/string-utils";
import { Clock, CreditCard, MapPin, Package } from "lucide-react";

export default function ProfilePage() {
  const auth = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [avtUrl, setAvtUrl] = useState("");

  const currentUserQuery = useQuery({
    queryKey: ["currentUser"],
    enabled: !!auth.token,
    queryFn: () => fetchCurrentUser(auth.token ?? ""),
  });

  const updateUserMutation = useMutation({
    mutationFn: (payload: {
      firstName?: string | null;
      lastName?: string | null;
      avtUrl?: string | null;
    }) => updateCurrentUserProfile(auth.token ?? "", auth.myInfo?.id ?? "", payload),
    onSuccess: () => {
      alert("Update user profile successfully");
      currentUserQuery.refetch();
    },
    onError: () => {
      alert(`Update user profile failed`);
    },
  });

  useEffect(() => {
    if (currentUserQuery.data) {
      setFirstName(currentUserQuery.data.firstName);
      setLastName(currentUserQuery.data.lastName);
      setAvtUrl(currentUserQuery.data.avtUrl);

      auth.setTokenAndMyInfo(auth.token ?? "", currentUserQuery.data);
    }
  }, [currentUserQuery.data, auth]);

  const user = auth.myInfo ?? currentUserQuery.data;

  const ordersQuery = useQuery({
    queryKey: ["myOrders", user?.phoneNum],
    enabled: !!auth.token && !!user?.phoneNum,
    queryFn: () =>
      fetchOrders(auth.token ?? "", {
        pageNumber: 0,
        pageSize: 5,
        sortBy: "-createdAt",
        searchKey: "",
        storeCode: "",
        orderMethod: "",
        status: "",
        discountCode: "",
        customerPhoneNum: user?.phoneNum ?? "",
      }),
  });

  return (
    <Card className="flex flex-col gap-4 mt-8 mb-20 w-full max-w-screen-md mx-auto px-6 pb-6">
      {/* Avatar + basic info */}
      <div className="w-full flex flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <OpenAddImageDialogButton
            triggerChild={
              <div className="relative h-16 w-16 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                <img
                  src={avtUrl}
                  alt={`${firstName} ${lastName}`}
                  className="h-full w-full object-cover"
                />
              </div>
            }
            onUploaded={(url) => setAvtUrl(url)}
          />

          <div className="flex flex-col gap-1">
            <div className="text-lg font-semibold leading-tight">
              {`${user?.firstName} ${user?.lastName}`}
            </div>
            {user && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <RoleBadge
                  role={
                    (user.role as
                      | "CUSTOMER"
                      | "STAFF"
                      | "ADMIN") ?? "CUSTOMER"
                  }
                  storeCode={
                    user.staffOfStoreCode || undefined
                  }
                />
              </div>
            )}
          </div>
        </div>
        <Button
          size={"lg"}
          className="rounded-full font-bold"
          disabled={
            updateUserMutation.isPending ||
            (user?.avtUrl === avtUrl &&
              firstName === user?.firstName &&
              lastName === user?.lastName)
          }
          onClick={() => {
            updateUserMutation.mutate({
              firstName,
              lastName,
              avtUrl,
            })
          }
          }
        >
          Save changes
        </Button>
      </div>
      {/* General information */}
      <div className="text-md font-semibold">General information</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-muted-foreground">
            Phone number
          </label>
          <Input value={user?.phoneNum ?? ""} disabled />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-muted-foreground">
            Email
          </label>
          <Input value={user?.email ?? ""} disabled />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-muted-foreground">
            First name
          </label>
          <Input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-muted-foreground">
            Last name
          </label>
          <Input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
      </div>
      {/* Lastest orders */}
      <div className="text-md font-semibold">Your lastest orders</div>
      {ordersQuery.isLoading && (
        <div className="flex justify-center items-center py-6">
          <Spinner className="text-primary size-6" />
        </div>
      )}
      {!ordersQuery.isLoading &&
        (ordersQuery.data?.content.length ?? 0) === 0 && (
          <div className="text-sm text-muted-foreground py-4">
            You have no orders yet.
          </div>
        )}
      {!ordersQuery.isLoading &&
        (ordersQuery.data?.content.length ?? 0) > 0 && (
          <div className="flex flex-col gap-3">
            {ordersQuery.data?.content.map((order: Order) => (
              <Card key={order.id} className="border rounded-lg">
                <div className="p-4 flex flex-col gap-3">
                  {/* Header */}
                  <div className="flex items-center justify-between gap-2">
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
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>
                        {formatDateTime(
                          order.createdAt
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Method & destination */}
                  <div className="flex items-start gap-2 text-sm">
                    {order.orderMethod === "PICK_UP" ? (
                      <Package className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                    ) : (
                      <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <span className="font-medium">
                        {uppercaseFirstLetter(
                          order.orderMethod.replace(
                            "_",
                            " "
                          )
                        )}
                      </span>
                      {order.destination && (
                        <div className="text-muted-foreground text-xs mt-0.5 truncate">
                          {order.destination}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-2 pt-2 border-t">
                    <div className="text-xs font-semibold text-muted-foreground">
                      Items:
                    </div>
                    <div className="space-y-1.5 max-h-40 overflow-y-auto">
                      {order.lines.map((line) => (
                        <div
                          key={line.id}
                          className="text-sm bg-muted/50 rounded p-2"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="font-medium">
                                {
                                  line.productName
                                }
                              </div>
                              {line
                                .selectedOptions
                                .length > 0 && (
                                  <div className="text-xs text-muted-foreground mt-0.5">
                                    {line.selectedOptions
                                      .map(
                                        (
                                          opt
                                        ) =>
                                          `${opt.name}: ${opt.selection}`
                                      )
                                      .join(
                                        ", "
                                      )}
                                  </div>
                                )}
                              {line
                                .selectedToppings
                                .length > 0 && (
                                  <div className="text-xs text-muted-foreground mt-0.5">
                                    +{" "}
                                    {line.selectedToppings
                                      .map(
                                        (
                                          t
                                        ) =>
                                          t.name
                                      )
                                      .join(
                                        ", "
                                      )}
                                  </div>
                                )}
                            </div>
                            <div className="text-xs font-semibold flex-shrink-0 text-right">
                              <div>
                                x{line.quantity}
                              </div>
                              <div className="text-muted-foreground">
                                {formatVnd(
                                  line.lineAmount
                                )}
                                đ
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Payment & total */}
                  <div className="flex items-center justify-between pt-2 border-t text-sm">
                    <div className="flex items-center gap-2">
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
                      <span className="text-muted-foreground text-xs">
                        •{" "}
                        {uppercaseFirstLetter(
                          order.paymentMethod.replace(
                            "_",
                            " "
                          )
                        )}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">
                        Total
                      </div>
                      <div className="text-lg font-bold text-primary">
                        {formatVnd(order.totalAmount)}đ
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
    </Card>
  );
}

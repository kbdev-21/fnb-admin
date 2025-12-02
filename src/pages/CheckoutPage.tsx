import { useEffect, useState } from "react";
import OrderSummary from "@/components/app/OrderSummary";
import { useOrder } from "@/contexts/order-context";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createOrder, fetchStores } from "@/api/fnb-api";
import { useAuth } from "@/contexts/auth-context";
import type { OrderCreateRequest } from "@/api/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import SelectDropdown from "@/components/app/SelectDropdown";
import { useNavigate } from "react-router-dom";

export default function CheckoutPage() {
    const order = useOrder();
    const auth = useAuth();
    const navigate = useNavigate();

    const [customerPhoneNum, setCustomerPhoneNum] = useState("");
    const [customerEmail, setCustomerEmail] = useState("");
    const [customerName, setCustomerName] = useState("");
    const [message, setMessage] = useState("");
    const [paymentMethod, setPaymentMethod] = useState<
        "CASH" | "CREDIT_CARD" | "BANK"
    >("CASH");

    const isCustomer = auth.isLoggedIn() && auth.myInfo?.role === "CUSTOMER";

    useEffect(() => {
        if (isCustomer && auth.myInfo) {
            setCustomerName(
                `${auth.myInfo.firstName ?? ""} ${
                    auth.myInfo.lastName ?? ""
                }`.trim()
            );
            setCustomerPhoneNum(auth.myInfo.phoneNum ?? "");
            setCustomerEmail(auth.myInfo.email ?? "");
        }
    }, [auth.myInfo, isCustomer]);

    const storesQuery = useQuery({
        queryKey: ["stores"],
        queryFn: () => fetchStores(),
    });

    const placeOrderMutation = useMutation({
        mutationFn: (orderCreateRequest: OrderCreateRequest) => {
            return createOrder(auth.token ?? "", orderCreateRequest);
        },
        onSuccess: () => {
            alert("Order placed successfully");
            order.clearLines();
            navigate("/");
        },
        onError: (err) => {
            alert(err instanceof Error ? err.message : "Place order failed");
        },
    });

    const handleOnClick = () => {
        if (!order.storeCode) {
            alert("Please select a store");
            return;
        }
        if (!customerName.trim()) {
            alert("Please enter your name");
            return;
        }
        if (!customerPhoneNum.trim()) {
            alert("Please enter your phone number");
            return;
        }
        if (order.orderMethod === "DELIVERY" && !order.destination.trim()) {
            alert("Please enter delivery address");
            return;
        }
        if (order.lines.length === 0) {
            alert("Please add items to your order");
            return;
        }

        placeOrderMutation.mutate({
            storeCode: order.storeCode,
            customerPhoneNum: customerPhoneNum.trim(),
            customerEmail: customerEmail.trim() || null,
            customerName: customerName.trim(),
            message: message.trim() || null,
            orderMethod: order.orderMethod,
            destination: order.destination,
            discountCode: order.discountCode,
            status: null,
            paid: null,
            paymentMethod: paymentMethod,
            lines: order.lines,
        });
    };

    return (
        <div className="flex pt-10 pb-20">
            {/* Left Side */}
            <div className="w-full">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">
                            Checkout Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-6">
                        {/* Store Selection */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">
                                Store *
                            </label>
                            <SelectDropdown
                                selections={
                                    storesQuery.data?.map((store) => ({
                                        label: store.displayName,
                                        value: store.code,
                                    })) || []
                                }
                                onValueChange={(value: string) =>
                                    order.setStoreCode(value)
                                }
                                placeholder="Select a store"
                                initValue={order.storeCode || undefined}
                                className="w-full"
                            />
                        </div>

                        {/* Customer Name */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">
                                Full Name *
                            </label>
                            <Input
                                placeholder="Enter your name"
                                value={customerName}
                                onChange={(e) =>
                                    setCustomerName(e.target.value)
                                }
                                disabled={isCustomer}
                            />
                        </div>

                        {/* Customer Phone */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">
                                Phone Number *
                            </label>
                            <Input
                                type="tel"
                                placeholder="Enter your phone number"
                                value={customerPhoneNum}
                                onChange={(e) =>
                                    setCustomerPhoneNum(e.target.value)
                                }
                                disabled={isCustomer}
                            />
                        </div>

                        {/* Customer Email */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">
                                Email (Optional)
                            </label>
                            <Input
                                type="email"
                                placeholder="Enter your email"
                                value={customerEmail}
                                onChange={(e) =>
                                    setCustomerEmail(e.target.value)
                                }
                                disabled={isCustomer}
                            />
                        </div>

                        {/* Order Method */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">
                                Order Method *
                            </label>
                            <RadioGroup
                                value={order.orderMethod}
                                onValueChange={(value) =>
                                    order.setOrderMethod(
                                        value as "PICK_UP" | "DELIVERY"
                                    )
                                }
                                className="flex gap-6 text-sm"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem
                                        value="DELIVERY"
                                        id="delivery"
                                    />
                                    <label
                                        htmlFor="delivery"
                                        className="font-normal cursor-pointer"
                                    >
                                        Delivery
                                    </label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem
                                        value="PICK_UP"
                                        id="pickup"
                                    />
                                    <label
                                        htmlFor="pickup"
                                        className="font-normal cursor-pointer"
                                    >
                                        Pick Up
                                    </label>
                                </div>
                            </RadioGroup>
                        </div>

                        {/* Destination - Only show when DELIVERY */}
                        {order.orderMethod === "DELIVERY" && (
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium">
                                    Delivery Address *
                                </label>
                                <Input
                                    placeholder="Enter delivery address"
                                    value={order.destination}
                                    onChange={(e) =>
                                        order.setDestination(e.target.value)
                                    }
                                />
                            </div>
                        )}

                        {/* Payment Method */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">
                                Payment Method *
                            </label>
                            <RadioGroup
                                value={paymentMethod}
                                onValueChange={(value) =>
                                    setPaymentMethod(
                                        value as "CASH" | "CREDIT_CARD" | "BANK"
                                    )
                                }
                                className="flex gap-6 text-sm"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="CASH" id="cash" />
                                    <label
                                        htmlFor="cash"
                                        className="font-normal cursor-pointer"
                                    >
                                        Cash
                                    </label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem
                                        value="CREDIT_CARD"
                                        id="credit_card"
                                        disabled
                                    />
                                    <label
                                        htmlFor="credit_card"
                                        className="font-normal opacity-50"
                                    >
                                        Credit Card
                                    </label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem
                                        value="BANK"
                                        id="bank"
                                        disabled
                                    />
                                    <label
                                        htmlFor="bank"
                                        className="font-normal opacity-50"
                                    >
                                        Bank
                                    </label>
                                </div>
                            </RadioGroup>
                        </div>

                        {/* Message */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">
                                Message (Optional)
                            </label>
                            <Textarea
                                placeholder="Any special instructions or notes..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                rows={4}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Right Side */}
            <OrderSummary
                buttonText="Place Order"
                buttonOnClick={handleOnClick}
            />
        </div>
    );
}

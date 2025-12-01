import {
  previewOrder,
} from "@/api/fnb-api";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { useOrder } from "@/contexts/order-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatVnd } from "@/utils/string-utils";
import {
  Plus,
  Minus,
  X,
  Utensils,
} from "lucide-react";
import type { OrderPreviewLine } from "@/api/types";

export default function OrderSummary(
  {buttonText, buttonOnClick}: 
  {buttonText: string, buttonOnClick: () => void}
) {
  const {
    storeCode,
    orderMethod,
    destination,
    discountCode,
    lines,
    increaseLineQuantity,
    decreaseLineQuantity,
    setDiscountCode,
  } = useOrder();

  const [discountInput, setDiscountInput] = useState(discountCode || "");
  const [discountAlertText, setDiscountAlertText] = useState<string | null>(
    null
  );

  const previewQuery = useQuery({
    queryKey: [
      "preview",
      storeCode,
      orderMethod,
      destination,
      discountCode,
      lines,
    ],
    queryFn: () =>
      previewOrder({
        storeCode: storeCode || "",
        orderMethod: orderMethod,
        destination: destination,
        discountCode: discountCode,
        lines: lines,
      }),
    enabled: !!storeCode && lines.length > 0,
  });

  useEffect(() => {
    if (storeCode && lines.length > 0) {
      previewQuery.refetch();
    }
  }, [storeCode, orderMethod, destination, discountCode, lines]);

  useEffect(() => {
    if (discountCode !== null && previewQuery.data?.discountCode === null) {
      setDiscountAlertText("This code is invalid and will not be applied");
    } else {
      setDiscountAlertText(null);
    }
  }, [previewQuery.data, discountCode]);

  const handleApplyDiscount = () => {
    const code = discountInput.trim() || null;
    setDiscountCode(code);
    // Clear alert when applying - validation will run after query completes
    if (code) {
      setDiscountAlertText(null);
    }
  };

  const handleRemoveDiscount = () => {
    setDiscountCode(null);
    setDiscountInput("");
  };

  if (!storeCode || lines.length === 0 || previewQuery.error) {
    let errorText = "Add an item to continue";
    if (!storeCode) {
      errorText = "Select a store to continue";
    }
    if (previewQuery.error) {
      errorText = "Error loading order preview";
    }
    return (
      <div className="min-w-[400px] pl-10">
        <Card className="sticky top-4">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Utensils className="size-12 text-muted-foreground mb-4" />
            <p className="text-center">{errorText}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-w-[400px] pl-10">
      <Card className="sticky top-4">
        <CardHeader>
          <CardTitle className="text-xl">Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {/* Order Items */}
          <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto">
            {previewQuery.isLoading ? (
              <div className="flex justify-center py-8">
                <Spinner className="text-primary size-6" />
              </div>
            ) : previewQuery.data?.lines.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No items in cart
              </p>
            ) : (
              previewQuery.data?.lines
                .map((previewLine, index) => {
                  const orderLine = lines[index];
                  if (!orderLine) return null;

                  return (
                    <OrderLineItem
                      key={`${previewLine.productId}-${index}`}
                      line={previewLine}
                      onIncrease={() => {
                        increaseLineQuantity(
                          orderLine.productId,
                          orderLine.selectedOptions,
                          orderLine.selectedToppingIds,
                          1
                        );
                      }}
                      onDecrease={() => {
                        decreaseLineQuantity(
                          orderLine.productId,
                          orderLine.selectedOptions,
                          orderLine.selectedToppingIds
                        );
                      }}
                    />
                  );
                })
                .filter(Boolean)
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-border" />

          {/* Discount Code */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">
              Discount Code
            </label>
            {discountCode ? (
              <div className="flex items-center gap-2">
                <div className="flex-1 px-3 py-2 rounded-md border bg-muted/50 text-sm">
                  {discountCode}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleRemoveDiscount}
                  className="shrink-0"
                >
                  <X className="size-4" />
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  placeholder="Enter discount code"
                  value={discountInput}
                  onChange={(e) =>
                    setDiscountInput(e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleApplyDiscount();
                    }
                  }}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  onClick={handleApplyDiscount}
                  disabled={!discountInput.trim()}
                >
                  Apply
                </Button>
              </div>
            )}
            {discountAlertText && (
              <div className="text-xs text-destructive">
                {discountAlertText}
              </div>
            )}
          </div>

          {/* Price Breakdown */}
          {previewQuery.data && (
            <>
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Subtotal
                  </span>
                  <span>
                    {formatVnd(
                      previewQuery.data.subtotalAmount
                    )}
                    đ
                  </span>
                </div>
                {previewQuery.data.deliveryFee > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Delivery Fee
                    </span>
                    <span>
                      {formatVnd(
                        previewQuery.data.deliveryFee
                      )}
                      đ
                    </span>
                  </div>
                )}
                {previewQuery.data.discountAmount > 0 && (
                  <div className="flex justify-between text-green-600 dark:text-green-400">
                    <span>Discount</span>
                    <span>
                      -
                      {formatVnd(
                        previewQuery.data.discountAmount
                      )}
                      đ
                    </span>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="border-t border-border" />

              {/* Total */}
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">
                  Total
                </span>
                <span className="text-2xl font-bold text-primary">
                  {formatVnd(previewQuery.data.totalAmount)}đ
                </span>
              </div>

              {/* Checkout Button */}
              <Button
                size="lg"
                className="w-full mt-2 rounded-full font-bold"
                onClick={buttonOnClick}
              >
                {buttonText}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function OrderLineItem({
  line,
  onIncrease,
  onDecrease,
}: {
  line: OrderPreviewLine;
  onIncrease: () => void;
  onDecrease: () => void;
}) {
  return (
    <div className="flex gap-3">
      {/* Product Image */}
      <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 border border-border">
        <img
          src={line.productImgUrl}
          alt={line.productName}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 flex flex-col gap-1 min-w-0">
        <h4 className="font-semibold text-sm line-clamp-2">
          {line.productName}
        </h4>

        {/* Options */}
        {line.selectedOptions.length > 0 && (
          <div className="text-xs text-muted-foreground">
            {line.selectedOptions.map((opt, idx) => (
              <span key={idx}>
                {opt.name}: {opt.selection}
                {idx < line.selectedOptions.length - 1 && ", "}
              </span>
            ))}
          </div>
        )}

        {/* Toppings */}
        {line.selectedToppings.length > 0 && (
          <div className="text-xs text-muted-foreground">
            + {line.selectedToppings.map((t) => t.name).join(", ")}
          </div>
        )}

        {/* Price and Quantity */}
        <div className="flex items-center justify-between mt-1">
          <div className="text-sm font-semibold text-primary mt-1">
            {formatVnd(line.lineAmount)}đ
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={onDecrease}
              className="h-7 w-7"
            >
              <Minus className="size-3" />
            </Button>
            <span className="text-sm font-medium w-8 text-center">
              {line.quantity}
            </span>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={onIncrease}
              className="h-7 w-7"
            >
              <Plus className="size-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
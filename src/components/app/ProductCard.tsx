import type { Product } from "@/api/types";
import { formatVnd } from "@/utils/string-utils";
import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { fetchProductBySlug } from "@/api/fnb-api";
import { Spinner } from "@/components/ui/spinner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { useOrder } from "@/contexts/order-context";

export default function ProductCard({ product }: { product: Product }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        className="group flex flex-col gap-3 rounded-4xl border border-border bg-card overflow-hidden transition-all duration-300 cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <div className="relative w-full aspect-square overflow-hidden">
          <img
            src={product.imgUrls[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-400 ease-in-out"
          />
        </div>
        <div className="flex flex-col gap-2 px-4 pb-4 text-center">
          <h3 className="text-md font-semibold line-clamp-2 text-primary group-hover:underline transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className="text-sm font-bold text-foreground">
              {formatVnd(product.basePrice)}đ
            </span>
          </div>
        </div>
      </div>

      <ProductDetailDialog
        slug={product.slug}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </>
  );
}

function ProductDetailDialog({
  slug,
  isOpen,
  setIsOpen,
}: {
  slug: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const { increaseLineQuantity } = useOrder();

  const [selectedSelections, setSelectedSelections] = useState<
    Record<string, string>
  >({});
  const [selectedToppings, setSelectedToppings] = useState<Set<string>>(
    new Set()
  );
  const [totalPrice, setTotalPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const productQuery = useQuery({
    queryKey: ["product", slug],
    queryFn: () => fetchProductBySlug(slug),
  });

  useEffect(() => {
    if (productQuery.data?.options) {
      const initialSelections: Record<string, string> = {};
      productQuery.data.options.forEach((option) => {
        if (option.selections.length > 0) {
          initialSelections[option.id] = option.selections[0].id;
        }
      });
      setSelectedSelections(initialSelections);
    }
  }, [productQuery.data?.options]);

  useEffect(() => {
    if (!productQuery.data) {
      setTotalPrice(0);
      return;
    }

    let calculatedTotal = productQuery.data.basePrice;

    // Add price changes from selected options
    if (productQuery.data.options) {
      productQuery.data.options.forEach((option) => {
        const selectedSelectionId = selectedSelections[option.id];
        if (selectedSelectionId) {
          const selection = option.selections.find(
            (s) => s.id === selectedSelectionId
          );
          if (selection) {
            calculatedTotal += selection.priceChange;
          }
        }
      });
    }

    // Add price changes from selected toppings
    if (productQuery.data.toppings) {
      productQuery.data.toppings.forEach((topping) => {
        if (selectedToppings.has(topping.id)) {
          calculatedTotal += topping.priceChange;
        }
      });
    }

    setTotalPrice(calculatedTotal * quantity);
  }, [productQuery.data, selectedSelections, selectedToppings, quantity]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="!max-w-[1000px] lg:!max-w-[1000px] w-[90vw] max-h-[90vh] overflow-y-auto">
        {productQuery.isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Spinner className="text-primary size-8" />
          </div>
        ) : productQuery.isError ? (
          <div>Error: {productQuery.error.message}</div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <img
                className="w-full h-full object-cover"
                src={productQuery.data?.imgUrls[0]}
                alt={productQuery.data?.name}
              />
            </div>
            <div className="pl-10 flex flex-col gap-4">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <div className="text-xl font-bold">
                    {productQuery.data?.name}
                    {Object.keys(selectedSelections)
                      .length > 0 && (
                        <span className="text-sm font-normal text-muted-foreground ml-2">
                          (
                          {Object.values(
                            selectedSelections
                          )
                            .map((selectionId) => {
                              const selection =
                                productQuery.data?.options
                                  .flatMap(
                                    (opt) =>
                                      opt.selections
                                  )
                                  .find(
                                    (s) =>
                                      s.id ===
                                      selectionId
                                  );
                              return selection?.name;
                            })
                            .filter(Boolean)
                            .join(", ")}
                          )
                        </span>
                      )}
                  </div>
                  <div className="text-muted-foreground text-sm">
                    {productQuery.data?.description}
                  </div>
                  <div className="text-lg font-bold text-primary">
                    {formatVnd(totalPrice)}đ
                  </div>
                </div>
                {productQuery.data?.options &&
                  productQuery.data.options.length > 0 && (
                    <div className="flex flex-col gap-4">
                      {productQuery.data.options.map(
                        (option) => (
                          <div
                            key={option.id}
                            className="flex flex-col gap-2"
                          >
                            <label className="text-sm font-semibold">
                              {option.name}
                            </label>
                            <RadioGroup
                              className="flex gap-4"
                              value={
                                selectedSelections[
                                option.id
                                ] || ""
                              }
                              onValueChange={(
                                value
                              ) => {
                                setSelectedSelections(
                                  (prev) => ({
                                    ...prev,
                                    [option.id]:
                                      value,
                                  })
                                );
                              }}
                            >
                              {option.selections.map(
                                (selection) => (
                                  <div
                                    key={
                                      selection.id
                                    }
                                    className="flex items-center space-x-2"
                                  >
                                    <RadioGroupItem
                                      className="cursor-pointer"
                                      value={
                                        selection.id
                                      }
                                      id={
                                        selection.id
                                      }
                                    />
                                    <label
                                      htmlFor={
                                        selection.id
                                      }
                                      className="font-normal cursor-pointer"
                                    >
                                      {
                                        selection.name
                                      }
                                      {selection.priceChange !==
                                        0 && (
                                          <span className="text-muted-foreground ml-2">
                                            (
                                            {selection.priceChange >
                                              0
                                              ? "+"
                                              : ""}
                                            {formatVnd(
                                              selection.priceChange
                                            )}
                                            đ)
                                          </span>
                                        )}
                                    </label>
                                  </div>
                                )
                              )}
                            </RadioGroup>
                          </div>
                        )
                      )}
                    </div>
                  )}
                {productQuery.data?.toppings &&
                  productQuery.data.toppings.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold">
                        Toppings
                      </label>
                      <div className="flex flex-col gap-2">
                        {productQuery.data.toppings.map(
                          (topping) => (
                            <div
                              key={topping.id}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                className="cursor-pointer"
                                id={topping.id}
                                checked={selectedToppings.has(
                                  topping.id
                                )}
                                onCheckedChange={(
                                  checked
                                ) => {
                                  setSelectedToppings(
                                    (
                                      prev
                                    ) => {
                                      const newSet =
                                        new Set(
                                          prev
                                        );
                                      if (
                                        checked
                                      ) {
                                        newSet.add(
                                          topping.id
                                        );
                                      } else {
                                        newSet.delete(
                                          topping.id
                                        );
                                      }
                                      return newSet;
                                    }
                                  );
                                }}
                              />
                              <label
                                htmlFor={
                                  topping.id
                                }
                                className="font-normal cursor-pointer"
                              >
                                {topping.name}
                                {topping.priceChange !==
                                  0 && (
                                    <span className="text-muted-foreground ml-2">
                                      (
                                      {topping.priceChange >
                                        0
                                        ? "+"
                                        : ""}
                                      {formatVnd(
                                        topping.priceChange
                                      )}
                                      đ)
                                    </span>
                                  )}
                              </label>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                <div className="flex items-center justify-between gap-4 pt-4 border-t">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        setQuantity((prev) =>
                          Math.max(1, prev - 1)
                        )
                      }
                      className="cursor-pointer"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="text-md font-semibold w-8 text-center">
                      {quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        setQuantity((prev) => prev + 1)
                      }
                      className="cursor-pointer"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    size="lg"
                    className="cursor-pointer rounded-full font-bold"
                    onClick={() => {
                      // TODO: Add to order logic
                      increaseLineQuantity(
                        productQuery.data?.id || "",
                        Object.entries(selectedSelections).map(([optionId, selectionId]) => ({
                          optionId,
                          selectionId,
                        })),
                        Array.from(selectedToppings),
                        quantity
                      );
                      setIsOpen(false);
                    }}
                  >
                    Add to order
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

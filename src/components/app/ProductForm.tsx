import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Trash } from "lucide-react";
import { OpenAddImageDialogButton } from "@/components/app/OpenAddImageDialogButton";
import type { OptionDto, ToppingDto } from "@/service/types";

export type ProductFormValues = {
  name: string;
  description: string;
  imgUrls: string[];
  basePrice: string;
  comparePrice: string;
  categoryId: string;
  options: OptionDto[];
  toppings: ToppingDto[];
};

/* TODO: use this shit */
export default function ProductForm({ initialValue, categories, submitLabel, onSubmit }: {
  initialValue: ProductFormValues;
  categories: any[];
  submitLabel: string;
  onSubmit: (data: ProductFormValues) => void;
}) {

  const [state, setState] = useState<ProductFormValues>(initialValue);
  const { name, description, imgUrls, basePrice, comparePrice, categoryId, options, toppings } = state;

  useEffect(() => setState(initialValue), [initialValue]);

  const update = (patch: Partial<ProductFormValues>) =>
    setState(prev => ({ ...prev, ...patch }));

  const updateOption = (index: number, patch: Partial<OptionDto>) =>
    update({
      options: options.map((o, i) => (i === index ? { ...o, ...patch } : o))
    });

  const updateTopping = (index: number, patch: Partial<ToppingDto>) =>
    update({
      toppings: toppings.map((t, i) => (i === index ? { ...t, ...patch } : t))
    });


  return (
    <div className="flex flex-col gap-4">

      {/* General Info */}
      <Card className="p-4 flex flex-col gap-3">
        <Input value={name} onChange={(e) => update({ name: e.target.value })} placeholder="Product name" />
        <Input value={description} onChange={(e) => update({ description: e.target.value })} placeholder="Description" />

        <div className="flex gap-4 items-center">
          {imgUrls.map(url => (
            <img key={url} src={url} className="h-20 w-20 rounded object-cover" />
          ))}
          <OpenAddImageDialogButton onUploaded={(url) => update({ imgUrls: [...imgUrls, url] })} />
        </div>

        <Input type="number" value={basePrice} onChange={(e) => update({ basePrice: e.target.value })} placeholder="Base price" />
        <Input type="number" value={comparePrice} onChange={(e) => update({ comparePrice: e.target.value })} placeholder="Compare price" />

        <select
          value={categoryId}
          onChange={e => update({ categoryId: e.target.value })}
          className="border rounded p-2"
        >
          <option value="">Select category</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </Card>


      {/* Options */}
      <Card className="p-4 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="font-semibold">Options</div>
          <Button variant="outline" onClick={() =>
            update({ options: [...options, { name: "", selections: [{ name: "", priceChange: "" }] }] })
          }>
            <Plus /> Add option
          </Button>
        </div>

        {options.map((option, index) => (
          <Card key={index} className="p-4 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Input
                value={option.name}
                onChange={(e) => updateOption(index, { name: e.target.value })}
                placeholder="Option name"
              />

              <Button variant="outline" onClick={() =>
                updateOption(index, { selections: [...option.selections, { name: "", priceChange: "" }] })
              }>
                <Plus /> Add selection
              </Button>

              <Button variant="destructive" onClick={() =>
                update({ options: options.filter((_, i) => i !== index) })
              }>
                Delete
              </Button>
            </div>

            <div className="flex flex-col gap-2">
              {option.selections.map((selection, selIndex) => (
                <div key={selIndex} className="flex gap-3 items-center">
                  <Input
                    value={selection.name}
                    onChange={(e) => {
                      const newSelections = option.selections.map((s, i) =>
                        i === selIndex ? { ...s, name: e.target.value } : s
                      );
                      updateOption(index, { selections: newSelections });
                    }}
                    placeholder="Selection name"
                  />
                  <Input
                    type="number"
                    value={selection.priceChange}
                    onChange={(e) => {
                      const newSelections = option.selections.map((s, i) =>
                        i === selIndex ? { ...s, priceChange: e.target.value } : s
                      );
                      updateOption(index, { selections: newSelections });
                    }}
                    placeholder="Price change"
                  />
                  <Button
                    variant="destructive"
                    size="icon-sm"
                    onClick={() =>
                      updateOption(index, {
                        selections: option.selections.filter((_, i) => i !== selIndex)
                      })
                    }
                  >
                    <Trash />
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </Card>


      {/* Toppings */}
      <Card className="p-4 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="font-semibold">Toppings</div>
          <Button variant="outline" onClick={() =>
            update({ toppings: [...toppings, { name: "", priceChange: "" }] })
          }>
            <Plus /> Add topping
          </Button>
        </div>

        {toppings.map((topping, index) => (
          <Card key={index} className="p-4 flex flex-col gap-3">
            <Input
              value={topping.name}
              onChange={(e) => updateTopping(index, { name: e.target.value })}
              placeholder="Topping name"
            />
            <Input
              type="number"
              value={topping.priceChange}
              onChange={(e) => updateTopping(index, { priceChange: e.target.value })}
              placeholder="Price change"
            />
            <Button variant="destructive" onClick={() =>
              update({ toppings: toppings.filter((_, i) => i !== index) })
            }>
              Remove
            </Button>
          </Card>
        ))}
      </Card>

      <Button onClick={() => onSubmit(state)}>{submitLabel}</Button>
    </div>
  );
}

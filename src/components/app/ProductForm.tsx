import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button.tsx";
import { Card } from "@/components/ui/card.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select.tsx";
import OpenAddImageDialogButton from "@/components/app/OpenAddImageDialogButton.tsx";
import type { OptionDto, ToppingDto } from "@/api/types";
import { Plus, Trash } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "@/api/fnb-api";

type ProductFormProps = {
    initData?: {
        name: string;
        description?: string | null;
        imgUrls?: string[] | null;
        basePrice?: number | null;
        comparePrice?: number | null;
        categoryId?: string | null;
        options?: OptionDto[] | null;
        toppings?: ToppingDto[] | null;
    };
    onFormDataChange?: (formData: {
        name: string;
        description: string;
        imgUrls: string[];
        basePrice: string;
        comparePrice: string;
        categoryId: string;
        options: OptionDto[];
        toppings: ToppingDto[];
    }) => void;
};

export default function ProductForm({ initData, onFormDataChange }: ProductFormProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [imgUrls, setImgUrls] = useState<string[]>([]);
    const [basePrice, setBasePrice] = useState("");
    const [comparePrice, setComparePrice] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [options, setOptions] = useState<OptionDto[]>([]);
    const [toppings, setToppings] = useState<ToppingDto[]>([]);
    const onFormDataChangeRef = useRef(onFormDataChange);

    const categoriesQuery = useQuery({
        queryKey: ["categories"],
        queryFn: () => fetchCategories(),
    });

    // Keep ref updated with latest callback
    useEffect(() => {
        onFormDataChangeRef.current = onFormDataChange;
    }, [onFormDataChange]);

    // Initialize form from initData
    useEffect(() => {
        if (initData) {
            setName(initData.name ?? "");
            setDescription(initData.description ?? "");
            setImgUrls(initData.imgUrls ?? []);
            setBasePrice(String(initData.basePrice ?? ""));
            setComparePrice(String(initData.comparePrice ?? ""));
            setCategoryId(initData.categoryId ?? "");

            // Normalize options - convert priceChange to string
            const normalizedOptions = (initData.options ?? []).map(
                (option) => ({
                    name: option.name ?? "",
                    selections: (option.selections ?? []).map(
                        (selection: any) => ({
                            name: selection.name ?? "",
                            priceChange: String(selection.priceChange ?? ""),
                        })
                    ),
                })
            );
            setOptions(normalizedOptions);

            // Normalize toppings - convert priceChange to string
            const normalizedToppings = (initData.toppings ?? []).map(
                (topping: any) => ({
                    name: topping.name ?? "",
                    priceChange: String(topping.priceChange ?? ""),
                })
            );
            setToppings(normalizedToppings);
        }
    }, [initData]);

    // Notify parent of form data changes
    useEffect(() => {
        if (onFormDataChangeRef.current) {
            onFormDataChangeRef.current({
                name,
                description,
                imgUrls,
                basePrice,
                comparePrice,
                categoryId,
                options,
                toppings,
            });
        }
    }, [
        name,
        description,
        imgUrls,
        basePrice,
        comparePrice,
        categoryId,
        options,
        toppings,
    ]);

    return (
        <div className={"w-full flex flex-col gap-4"}>
            {/* General info card */}
            <Card className={"p-4"}>
                <div className={"flex flex-col gap-2"}>
                    <div className={"text-sm"}>Name</div>
                    <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className={"flex flex-col gap-2"}>
                    <div className={"text-sm"}>Description</div>
                    <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div className={"flex flex-col gap-2"}>
                    <div className={"text-sm"}>Images</div>
                    <div className={"flex gap-4"}>
                        {imgUrls.map((imgUrl) => (
                            <img
                                key={imgUrl}
                                src={imgUrl}
                                alt={imgUrl}
                                className={
                                    "h-20 w-20 rounded-md border border-muted-foreground"
                                }
                            />
                        ))}
                        <OpenAddImageDialogButton
                            onUploaded={(url) => {
                                setImgUrls((prev) => [...prev, url]);
                            }}
                        />
                    </div>
                </div>
                <div className={"grid grid-cols-2 w-full gap-4"}>
                    <div className={"flex flex-col gap-2"}>
                        <div className={"text-sm"}>Base Price (VND)</div>
                        <Input
                            value={basePrice}
                            onChange={(e) => setBasePrice(e.target.value)}
                            type={"number"}
                        />
                    </div>
                    <div className={"flex flex-col gap-2"}>
                        <div className={"text-sm"}>
                            Compare Price (VND) (optional)
                        </div>
                        <Input
                            value={comparePrice}
                            onChange={(e) => setComparePrice(e.target.value)}
                            type={"number"}
                        />
                    </div>
                </div>
                <div className={"flex flex-col gap-2"}>
                    <div className={"text-sm"}>Category</div>
                    <div className={"w-full"}>
                        <Select
                            value={categoryId}
                            onValueChange={(value) => {
                                const selected = categoriesQuery.data?.find(
                                    (c) => c.id === value
                                );
                                if (selected) {
                                    setCategoryId(selected.id);
                                }
                            }}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Choose a category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Categories</SelectLabel>
                                    {categoriesQuery.data?.map(
                                        (currentCategory) => (
                                            <SelectItem
                                                value={currentCategory.id}
                                                key={currentCategory.id}
                                            >
                                                {currentCategory.name}
                                            </SelectItem>
                                        )
                                    )}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </Card>

            {/* Options list card */}
            <Card className="p-4 gap-4">
                <div className="flex justify-between items-center">
                    <div className="text-sm font-[600]">Options</div>
                    <Button
                        onClick={() => {
                            setOptions((prev) => [
                                ...prev,
                                {
                                    name: "",
                                    selections: [{ name: "", priceChange: "" }],
                                },
                            ]);
                        }}
                        variant="outline"
                        className="cursor-pointer"
                    >
                        <Plus /> Add option
                    </Button>
                </div>

                <div className="flex flex-col gap-4">
                    {options.map((option, index) => (
                        <Card key={index} className="p-4">
                            {/* Option Header */}
                            <div className="flex gap-4 items-end mb-2">
                                <div className="w-full flex flex-col gap-2">
                                    <div className="text-sm">Option Name</div>
                                    <Input
                                        value={option.name}
                                        onChange={(e) => {
                                            const newOptions = [...options];
                                            newOptions[index].name =
                                                e.target.value;
                                            setOptions(newOptions);
                                        }}
                                    />
                                </div>
                                <Button
                                    onClick={() => {
                                        const newOptions = [...options];
                                        newOptions[index].selections.push({
                                            name: "",
                                            priceChange: "",
                                        });
                                        setOptions(newOptions);
                                    }}
                                    variant="outline"
                                    className="cursor-pointer"
                                >
                                    <Plus /> Add selection
                                </Button>
                                <Button
                                    onClick={() => {
                                        setOptions((prev) =>
                                            prev.filter((_, i) => i !== index)
                                        );
                                    }}
                                    variant="destructive"
                                    className="cursor-pointer"
                                >
                                    Delete
                                </Button>
                            </div>

                            {/* Selections */}
                            <div className="flex flex-col gap-2">
                                <div className={"text-sm"}>
                                    Selections and Price changes (đ)
                                </div>
                                {option.selections.map(
                                    (selection: any, selIndex: number) => (
                                        <div
                                            className="flex gap-4 items-center"
                                            key={selIndex}
                                        >
                                            <div className="w-full">
                                                <Input
                                                    value={selection.name}
                                                    onChange={(e) => {
                                                        const newOptions = [
                                                            ...options,
                                                        ];
                                                        newOptions[
                                                            index
                                                        ].selections[
                                                            selIndex
                                                        ].name = e.target.value;
                                                        setOptions(newOptions);
                                                    }}
                                                />
                                            </div>
                                            <div className="w-[300px]">
                                                <Input
                                                    type="number"
                                                    value={
                                                        selection.priceChange
                                                    }
                                                    onChange={(e) => {
                                                        const newOptions = [
                                                            ...options,
                                                        ];
                                                        newOptions[
                                                            index
                                                        ].selections[
                                                            selIndex
                                                        ].priceChange =
                                                            e.target.value;
                                                        setOptions(newOptions);
                                                    }}
                                                />
                                            </div>
                                            <div className="w-[80px] flex justify-center">
                                                <Button
                                                    onClick={() => {
                                                        const newOptions = [
                                                            ...options,
                                                        ];
                                                        newOptions[
                                                            index
                                                        ].selections.splice(
                                                            selIndex,
                                                            1
                                                        );
                                                        setOptions(newOptions);
                                                    }}
                                                    variant="destructive"
                                                    size="icon-sm"
                                                    className={
                                                        "bg-destructive/20 hover:bg-destructive/20 cursor-pointer"
                                                    }
                                                >
                                                    <Trash
                                                        className={
                                                            "text-destructive"
                                                        }
                                                    />
                                                </Button>
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            </Card>

            {/* Toppings list card */}
            <Card className={"p-4 gap-4"}>
                <div className={"flex justify-between items-center"}>
                    <div className={"text-sm font-[600]"}>Toppings</div>
                    <Button
                        onClick={() => {
                            setToppings((prev) => [
                                ...prev,
                                {
                                    name: "",
                                    priceChange: "",
                                },
                            ]);
                        }}
                        variant={"outline"}
                        className={"cursor-pointer"}
                    >
                        <Plus />
                        Add topping
                    </Button>
                </div>
                <div className={"flex flex-col gap-4"}>
                    {toppings.map((topping, index) => (
                        <Card key={index} className={"p-4"}>
                            <div className={"flex gap-4 items-center"}>
                                <div className={"w-full flex flex-col gap-2"}>
                                    <div className={"text-sm"}>Name</div>
                                    <Input
                                        value={topping.name}
                                        onChange={(e) => {
                                            const newToppings = [...toppings];
                                            newToppings[index].name =
                                                e.target.value;
                                            setToppings(newToppings);
                                        }}
                                    />
                                </div>
                                <div
                                    className={"w-[300px] flex flex-col gap-2"}
                                >
                                    <div className={"text-sm"}>
                                        Price change (đ)
                                    </div>
                                    <Input
                                        value={topping.priceChange}
                                        onChange={(e) => {
                                            const newToppings = [...toppings];
                                            newToppings[index].priceChange =
                                                e.target.value;
                                            setToppings(newToppings);
                                        }}
                                        type={"number"}
                                    />
                                </div>
                                <div className={"w-[80px] flex justify-center"}>
                                    <Button
                                        onClick={() => {
                                            setToppings((prev) =>
                                                prev.filter(
                                                    (_, i) => i !== index
                                                )
                                            );
                                        }}
                                        variant={"destructive"}
                                        size={"icon-sm"}
                                        className={
                                            "bg-destructive/20 hover:bg-destructive/20 cursor-pointer"
                                        }
                                    >
                                        <Trash className={"text-destructive"} />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </Card>
        </div>
    );
}

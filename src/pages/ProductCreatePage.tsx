import {ChevronRight, Plus, Trash, Utensils} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {Card} from "@/components/ui/card.tsx";
import {Input} from "@/components/ui/input.tsx";
import {useState} from "react";
import {useMutation, useQuery} from "@tanstack/react-query";
import {createProduct, fetchCategories} from "@/service/fnb-api.ts";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import {OpenAddImageDialogButton} from "@/components/app/OpenAddImageDialogButton.tsx";
import type {OptionDto, ToppingDto} from "@/service/types.ts";
import {useAuth} from "@/contexts/AuthContext.tsx";
import {Link, useNavigate} from "react-router-dom";
import {Spinner} from "@/components/ui/spinner.tsx";

export default function ProductCreatePage() {
  const auth = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imgUrls, setImgUrls] = useState<string[]>([]);
  const [basePrice, setBasePrice] = useState("");
  const [comparePrice, setComparePrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [options, setOptions] = useState<OptionDto[]>([]);
  const [toppings, setToppings] = useState<ToppingDto[]>([]);

  const createProductMutation = useMutation({
    mutationFn: () => createProduct(
      auth.token ?? "",
      {
        name: name,
        description: description,
        imgUrls: imgUrls,
        basePrice: Number(basePrice),
        comparePrice: Number(comparePrice),
        categoryId: categoryId,
        options: options,
        toppings: toppings,
      }
    ),
    onSuccess: (data) => {
      alert("Create product successfully!");
      navigate(`/menu/${data.slug}`);
    },
    onError: (err) => {
      alert(err instanceof Error ? err.message : "Upload failed")
    },
  });

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: () => fetchCategories()
  });

  if (categoriesQuery.isLoading || categoriesQuery.isError) return <Spinner className={"text-primary size-8"}/>;
  const categories = categoriesQuery.data;

  return (
    <div className={"flex flex-col gap-4"}>
      {/* Header */}
      <div className={"flex justify-between items-start"}>
        <div className={"text-xl font-[600] flex justify-between items-center gap-2"}>
          <Link to={"/menu"}>
            <Utensils size={16}/>
          </Link>
          <ChevronRight size={14}/>
          <div>New Product</div>
        </div>
        <Button variant={"default"} className={"cursor-pointer"} onClick={() => createProductMutation.mutate()}>
          Save product
        </Button>
      </div>

      {/* Body */}
      <div className={"flex gap-4"}>
        {/* Left part */}
        <div className={"w-full flex flex-col gap-4"}>
          {/* General info card */}
          <Card className={"p-4"}>
            <div className={"flex flex-col gap-2"}>
              <div className={"text-sm"}>Name</div>
              <Input value={name} onChange={(e) => setName(e.target.value)}/>
            </div>
            <div className={"flex flex-col gap-2"}>
              <div className={"text-sm"}>Description</div>
              <Input value={description} onChange={(e) => setDescription(e.target.value)}/>
            </div>
            <div className={"flex flex-col gap-2"}>
              <div className={"text-sm"}>Images</div>
              <div className={"flex gap-4"}>
                {imgUrls.map(imgUrl => (
                  <img
                    key={imgUrl}
                    src={imgUrl}
                    alt={imgUrl}
                    className={"h-20 w-20 rounded-md border border-muted-foreground"}
                  />
                ))}
                <OpenAddImageDialogButton
                  onUploaded={(url) => {
                    setImgUrls(prev => [...prev, url]);
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
                <div className={"text-sm"}>Compare Price (VND) (optional)</div>
                <Input
                  value={comparePrice}
                  onChange={(e) => setComparePrice(e.target.value)}
                  type={"number"}
                />
              </div>
            </div>
            <div className={"flex flex-col gap-2"}>
              <div className={"text-sm"}>Category</div>
              <div className={"w-full "}>
                <CategorySelector/>
              </div>
            </div>
          </Card>

          {/* Options list card */}
          <Card className="p-4 gap-4">
            <div className="flex justify-between items-center">
              <div className="text-sm font-[600]">Options</div>
              <Button
                onClick={() => {
                  setOptions(prev => [
                    ...prev,
                    { name: "", selections: [{ name: "", priceChange: "" }] }
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
                        onChange={e => {
                          const newOptions = [...options];
                          newOptions[index].name = e.target.value;
                          setOptions(newOptions);
                        }}
                      />
                    </div>
                    <Button
                      onClick={() => {
                        const newOptions = [...options];
                        newOptions[index].selections.push({ name: "", priceChange: "" });
                        setOptions(newOptions);
                      }}
                      variant="outline"
                      className="cursor-pointer"
                    >
                      <Plus /> Add selection
                    </Button>
                    <Button
                      onClick={() => {
                        setOptions(prev => prev.filter((_, i) => i !== index));
                      }}
                      variant="destructive"
                      className="cursor-pointer"
                    >
                      Delete
                    </Button>
                  </div>

                  {/* Selections */}
                  <div className="flex flex-col gap-2">
                    <div className={"text-sm"}>Selections and Price changes (đ)</div>
                    {option.selections.map((selection: any, selIndex: number) => (
                      <div className="flex gap-4 items-center" key={selIndex}>
                        <div className="w-full">
                          <Input
                            value={selection.name}
                            onChange={e => {
                              const newOptions = [...options];
                              newOptions[index].selections[selIndex].name = e.target.value;
                              setOptions(newOptions);
                            }}
                          />
                        </div>
                        <div className="w-[300px]">
                          <Input
                            type="number"
                            value={selection.priceChange}
                            onChange={e => {
                              const newOptions = [...options];
                              newOptions[index].selections[selIndex].priceChange = e.target.value;
                              setOptions(newOptions);
                            }}
                          />
                        </div>
                        <div className="w-[80px] flex justify-center">
                          <Button
                            onClick={() => {
                              const newOptions = [...options];
                              newOptions[index].selections.splice(selIndex, 1);
                              setOptions(newOptions);
                            }}
                            variant="destructive"
                            size="icon-sm"
                            className={"bg-destructive/20 hover:bg-destructive/20 cursor-pointer"}
                          >
                            <Trash className={"text-destructive"}/>
                          </Button>
                        </div>
                      </div>
                    ))}
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
                  setToppings(prev => [...prev, {
                    name: "",
                    priceChange: "",
                  }]);
                }}
                variant={"outline"}
                className={"cursor-pointer"}
              >
                <Plus/>
                Add topping
              </Button>
            </div>
            <div className={"flex flex-col gap-4"}>
              {toppings.map((topping, index) => (
                <Card className={"p-4"}>
                  <div className={"flex gap-4 items-center"}>
                    <div className={"w-full flex flex-col gap-2"}>
                      <div className={"text-sm"}>Name</div>
                      <Input
                        value={topping.name}
                        onChange={(e) => {
                          const newToppings = [...toppings];
                          newToppings[index].name = e.target.value;
                          setToppings(newToppings);
                        }}
                      />
                    </div>
                    <div className={"w-[300px] flex flex-col gap-2"}>
                      <div className={"text-sm"}>Price change (đ)</div>
                      <Input
                        value={topping.priceChange}
                        onChange={(e) => {
                          const newToppings = [...toppings];
                          newToppings[index].priceChange = e.target.value;
                          setToppings(newToppings);
                        }}
                        type={"number"}
                      />
                    </div>
                    <div className={"w-[80px] flex justify-center"}>
                      <Button
                        onClick={() => {
                          setToppings(prev => prev.filter((_, i) => i !== index));
                        }}
                        variant={"destructive"}
                        size={"icon-sm"}
                        className={"bg-destructive/20 hover:bg-destructive/20 cursor-pointer"}
                      >
                        <Trash className={"text-destructive"}/>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );

  function CategorySelector() {
    return (
      <Select
        value={categoryId}
        onValueChange={(value) => {
          const selected = categories.find((c: any) => c.id === value)
          if (selected) {
            setCategoryId(selected.id)
          }
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Choose a category"/>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Categories</SelectLabel>
            {categories.map((currentCategory: any) => (
              <SelectItem
                value={currentCategory.id}
                key={currentCategory.id}
              >
                {currentCategory.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    )
  }
}
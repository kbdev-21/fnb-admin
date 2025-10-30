import {ChevronRight, Plus, Trash, Utensils} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {Card} from "@/components/ui/card.tsx";
import {Input} from "@/components/ui/input.tsx";
import {useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {fetchCategories} from "@/service/fnb-api.ts";
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

type ToppingCreate = {
  name: string;
  priceChange: string;
}

type OptionCreate = {
  name: string;
  values: OptionCreateValue[];
}

type OptionCreateValue = {
  name: string;
  priceChange: string;
}

export default function ProductCreatePage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imgUrls, setImgUrls] = useState<string[]>([]);
  const [basePrice, setBasePrice] = useState("");
  const [comparePrice, setComparePrice] = useState("");
  const [category, setCategory] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [options, setOptions] = useState<OptionCreate[]>([{
    name: "",
    values: [
      {name: "", priceChange: ""}
    ]
  }]);
  const [toppings, setToppings] = useState<ToppingCreate[]>([{name: "", priceChange: ""}]);

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: () => fetchCategories()
  });

  if (categoriesQuery.isLoading || categoriesQuery.isError) return <div>Loading...</div>
  const categories = categoriesQuery.data;

  return (
    <div className={"flex flex-col gap-4"}>
      {/* Header */}
      <div className={"flex justify-between items-center"}>
        <div className={"text-xl font-[600] flex justify-between items-center gap-2"}>
          <Utensils size={16}/>
          <ChevronRight size={14}/>
          <div>New Product</div>
        </div>
        <Button variant={"default"}>
          <div>Save product</div>
        </Button>
      </div>

      <div className={"flex gap-4"}>
        {/* Left part */}
        <div className={"w-full flex flex-col gap-4"}>
          {/* General info card */}
          <Card className={"p-4"}>
            <div className={"flex flex-col gap-2"}>
              <div className={"text-sm"}>Name</div>
              <Input className={"border-muted-foreground"} value={name} onChange={(e) => setName(e.target.value)}/>
            </div>
            <div className={"flex flex-col gap-2"}>
              <div className={"text-sm"}>Description</div>
              <Input className={"border-muted-foreground"} value={description} onChange={(e) => setDescription(e.target.value)}/>
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
                  className={"border-muted-foreground"}
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
                  type={"number"}
                />
              </div>
              <div className={"flex flex-col gap-2"}>
                <div className={"text-sm"}>Compare Price (VND) (optional)</div>
                <Input
                  className={"border-muted-foreground"}
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

          {/* Options card */}
          <Card className={"p-4 gap-4"}>
            <div className={"flex justify-between items-center"}>
              <div className={"text-sm font-[600]"}>Options</div>
              <Button variant={"outline"} className={"cursor-pointer"}>
                <Plus/>
                Add option
              </Button>
            </div>
          </Card>

          {/* Toppings card */}
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
                <Card key={index} className={"p-4"}>
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
                        className={"border-muted-foreground"}
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
                        className={"border-muted-foreground"}
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

        {/* Right part */}
        <div className={"w-full max-w-[360px]"}>
          <Card className={"p-4 h-full"}>
            <div className={"font-[600] text-sm"}>Some shit</div>
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
          const selected = categories.find((c) => c.id === value)
          if (selected) {
            setCategoryId(selected.id)
            setCategory(selected.name)
          }
        }}
      >
        <SelectTrigger className="w-full border-muted-foreground">
          <SelectValue placeholder="Choose a category"/>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Categories</SelectLabel>
            {categories.map((currentCategory) => (
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
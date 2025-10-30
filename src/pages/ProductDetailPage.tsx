import {Button} from "@/components/ui/button.tsx";
import {useQuery} from "@tanstack/react-query";
import {fetchProductBySlug} from "@/service/fnb-api.ts";
import {useParams} from "react-router-dom";
import {ChevronDown, ChevronRight, Plus, Trash, Utensils} from "lucide-react";
import {Card} from "@/components/ui/card.tsx";
import {Input} from "@/components/ui/input.tsx";

export default function ProductDetailPage() {
  const { productSlug } = useParams();

  const productQuery = useQuery({
    queryKey: ["product", productSlug],
    queryFn: () => fetchProductBySlug(productSlug!),
  });

  if(productQuery.isLoading || productQuery.error) {return <div>Loading...</div>}
  const product = productQuery.data;

  return (
    <div className={"flex flex-col gap-4"}>
      <div className={"flex justify-between items-center"}>
        <div className={"text-xl font-[600] flex justify-between items-center gap-2"}>
          <Utensils size={16}/>
          <ChevronRight size={14}/>
          <div>{product.name}</div>
        </div>
        <Button variant={"ghost"} className={"bg-muted cursor-pointer"}>
          <div>Actions</div>
          <ChevronDown/>
        </Button>
      </div>

      <div className={"flex gap-4"}>
        {/* Left part */}
        <div className={"w-full flex flex-col gap-4"}>
          {/* General info card */}
          <Card className={"p-4"}>
            <div className={"flex flex-col gap-2"}>
              <div className={"text-sm"}>Name</div>
              <Input value={product.name}/>
            </div>
            <div className={"flex flex-col gap-2"}>
              <div className={"text-sm"}>Description</div>
              <Input value={product.description}/>
            </div>
            <div className={"flex flex-col gap-2"}>
              <div className={"text-sm"}>Category</div>
              <Input value={product.category.name}/>
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

            <div className={"flex flex-col gap-4"}>
              {product.options.map((option) => (
                <Card className={"p-4"} key={option.id}>
                  <div className={"flex flex-col gap-4"}>
                    <div className={"flex gap-4 items-end"}>
                      <div className={"w-full flex flex-col gap-2"}>
                        <div className={"text-sm"}>Name</div>
                        <Input value={option.name}/>
                      </div>
                      <Button variant={"outline"} className={"cursor-pointer"}>
                        <Plus/>
                        Add selection
                      </Button>
                      <Button variant={"destructive"} className={"cursor-pointer bg-destructive"}>Delete</Button>
                    </div>
                    <div className={"w-full flex flex-col gap-2"}>
                      <div className={"text-sm"}>Selections and Price changes (đ)</div>
                      {option.selections.map((selection) => (
                        <div className={"flex gap-4"}>
                          <div className={"w-full"}>
                            <Input value={selection.name}/>
                          </div>
                          <div className={"w-[300px]"}>
                            <Input value={selection.priceChange}/>
                          </div>
                          <div className={"w-[60px] flex justify-center"}>
                            <Button variant={"destructive"} size={"icon-sm"} className={"bg-destructive/20 hover:bg-destructive/20 cursor-pointer"}>
                              <Trash className={"text-destructive"}/>
                            </Button>
                          </div>

                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>

          {/* Toppings card */}
          <Card className={"p-4 gap-4"}>
            <div className={"flex justify-between items-center"}>
              <div className={"text-sm font-[600]"}>Toppings</div>
              <Button variant={"outline"} className={"cursor-pointer"}>
                <Plus/>
                Add topping
              </Button>
            </div>
            <div className={"flex flex-col gap-4"}>
              {product.toppings.map((topping) => (
                <Card className={"p-4"} key={topping.id}>
                  <div className={"flex gap-4 items-center"}>
                    <div className={"w-full flex flex-col gap-2"}>
                      <div className={"text-sm"}>Name</div>
                      <Input value={topping.name}/>
                    </div>
                    <div className={"w-[300px] flex flex-col gap-2"}>
                      <div className={"text-sm"}>Price change (đ)</div>
                      <Input value={topping.priceChange} />
                    </div>
                    <div className={"w-[80px] flex justify-center"}>
                      <Button variant={"destructive"} size={"icon-sm"} className={"bg-destructive/20 hover:bg-destructive/20 cursor-pointer"}>
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
}
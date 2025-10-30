import {useQuery} from "@tanstack/react-query";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {formatVnd} from "@/utils/string-utils.ts";
import {Button} from "@/components/ui/button.tsx";
import {Link} from "react-router-dom";
import {fetchProducts} from "@/service/fnb-api.ts";
import {Plus} from "lucide-react";

export default function MenuPage() {
  const productsQuery = useQuery({
    queryKey: ["products"],
    queryFn: () => fetchProducts(),
  });

  if(productsQuery.isLoading || productsQuery.error) {return <div>Loading...</div>}

  return (
    <div className={"flex flex-col gap-4"}>
      <div className={"flex justify-between items-center"}>
        <div className={"text-xl font-[600]"}>Menu</div>
        <Link to={"/menu/new-product"}>
          <Button className={"cursor-pointer"}>
            <Plus/>
            New product
          </Button>
        </Link>
      </div>
      <div className="rounded-lg border border-border overflow-hidden bg-card">
        <Table>
          <TableHeader className={"bg-muted"}>
            <TableRow>
              <TableHead className={"text-muted-foreground w-[40px] text-center"}>No.</TableHead>
              <TableHead className={"text-muted-foreground w-[60px] text-center"}>Image</TableHead>
              <TableHead className={"text-muted-foreground w-[300px]"}>Name</TableHead>
              <TableHead className={"text-muted-foreground w-[120px]"}>Base price</TableHead>
              <TableHead className={"text-muted-foreground w-[200px]"}>Options and Toppings</TableHead>
              <TableHead className={"text-muted-foreground w-[200px]"}>Category</TableHead>
              <TableHead className={"text-muted-foreground w-[200px]"}>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productsQuery.data.map((product: any, index: number) => {
              return (
                <TableRow key={product.id} className={"h-12"}>
                  <TableCell className={"text-center"}>{index + 1}</TableCell>
                  <TableCell className={"flex justify-center items-center"}>
                    <img src={product.imgUrls[0]} alt={"product-img"} sizes={"40px"} className={"w-10 h-10"}/>
                  </TableCell>
                  <TableCell className={"font-[600]"}>
                    <Link to={`/menu/${product.slug}`} className={"hover:underline"}>
                      {product.name}
                    </Link>
                  </TableCell>
                  <TableCell>{formatVnd(product.basePrice)}đ</TableCell>
                  <TableCell>
                    <Link to={`/menu/${product.slug}`} className={"hover:underline"}>
                      {product.options.length ?? 0} options, {product.toppings.length ?? 0} toppings
                    </Link>
                  </TableCell>
                  <TableCell>{product.category.name}</TableCell>
                  <TableCell>{product.unavailableAtStoreCodes.length === 0 ? "Available at all stores" : `Unavailable at ${product.unavailableAtStoreCodes.length} stores`}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

    </div>

  );
}
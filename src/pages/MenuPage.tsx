import axios from "axios";
import {useQuery} from "@tanstack/react-query";
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {formatDateTime, formatVnd} from "@/utils/string-utils.ts";
import {Button} from "@/components/ui/button.tsx";

async function testAxios() {
  const res = await axios.get("http://localhost:8080/api/products");
  return res.data.content;
}

export default function MenuPage() {
  const productsQuery = useQuery({
    queryKey: ["products"],
    queryFn: () => testAxios(),
  });

  if(productsQuery.isLoading || productsQuery.error) {return <div>Loading...</div>}

  return (
    <div className={"flex flex-col gap-4"}>
      <div className={"flex justify-between items-center"}>
        <div className={"text-xl font-[600]"}>Menu</div>
        <Button>New product</Button>
      </div>
      <Table className={"bg-background rounded-lg table-fixed"}>
        <TableHeader>
          <TableRow>
            <TableHead className={"text-muted-foreground w-[40px] text-center"}>No.</TableHead>
            <TableHead className={"text-muted-foreground w-[60px] text-center"}>Image</TableHead>
            <TableHead className={"text-muted-foreground w-[300px]"}>Name</TableHead>
            <TableHead className={"text-muted-foreground w-[120px]"}>Base price</TableHead>
            <TableHead className={"text-muted-foreground w-[200px]"}>Category</TableHead>
            <TableHead className={"text-muted-foreground w-[200px]"}>Status</TableHead>
            <TableHead className={"text-muted-foreground w-[200px]"}>Created at</TableHead>
            <TableHead className={"text-muted-foreground w-[120px]"}>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {productsQuery.data.map((product: any, index: number) => {
            return (
              <TableRow key={product.id} className={"h-12"}>
                <TableCell className={"text-center"}>{index + 1}</TableCell>
                <TableCell className={"text-center"}>IMG</TableCell>
                <TableCell className={"font-[600]"}>{product.name}</TableCell>
                <TableCell>{formatVnd(product.basePrice)} VNĐ</TableCell>
                <TableCell>{product.category.name}</TableCell>
                <TableCell>Unavailable at {product.unavailableAtStoreCodes.length ?? 0} stores</TableCell>
                <TableCell>{formatDateTime(product.createdAt)}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>

  );
}
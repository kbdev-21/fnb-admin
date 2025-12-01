import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createCategory, fetchCategories } from "@/api/fnb-api";
import { Spinner } from "@/components/ui/spinner";
import { Package, Pencil, Trash, Plus } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useState } from "react";

export default function CategoriesPage() {
  const auth = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: () => fetchCategories(),
  });

  const newCategoryMutation = useMutation({
    mutationFn: () => {
      return createCategory(auth.token ?? "", {
        name,
        description,
      });
    },
    onSuccess: () => {
      categoriesQuery.refetch();
      setIsDialogOpen(false);
      setName("");
      setDescription("");
      alert("Create category successfully!");
    },
    onError: (err) => {
      alert(
        err instanceof Error ? err.message : "Create category failed"
      );
    },
  });

  return (
    <div className={"flex flex-col gap-4 max-w-xl"}>
      <div className={"flex justify-between items-center"}>
        <div className={"text-xl font-[600]"}>Categories</div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus />
              New category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Category</DialogTitle>
              <DialogDescription>
                Create a new category for your menu
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <div className="text-sm">Name</div>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Category name"
                />
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-sm">Description</div>
                <Textarea
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  placeholder="Category description"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={newCategoryMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                onClick={() => newCategoryMutation.mutate()}
                disabled={
                  !name ||
                  !description ||
                  newCategoryMutation.isPending
                }
              >
                {newCategoryMutation.isPending
                  ? "Creating..."
                  : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="rounded-lg border border-border bg-card max-w-xl">
        {categoriesQuery.isLoading ? (
          <div className="flex justify-center items-center py-16">
            <Spinner className={"text-primary size-8"} />
          </div>
        ) : categoriesQuery.error ? (
          <div className="flex justify-center items-center py-16 text-destructive">
            Error loading categories
          </div>
        ) : categoriesQuery.data?.length === 0 ? (
          <div className="flex flex-col justify-center items-center py-16 gap-4">
            <Package className="text-muted-foreground size-12" />
            <div className="flex flex-col items-center gap-2">
              <div className="text-lg font-[600]">
                No categories yet
              </div>
              <div className="text-sm text-muted-foreground">
                Get started by creating your first category
              </div>
            </div>
          </div>
        ) : (
          <Table>
            <TableHeader className={"bg-muted"}>
              <TableRow>
                <TableHead
                  className={
                    "text-muted-foreground text-center"
                  }
                >
                  No.
                </TableHead>
                <TableHead className={"text-muted-foreground"}>
                  Name
                </TableHead>
                <TableHead className={"text-muted-foreground"}>
                  Number of items
                </TableHead>
                <TableHead className={"text-muted-foreground"}>
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categoriesQuery.data?.map(
                (category, index: number) => {
                  return (
                    <TableRow
                      key={category.id}
                      className={"h-14"}
                    >
                      <TableCell
                        className={"text-center"}
                      >
                        {index + 1}
                      </TableCell>
                      <TableCell className={"font-[600]"}>
                        {category.name}
                      </TableCell>
                      <TableCell>
                        {category.productsCount}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon-sm"
                          >
                            <Pencil className="size-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon-sm"
                          >
                            <Trash className="size-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                }
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}

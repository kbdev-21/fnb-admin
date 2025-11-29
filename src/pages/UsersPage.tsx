import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/contexts/AuthContext";
import { assignStaffToStore, fetchStores, fetchUsers } from "@/service/fnb-api";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Ban, BookUp, ChevronDown, Search } from "lucide-react";
import { uppercaseFirstLetter } from "@/utils/string-utils.ts";
import TextTooltip from "@/components/app/TextTooltip";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { SimpleSelectDropdown } from "@/components/app/SelectDropdown";
import { CustomPagination } from "@/components/app/CustomPagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Store, User } from "@/service/types";

export default function UsersPage() {
  const auth = useAuth();

  const [pageNumber, setPageNumber] = useState(0);
  const [sortBy, setSortBy] = useState("firstName");
  const [searchKey, setSearchKey] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const usersQuery = useQuery({
    queryKey: ["users", pageNumber, sortBy, searchKey],
    queryFn: () =>
      fetchUsers(auth.token ?? "", pageNumber, 20, sortBy, searchKey),
  });

  const storesQuery = useQuery({
    queryKey: ["stores"],
    queryFn: () => fetchStores(),
  });

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchKey(searchInput);
    setPageNumber(0); // Reset to first page when searching
  };

  return (
    <div className={"flex flex-col gap-4"}>
      <div className={"flex justify-between items-center"}>
        <div className={"text-xl font-[600]"}>Users</div>
        <div className={"flex justify-end items-center gap-2 w-[50%]"}>
          <div className="flex gap-1.5 items-center">
            <div className="text-sm whitespace-nowrap">Sort by</div>
            <SortSelector />
          </div>
          <form
            className="relative max-w-96 w-full"
            onSubmit={handleSearchSubmit}
          >
            <Input
              className="pr-10"
              placeholder="Search user"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <Button
              type="submit"
              variant="ghost"
              size="icon-sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 cursor-pointer"
            >
              <Search />
            </Button>
          </form>
        </div>
      </div>
      <div className="rounded-lg border border-border bg-card">
        {usersQuery.isLoading ? (
          <div className="flex justify-center items-center py-16">
            <Spinner className={"text-primary size-8"} />
          </div>
        ) : usersQuery.error ? (
          <div className="flex justify-center items-center py-16 text-destructive">
            Error loading users
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
                <TableHead className={`text-muted-foreground`}>
                  First name
                </TableHead>
                <TableHead className={"text-muted-foreground"}>
                  Last name
                </TableHead>
                <TableHead className={"text-muted-foreground"}>
                  Phone number
                </TableHead>
                <TableHead className={"text-muted-foreground"}>
                  Email
                </TableHead>
                <TableHead className={"text-muted-foreground"}>
                  Role
                </TableHead>
                <TableHead className={"text-muted-foreground"}>
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usersQuery.data?.content.map(
                (user: User, index: number) => {
                  return (
                    <TableRow
                      key={user.id}
                      className={"h-14"}
                    >
                      <TableCell
                        className={"text-center"}
                      >
                        {index + 1}
                      </TableCell>
                      <TableCell className={"font-[600]"}>
                        {user.firstName}
                      </TableCell>
                      <TableCell className={""}>
                        {user.lastName}
                      </TableCell>
                      <TableCell>
                        {user.phoneNum}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <div className="font-[600]">
                            {uppercaseFirstLetter(
                              user.role
                            )}
                          </div>
                          <div>
                            {user.role === "STAFF"
                              ? ` at ${user.staffOfStoreCode}`
                              : ""}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <AssignStaffDialogButton
                            selectedUser={user}
                            stores={
                              storesQuery.data ??
                              []
                            }
                            refetchUsers={
                              usersQuery.refetch
                            }
                          />
                          <TextTooltip text="Ban user">
                            <Button
                              variant="outline"
                              size="icon-sm"
                              className="cursor-pointer"
                            >
                              <Ban className="text-destructive" />
                            </Button>
                          </TextTooltip>
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
      <div className="w-full flex justify-end">
        <CustomPagination
          totalPages={usersQuery.data?.totalPages ?? 0}
          currentPage={usersQuery.data?.number ?? 0}
          onPageChange={setPageNumber}
          isLoading={usersQuery.isLoading}
          error={usersQuery.error}
        />
      </div>
    </div>
  );

  function SortSelector() {
    const sortOptions = [
      { label: "First name (A-Z)", value: "firstName" },
      { label: "First name (Z-A)", value: "-firstName" },
      { label: "Phone number (Ascending)", value: "phoneNum" },
      { label: "Phone number (Descending)", value: "-phoneNum" },
      { label: "Email (A-Z)", value: "email" },
      { label: "Email (Z-A)", value: "-email" },
      { label: "Role (A-Z)", value: "role" },
      { label: "Role (Z-A)", value: "-role" },
    ];

    return (
      <SimpleSelectDropdown
        selections={sortOptions}
        onValueChange={(value) => {
          setSortBy(value);
        }}
        placeholder="Sort by"
        initValue={sortBy}
        className="w-full"
      />
    );
  }
}

function AssignStaffDialogButton({
  selectedUser,
  stores,
  refetchUsers,
}: {
  selectedUser: User;
  stores: Store[];
  refetchUsers: () => void;
}) {
  const auth = useAuth();
  const [selectedStore, setSelectedStore] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const assignStaffMutation = useMutation({
    mutationFn: () =>
      assignStaffToStore(
        auth.token ?? "",
        selectedUser.id,
        selectedStore ?? ""
      ),
    onSuccess: () => {
      alert("Assign store staff successfully!");
      setIsOpen(false);
      refetchUsers();
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <TextTooltip text="Assign store staff">
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="icon-sm"
            disabled={selectedUser.role !== "CUSTOMER"}
            className="cursor-pointer"
          >
            <BookUp />
          </Button>
        </DialogTrigger>
      </TextTooltip>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Store Staff</DialogTitle>
          <DialogDescription>
            Assign {selectedUser?.firstName}{" "}
            {selectedUser?.lastName} to a store.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 flex gap-2">
          <SimpleSelectDropdown
            selections={
              stores.map((store) => ({
                label: store.code,
                value: store.code,
              })) ?? []
            }
            onValueChange={setSelectedStore}
            placeholder="Select store"
            className="w-full"
          />
          <Button
            onClick={() => assignStaffMutation.mutate()}
            disabled={assignStaffMutation.isPending}
          >
            {assignStaffMutation.isPending
              ? "Assigning..."
              : "Assign"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

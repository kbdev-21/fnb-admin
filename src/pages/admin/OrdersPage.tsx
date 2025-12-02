import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/contexts/auth-context";
import { fetchOrders, fetchStores } from "@/api/fnb-api";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Search, Receipt } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import SelectDropdown from "@/components/app/SelectDropdown";
import CustomPagination from "@/components/app/CustomPagination";
import type { Order, Store } from "@/api/types";
import { formatVnd, uppercaseFirstLetter } from "@/utils/string-utils";
import OrderStatusBadge from "@/components/app/OrderStatusBadge";
import { Link } from "react-router-dom";

export default function OrdersPage() {
  const auth = useAuth();

  const [pageNumber, setPageNumber] = useState(0);
  const [sortBy, setSortBy] = useState("-createdAt");
  const [searchKey, setSearchKey] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [status, setStatus] = useState<string>("");
  const [storeCode, setStoreCode] = useState<string>("");

  const ordersQuery = useQuery({
    queryKey: ["orders", pageNumber, sortBy, searchKey, status, storeCode],
    queryFn: () =>
      fetchOrders(auth.token ?? "", {
        pageNumber,
        pageSize: 20,
        sortBy,
        searchKey,
        status: status || undefined,
        storeCode: storeCode || undefined,
      }),
    enabled: !!auth.token,
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

  const handleStatusChange = (value: string) => {
    setStatus(value === "ALL" ? "" : value);
    setPageNumber(0);
  };

  const handleStoreCodeChange = (value: string) => {
    setStoreCode(value === "ALL" ? "" : value);
    setPageNumber(0);
  };

  const handleSortByChange = (value: string) => {
    setSortBy(value);
    setPageNumber(0);
  };

  return (
    <div className={"flex flex-col gap-4"}>
      <div className={"flex justify-between items-center"}>
        <div className={"text-xl font-[600]"}>Orders</div>
        <div className={"flex justify-end items-center gap-4 w-[50%]"}>
          <div className="flex gap-1.5 items-center">
            <div className="text-sm whitespace-nowrap">Sort by</div>
            <SortSelector />
          </div>
          <div className="flex gap-1.5 items-center">
            <div className="text-sm whitespace-nowrap">Status</div>
            <StatusFilter />
          </div>
          <div className="flex gap-1.5 items-center">
            <div className="text-sm whitespace-nowrap">Store</div>
            <StoreFilter />
          </div>
          <form
            className="relative min-w-82 w-full"
            onSubmit={handleSearchSubmit}
          >
            <Input
              className="pr-10"
              placeholder="Search order"
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
        {ordersQuery.isLoading ? (
          <div className="flex justify-center items-center py-16">
            <Spinner className={"text-primary size-8"} />
          </div>
        ) : ordersQuery.error ? (
          <div className="flex justify-center items-center py-16 text-destructive">
            Error loading orders
          </div>
        ) : ordersQuery.data?.content.length === 0 ? (
          <div className="flex flex-col justify-center items-center py-16 gap-4">
            <Receipt className="text-muted-foreground size-12" />
            <div className="flex flex-col items-center gap-2">
              <div className="text-lg font-[600]">
                {searchKey || status || storeCode
                  ? "No orders found"
                  : "No orders yet"}
              </div>
              <div className="text-sm text-muted-foreground">
                {searchKey || status || storeCode
                  ? "Try adjusting your search or filter criteria"
                  : "Orders will appear here once customers place them"}
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
                <TableHead className={`text-muted-foreground`}>
                  Order ID
                </TableHead>
                <TableHead className={"text-muted-foreground"}>
                  Customer
                </TableHead>
                <TableHead className={"text-muted-foreground"}>
                  Phone
                </TableHead>
                <TableHead className={"text-muted-foreground"}>
                  Store
                </TableHead>
                <TableHead className={"text-muted-foreground"}>
                  Method
                </TableHead>
                <TableHead className={"text-muted-foreground"}>
                  Status
                </TableHead>
                <TableHead className={"text-muted-foreground"}>
                  Total
                </TableHead>
                <TableHead className={"text-muted-foreground"}>
                  Created At
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ordersQuery.data?.content.map(
                (order: Order, index: number) => {
                  return (
                    <TableRow
                      key={order.id}
                      className={"h-14"}
                    >
                      <TableCell
                        className={"text-center"}
                      >
                        {index + 1}
                      </TableCell>
                      <TableCell className={"font-[600]"}>
                        <Link
                          to={`/admin/orders/${order.id}`}
                        >
                          {order.id.slice(0, 8)}...
                        </Link>
                      </TableCell>
                      <TableCell>
                        {order.customerName}
                      </TableCell>
                      <TableCell>
                        {order.customerPhoneNum}
                      </TableCell>
                      <TableCell>
                        {order.storeCode}
                      </TableCell>
                      <TableCell>
                        {uppercaseFirstLetter(
                          order.orderMethod.replace("_", " ")
                        )}
                      </TableCell>
                      <TableCell>
                        <OrderStatusBadge
                          status={
                            order.status as
                            | "PENDING"
                            | "PREPARING"
                            | "FULFILLED"
                            | "CANCELED"
                          }
                        />
                      </TableCell>
                      <TableCell className={"font-[600]"}>
                        {formatVnd(order.totalAmount)}đ
                      </TableCell>
                      <TableCell>
                        {new Date(
                          order.createdAt
                        ).toLocaleString()}
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
          totalPages={ordersQuery.data?.totalPages ?? 0}
          currentPage={ordersQuery.data?.number ?? 0}
          onPageChange={setPageNumber}
          isLoading={ordersQuery.isLoading}
          error={ordersQuery.error}
        />
      </div>
    </div>
  );

  function SortSelector() {
    const sortOptions = [
      { label: "Newest", value: "-createdAt" },
      { label: "Oldest", value: "createdAt" },
      { label: "Total (High to Low)", value: "-totalAmount" },
      { label: "Total (Low to High)", value: "totalAmount" },
      { label: "Customer Name (A-Z)", value: "customerName" },
      { label: "Customer Name (Z-A)", value: "-customerName" },
    ];

    return (
      <SelectDropdown
        selections={sortOptions}
        onValueChange={handleSortByChange}
        placeholder="Sort by"
        initValue={sortBy}
        className="w-full"
      />
    );
  }

  function StatusFilter() {
    const statusOptions = [
      { label: "All", value: "ALL" },
      { label: "Pending", value: "PENDING" },
      { label: "Preparing", value: "PREPARING" },
      { label: "Fulfilled", value: "FULFILLED" },
      { label: "Canceled", value: "CANCELED" },
    ];

    return (
      <SelectDropdown
        selections={statusOptions}
        onValueChange={handleStatusChange}
        placeholder="Filter by status"
        initValue={status || "ALL"}
        className="w-full"
      />
    );
  }

  function StoreFilter() {
    const storeOptions = [
      { label: "All Stores", value: "ALL" },
      ...(storesQuery.data?.map((store: Store) => ({
        label: store.displayName,
        value: store.code,
      })) || []),
    ];

    return (
      <SelectDropdown
        selections={storeOptions}
        onValueChange={handleStoreCodeChange}
        placeholder="Filter by store"
        initValue={storeCode || "ALL"}
        className="w-full"
      />
    );
  }
}

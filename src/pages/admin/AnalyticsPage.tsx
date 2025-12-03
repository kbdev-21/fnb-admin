import { fetchOrders } from "@/api/fnb-api";
import { useAuth } from "@/contexts/auth-context";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@/components/ui/spinner";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/* TODO: add real real-time analytics. this is just a placeholder */
export default function AnalyticsPage() {
  const auth = useAuth();
  const [cheatingPagesize, setCheatingPagesize] = useState(10);

  const ordersQuery = useQuery({
    queryKey: ["orders", cheatingPagesize],
    queryFn: () =>
      fetchOrders(auth.token ?? "", {
        pageNumber: 0,
        pageSize: cheatingPagesize,
        sortBy: "-createdAt",
        searchKey: "",
        storeCode: "",
        orderMethod: "",
        status: "FULFILLED",
      }),
    enabled: !!auth.token,
  });

  useEffect(() => {
    if (ordersQuery.data) {
      setCheatingPagesize(ordersQuery.data.totalElements);
    }
  }, [ordersQuery.data]);

  if (ordersQuery.isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner className="text-primary size-8" />
      </div>
    );
  }

  const totalOrders = ordersQuery.data?.totalElements;
  const totalRenenue = ordersQuery.data?.content.reduce(
    (acc, order) => acc + order.totalAmount,
    0
  );

  return (
    <div className="flex flex-col gap-6 pb-20">
      <div className="text-xl font-[600]">
        Analytics
      </div>
      <div className="flex gap-4">
        <Card className="min-w-[160px] px-4 flex flex-col gap-1 h-fit">
          <div className="text-xl font-bold">
            {totalOrders?.toLocaleString() ?? "-"}
          </div>
          <div className="text-sm text-muted-foreground">
            Total Orders
          </div>
        </Card>
        <Card className="min-w-[160px] px-4 flex flex-col gap-1 h-fit">
          <div className="text-xl font-bold">
            {totalRenenue?.toLocaleString() ?? "-"} đ
          </div>
          <div className="text-sm text-muted-foreground">
            Total Revenue
          </div>
        </Card>
      </div>
    </div>
  );
}

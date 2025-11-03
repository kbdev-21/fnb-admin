import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/contexts/AuthContext";
import { fetchUsers } from "@/service/fnb-api";
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
import { Ban, BookUp } from "lucide-react";
import { uppercaseFirstLetter } from "@/utils/string-utils.ts";
import TextTooltip from "@/components/app/TextTooltip";

export default function UsersPage() {
  const auth = useAuth();
  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: () => fetchUsers(auth.token ?? ""),
  });

  if (usersQuery.isLoading || usersQuery.error) {
    return <Spinner className={"text-primary size-8"} />;
  }

  return (
    <div className={"flex flex-col gap-4"}>
      <div className={"flex justify-start items-center"}>
        <div className={"text-xl font-[600]"}>Users</div>
      </div>
      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader className={"bg-muted"}>
            <TableRow>
              <TableHead
                className={
                  "text-muted-foreground w-[40px] text-center"
                }
              >
                No.
              </TableHead>
              <TableHead
                className={
                  "text-muted-foreground w-[80px]"
                }
              >
                First name
              </TableHead>
              <TableHead
                className={"text-muted-foreground w-[80px]"}
              >
                Last name
              </TableHead>
              <TableHead
                className={"text-muted-foreground w-[120px]"}
              >
                Phone number
              </TableHead>
              <TableHead
                className={"text-muted-foreground w-[160px]"}
              >
                Email
              </TableHead>
              <TableHead
                className={"text-muted-foreground w-[200px]"}
              >
                Role
              </TableHead>
              <TableHead
                className={"text-muted-foreground w-[100px]"}
              >
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usersQuery.data.map((user: any, index: number) => {
              return (
                <TableRow key={user.id} className={"h-14"}>
                  <TableCell className={"text-center"}>
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
                  <TableCell>
                    {user.email}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <div className="font-[600]">{uppercaseFirstLetter(user.role)}</div>
                      <div>{user.role === "STAFF" ? ` at store ${user.staffOfStoreCode}` : ""}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <TextTooltip text="Promote to store staff">
                        <Button variant="outline" size="icon-sm" disabled={user.role !== "CUSTOMER"} className="cursor-pointer">
                          <BookUp />
                        </Button>
                      </TextTooltip>
                      <TextTooltip text="Ban user">
                        <Button variant="outline" size="icon-sm" className="cursor-pointer">
                          <Ban className="text-destructive" />
                        </Button>
                      </TextTooltip>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

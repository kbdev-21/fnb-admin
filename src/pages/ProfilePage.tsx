import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchCurrentUser, updateCurrentUserProfile } from "@/api/fnb-api";
import { useAuth } from "@/contexts/auth-context";
import { useEffect, useState } from "react";
import RoleBadge from "@/components/app/RoleBadge.tsx";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function ProfilePage() {
  const auth = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [avtUrl, setAvtUrl] = useState("");

  const currentUserQuery = useQuery({
    queryKey: ["currentUser"],
    enabled: !!auth.token,
    queryFn: () => fetchCurrentUser(auth.token ?? ""),
  });

  const updateUserMutation = useMutation({
    mutationFn: (payload: {
      firstName?: string | null;
      lastName?: string | null;
      avtUrl?: string | null;
    }) => updateCurrentUserProfile(auth.token ?? "", payload),
  });

  useEffect(() => {
    if (currentUserQuery.data) {
      setFirstName(currentUserQuery.data.firstName);
      setLastName(currentUserQuery.data.lastName);
      setAvtUrl(currentUserQuery.data.avtUrl);

      auth.setTokenAndMyInfo(auth.token ?? "", currentUserQuery.data);
    }
  }, [currentUserQuery.data, auth]);

  const user = auth.myInfo ?? currentUserQuery.data;

  return (
    <Card className="flex flex-col gap-4 mt-8 w-full max-w-screen-md mx-auto px-6">
      {/* Avatar + basic info */}
      <div className="w-full flex flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 rounded-full bg-muted flex items-center justify-center overflow-hidden">
            <img
              src={avtUrl}
              alt={`${firstName} ${lastName}`}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-lg font-semibold leading-tight">
              {`${user?.firstName} ${user?.lastName}`}
            </div>
            {user && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <RoleBadge
                  role={
                    (user.role as
                      | "CUSTOMER"
                      | "STAFF"
                      | "ADMIN") ?? "CUSTOMER"
                  }
                  storeCode={
                    user.staffOfStoreCode || undefined
                  }
                />
              </div>
            )}
          </div>
        </div>
        <Button 
          size={"lg"} 
          className="rounded-full font-bold" 
          disabled={updateUserMutation.isPending || (user?.avtUrl === avtUrl && firstName === user?.firstName && lastName === user?.lastName)}
        >
          Save changes
        </Button>
      </div>
      {/* General information */}
      <div className="text-md font-semibold">General information</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-muted-foreground">
            Phone number
          </label>
          <Input value={user?.phoneNum ?? ""} disabled />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-muted-foreground">
            Email
          </label>
          <Input value={user?.email ?? ""} disabled />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-muted-foreground">
            First name
          </label>
          <Input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-muted-foreground">
            Last name
          </label>
          <Input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
      </div>
    </Card>
  );
}

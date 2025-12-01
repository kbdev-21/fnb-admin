import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createStore, fetchStores, updateStore } from "@/api/fnb-api";
import { Spinner } from "@/components/ui/spinner";
import { Plus, Pencil, MapPin, Phone, Mail, Building2 } from "lucide-react";
import { formatDateTime } from "@/utils/string-utils";
import { useAuth } from "@/contexts/auth-context";
import { useState } from "react";
import type { Store } from "@/api/types";

export default function StoresPage() {
  const auth = useAuth();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  // Create form state
  const [code, setCode] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [fullAddress, setFullAddress] = useState("");

  // Edit form state
  const [editDisplayName, setEditDisplayName] = useState("");
  const [editPhoneNum, setEditPhoneNum] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editCity, setEditCity] = useState("");
  const [editFullAddress, setEditFullAddress] = useState("");

  const storesQuery = useQuery({
    queryKey: ["stores"],
    queryFn: () => fetchStores(),
  });

  const createStoreMutation = useMutation({
    mutationFn: () => {
      return createStore(auth.token ?? "", {
        code,
        displayName,
        phoneNum,
        email,
        city,
        fullAddress,
      });
    },
    onSuccess: () => {
      storesQuery.refetch();
      setIsCreateDialogOpen(false);
      setCode("");
      setDisplayName("");
      setPhoneNum("");
      setEmail("");
      setCity("");
      setFullAddress("");
      alert("Create store successfully!");
    },
    onError: (err) => {
      alert(err instanceof Error ? err.message : "Create store failed");
    },
  });

  const updateStoreMutation = useMutation({
    mutationFn: () => {
      if (!selectedStore) throw new Error("No store selected");
      return updateStore(auth.token ?? "", selectedStore.id, {
        displayName: editDisplayName || null,
        phoneNum: editPhoneNum || null,
        email: editEmail || null,
        city: editCity || null,
        fullAddress: editFullAddress || null,
      });
    },
    onSuccess: () => {
      storesQuery.refetch();
      setIsEditDialogOpen(false);
      setSelectedStore(null);
      alert("Update store successfully!");
    },
    onError: (err) => {
      alert(err instanceof Error ? err.message : "Update store failed");
    },
  });

  const handleEditClick = (store: Store) => {
    setSelectedStore(store);
    setEditDisplayName(store.displayName);
    setEditPhoneNum(store.phoneNum);
    setEditEmail(store.email);
    setEditCity(store.city);
    setEditFullAddress(store.fullAddress);
    setIsEditDialogOpen(true);
  };

  return (
    <div className={"flex flex-col gap-4"}>
      <div className={"flex justify-between items-center"}>
        <div className={"text-xl font-[600]"}>Stores</div>
        <Dialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus />
              New store
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Store</DialogTitle>
              <DialogDescription>
                Create a new store
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <div className="text-sm">Code</div>
                <Input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Store code"
                />
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-sm">Display Name</div>
                <Input
                  value={displayName}
                  onChange={(e) =>
                    setDisplayName(e.target.value)
                  }
                  placeholder="Store display name"
                />
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-sm">Phone Number</div>
                <Input
                  value={phoneNum}
                  onChange={(e) =>
                    setPhoneNum(e.target.value)
                  }
                  placeholder="Phone number"
                />
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-sm">Email</div>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                />
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-sm">City</div>
                <Input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City"
                />
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-sm">Full Address</div>
                <Input
                  value={fullAddress}
                  onChange={(e) =>
                    setFullAddress(e.target.value)
                  }
                  placeholder="Full address"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
                disabled={createStoreMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                onClick={() => createStoreMutation.mutate()}
                disabled={
                  !code ||
                  !displayName ||
                  !phoneNum ||
                  !email ||
                  !city ||
                  !fullAddress ||
                  createStoreMutation.isPending
                }
              >
                {createStoreMutation.isPending
                  ? "Creating..."
                  : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Store</DialogTitle>
            <DialogDescription>
              Update store information
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="text-sm">Display Name</div>
              <Input
                value={editDisplayName}
                onChange={(e) =>
                  setEditDisplayName(e.target.value)
                }
                placeholder="Store display name"
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-sm">Phone Number</div>
              <Input
                value={editPhoneNum}
                onChange={(e) =>
                  setEditPhoneNum(e.target.value)
                }
                placeholder="Phone number"
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-sm">Email</div>
              <Input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                placeholder="Email address"
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-sm">City</div>
              <Input
                value={editCity}
                onChange={(e) => setEditCity(e.target.value)}
                placeholder="City"
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-sm">Full Address</div>
              <Input
                value={editFullAddress}
                onChange={(e) =>
                  setEditFullAddress(e.target.value)
                }
                placeholder="Full address"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              disabled={updateStoreMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={() => updateStoreMutation.mutate()}
              disabled={updateStoreMutation.isPending}
            >
              {updateStoreMutation.isPending
                ? "Updating..."
                : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {storesQuery.isLoading ? (
        <div className="flex justify-center items-center py-16">
          <Spinner className={"text-primary size-8"} />
        </div>
      ) : storesQuery.error ? (
        <div className="flex justify-center items-center py-16 text-destructive">
          Error loading stores
        </div>
      ) : storesQuery.data?.length === 0 ? (
        <div className="flex flex-col justify-center items-center py-16 gap-4">
          <Building2 className="text-muted-foreground size-12" />
          <div className="flex flex-col items-center gap-2">
            <div className="text-lg font-[600]">No stores yet</div>
            <div className="text-sm text-muted-foreground">
              Get started by creating your first store
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {storesQuery.data?.map((store) => {
            return (
              <Card key={store.id} className="relative">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg">
                        {store.displayName}
                      </CardTitle>
                      <div className="text-sm text-muted-foreground mt-1">
                        {store.code}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="cursor-pointer"
                      onClick={() =>
                        handleEditClick(store)
                      }
                    >
                      <Pencil className="size-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <div className="flex items-start gap-2">
                    <MapPin className="size-4 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">
                        {store.fullAddress}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {store.city}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="size-4 text-muted-foreground" />
                    <div className="text-sm">
                      {store.phoneNum}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="size-4 text-muted-foreground" />
                    <div className="text-sm">
                      {store.email}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-2">
                      <div
                        className={`size-2 rounded-full ${store.open
                          ? "bg-green-500"
                          : "bg-red-500"
                          }`}
                      />
                      <span className="text-sm text-muted-foreground">
                        {store.open ? "Open" : "Closed"}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Created{" "}
                      {formatDateTime(store.createdAt)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

export type User = {
  id: string;
  phoneNum: string;
  email?: string | null;
  firstName: string;
  lastName: string;
  normalizedName: string;
  role: string;
  staffOfStoreCode: string;
  createdAt: string;
  addresses: Address[];
};

export type Address = {
  type: string;
  city: string;
  detail: string;
};
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

export type ToppingCreate = {
  name: string;
  priceChange: string;
}

export type OptionCreate = {
  name: string;
  selections: OptionCreateSelection[];
}

export type OptionCreateSelection = {
  name: string;
  priceChange: string;
}
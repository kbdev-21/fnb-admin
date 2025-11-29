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

export type ToppingDto = {
    name: string;
    priceChange: string;
};

export type OptionDto = {
    name: string;
    selections: OptionDtoSelection[];
};

export type OptionDtoSelection = {
    name: string;
    priceChange: string;
};

export type Store = {
    id: string;
    code: string;
    displayName: string;
    phoneNum: string;
    email: string;
    city: string;
    fullAddress: string;
    open: boolean;
    createdAt: string;
};

export type Category = {
    id: string;
    name: string;
    slug: string;
    normalizedName: string;
    description?: string | null;
    imgUrl?: string | null;
};

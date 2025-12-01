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
  description: string;
  productsCount: number;
  imgUrl?: string | null;
};

export type ProductCategory = {
  id: string;
  name: string;
  slug: string;
  normalizedName: string;
  description: string;
  imgUrl: string | null;
  productsCount: number | null;
  children: Category[];
};

export type ProductOptionSelection = {
  id: string;
  name: string;
  priceChange: number;
};

export type ProductOption = {
  id: string;
  name: string;
  selections: ProductOptionSelection[];
};

export type ProductTopping = {
  id: string;
  name: string;
  priceChange: number;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  normalizedName: string;
  description: string;
  basePrice: number;
  comparePrice: number | null;
  imgUrls: string[];
  unavailableAtStoreCodes: string[];
  createdAt: string;
  categoryId: string;
  category: ProductCategory;
  options: ProductOption[];
  toppings: ProductTopping[];
};

export type Discount = {
  id: string;
  code: string;
  discountType: string;
  discountValue: number;
  maxFixedAmount: number | null;
  minApplicablePrice: number | null;
  used: boolean;
  usedByPhoneNum: string | null;
  createdAt: string;
  expiredAt: string | null;
};

export type OrderPreviewLineSelectedOption = {
  name: string;
  selection: string;
  priceChange: number;
};

export type OrderPreviewLineSelectedTopping = {
  name: string;
  priceChange: number;
};

export type OrderPreviewLine = {
  productId: string;
  productName: string;
  productImgUrl: string;
  selectedOptions: OrderPreviewLineSelectedOption[];
  selectedToppings: OrderPreviewLineSelectedTopping[];
  basePrice: number;
  unitPrice: number;
  quantity: number;
  lineAmount: number;
};

export type OrderPreview = {
  storeCode: string;
  orderMethod: "PICK_UP" | "DELIVERY";
  discountCode: string | null;
  subtotalAmount: number;
  discountAmount: number;
  deliveryFee: number;
  totalAmount: number;
  createdAt: string;
  lines: OrderPreviewLine[];
};

export type OrderLineRequestSelectedOption = {
  optionId: string;
  selectionId: string;
};

export type OrderLineRequest = {
  productId: string;
  selectedOptions: OrderLineRequestSelectedOption[];
  selectedToppingIds: string[];
  quantity: number;
};

export type OrderCreateRequest = {
  storeCode: string;
  customerPhoneNum: string;
  customerEmail: string | null;
  customerName: string;
  message: string | null;
  orderMethod: "PICK_UP" | "DELIVERY";
  destination: string;
  discountCode: string | null;
  status: string | null;
  paid: boolean | null;
  paymentMethod: string;
  lines: OrderLineRequest[];
};

export type OrderLineResponseSelectedOption = {
  name: string;
  selection: string;
  priceChange: number;
};

export type OrderLineResponseSelectedTopping = {
  name: string;
  priceChange: number;
};

export type OrderLineResponse = {
  id: string;
  productId: string;
  productName: string;
  productImgUrl: string;
  selectedOptions: OrderLineResponseSelectedOption[];
  selectedToppings: OrderLineResponseSelectedTopping[];
  basePrice: number;
  unitPrice: number;
  quantity: number;
  lineAmount: number;
};

export type Order = {
  id: string;
  storeCode: string;
  customerPhoneNum: string;
  customerEmail: string | null;
  customerName: string;
  message: string | null;
  orderMethod: "PICK_UP" | "DELIVERY";
  destination: string;
  status: string;
  discountCode: string | null;
  subtotalAmount: number;
  discountAmount: number;
  deliveryFee: number;
  totalAmount: number;
  paid: boolean;
  paymentMethod: string;
  createdAt: string;
  completedAt: string | null;
  lines: OrderLineResponse[];
};

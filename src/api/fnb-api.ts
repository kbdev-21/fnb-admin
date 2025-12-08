import type {
  OptionDto,
  ToppingDto,
  User,
  Store,
  Category,
  Discount,
  Product,
  OrderPreview,
  Order,
  OrderCreateRequest,
} from "@/api/types";
import type { OrderLine } from "@/contexts/order-context";
import axios from "axios";

const baseUrl = "http://localhost:8080";

export async function login(
  phoneNumOrEmail: string,
  password: string
): Promise<{
  user: User;
  token: string;
}> {
  const res = await axios.post(`${baseUrl}/api/auth/login`, {
    phoneNumOrEmail: phoneNumOrEmail,
    password: password,
  });
  return res.data;
}

export async function registerUser({
  phoneNum,
  email,
  password,
  firstName,
  lastName,
}: {
  phoneNum: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}): Promise<{
  user: User;
  token: string;
}> {
  const res = await axios.post(`${baseUrl}/api/auth/register`, {
    phoneNum,
    email,
    password,
    firstName,
    lastName,
  });
  return res.data;
}

export async function fetchCurrentUser(token: string): Promise<User> {
  const res = await axios.get(`${baseUrl}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export async function createProduct(
  token: string,
  productCreateDto: {
    name: string;
    description: string;
    basePrice: number;
    imgUrls: string[];
    comparePrice: number | null;
    categoryId: string;
    options: OptionDto[];
    toppings: ToppingDto[];
  }
) {
  const res = await axios.post(
    `${baseUrl}/api/products`,
    {
      name: productCreateDto.name,
      description: productCreateDto.description,
      imgUrls: productCreateDto.imgUrls,
      basePrice: productCreateDto.basePrice,
      comparePrice: productCreateDto.comparePrice,
      categoryId: productCreateDto.categoryId,
      options: productCreateDto.options,
      toppings: productCreateDto.toppings,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
}

export async function updateProduct(
  token: string,
  productId: string,
  productUpdateDto: {
    name: string | undefined;
    description: string | undefined;
    basePrice: number | undefined;
    imgUrls: string[] | undefined;
    comparePrice: number | null | undefined;
    categoryId: string | undefined;
    options: OptionDto[] | undefined;
    toppings: ToppingDto[] | undefined;
  }
) {
  const res = await axios.patch(
    `${baseUrl}/api/products/${productId}`,
    {
      name: productUpdateDto.name,
      description: productUpdateDto.description,
      imgUrls: productUpdateDto.imgUrls,
      basePrice: productUpdateDto.basePrice,
      comparePrice: productUpdateDto.comparePrice,
      categoryId: productUpdateDto.categoryId,
      options: productUpdateDto.options,
      toppings: productUpdateDto.toppings,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
}

export async function fetchProducts(
  searchKey: string,
  pageNumber: number,
  pageSize: number,
  sortBy: string,
  categoryId: string
): Promise<{
  content: Product[];
  totalPages: number;
  number: number;
  totalElements: number;
}> {
  const res = await axios.get(`${baseUrl}/api/products`, {
    params: { searchKey, pageNumber, pageSize, sortBy, categoryId },
  });
  return res.data;
}

export async function deleteProduct(token: string, productId: string) {
  const res = await axios.delete(`${baseUrl}/api/products/${productId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export async function fetchProductBySlug(slug: string): Promise<Product> {
  const res = await axios.get(`${baseUrl}/api/products/by-slug/${slug}`);
  return res.data;
}

export async function updateProductAvailability(
  token: string,
  productId: string,
  storeCode: string,
  available: boolean
): Promise<Product> {
  const res = await axios.patch(
    `${baseUrl}/api/products/${productId}/availability`,
    {},
    {
      params: {
        storeCode,
        available,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
}

export async function fetchCategories(): Promise<Category[]> {
  const res = await axios.get(`${baseUrl}/api/categories`);
  return res.data;
}

export async function createCategory(
  token: string,
  categoryCreateDto: {
    name: string;
    description: string;
  }
) {
  const res = await axios.post(
    `${baseUrl}/api/categories`,
    {
      name: categoryCreateDto.name,
      description: categoryCreateDto.description,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
}

export async function fetchStores(): Promise<Store[]> {
  const res = await axios.get(`${baseUrl}/api/stores`);
  return res.data;
}

export async function createStore(
  token: string,
  storeCreateDto: {
    code: string;
    displayName: string;
    phoneNum: string;
    email: string;
    city: string;
    fullAddress: string;
  }
) {
  const res = await axios.post(
    `${baseUrl}/api/stores`,
    {
      code: storeCreateDto.code,
      displayName: storeCreateDto.displayName,
      phoneNum: storeCreateDto.phoneNum,
      email: storeCreateDto.email,
      city: storeCreateDto.city,
      fullAddress: storeCreateDto.fullAddress,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
}

export async function updateStore(
  token: string,
  storeId: string,
  storeUpdateDto: {
    displayName?: string | null;
    phoneNum?: string | null;
    email?: string | null;
    city?: string | null;
    fullAddress?: string | null;
  }
) {
  const res = await axios.patch(
    `${baseUrl}/api/stores/${storeId}`,
    {
      displayName: storeUpdateDto.displayName,
      phoneNum: storeUpdateDto.phoneNum,
      email: storeUpdateDto.email,
      city: storeUpdateDto.city,
      fullAddress: storeUpdateDto.fullAddress,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
}

export async function fetchUsers(
  token: string,
  pageNumber: number,
  pageSize: number,
  sortBy: string,
  searchKey: string
): Promise<{
  content: User[];
  totalPages: number;
  number: number;
  totalElements: number;
}> {
  const res = await axios.get(
    `${baseUrl}/api/users?pageNumber=${pageNumber}&pageSize=${pageSize}&sortBy=${sortBy}&searchKey=${searchKey}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
}

export async function assignStaffToStore(
  token: string,
  userId: string,
  storeCode: string
) {
  const res = await axios.patch(
    `${baseUrl}/api/users/assign-staff/${userId}?storeCode=${storeCode}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
}

export async function updateCurrentUserProfile(
  token: string,
  userId: string,
  payload: {
    firstName?: string | null;
    lastName?: string | null;
    avtUrl?: string | null;
  }
) {
  const res = await axios.patch(
    `${baseUrl}/api/users/${userId}`,
    {
      firstName: payload.firstName,
      lastName: payload.lastName,
      avtUrl: payload.avtUrl,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
}

export async function uploadImage(token: string, file: File) {
  if (!file.type.startsWith("image/")) {
    throw new Error("File is not image");
  }

  const formData = new FormData();
  formData.append("file", file);

  const res = await axios.post(
    `${baseUrl}/api/storage/files/upload`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
}

export async function fetchDiscounts(
  token: string,
  pageNumber: number,
  pageSize: number
): Promise<{
  content: Discount[];
  totalPages: number;
  number: number;
  totalElements: number;
}> {
  const res = await axios.get(`${baseUrl}/api/discounts`, {
    params: { pageNumber, pageSize },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export async function createDiscount(
  token: string,
  discountCreateDto: {
    code: string;
    discountType: string;
    discountValue: number;
    maxFixedAmount: number | null;
    minApplicablePrice: number | null;
    expiredAt: string | null;
  }
) {
  const res = await axios.post(
    `${baseUrl}/api/discounts`,
    {
      code: discountCreateDto.code,
      discountType: discountCreateDto.discountType,
      discountValue: discountCreateDto.discountValue,
      maxFixedAmount: discountCreateDto.maxFixedAmount,
      minApplicablePrice: discountCreateDto.minApplicablePrice,
      expiredAt: discountCreateDto.expiredAt,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
}

export async function deleteDiscount(token: string, discountId: string) {
  const res = await axios.delete(`${baseUrl}/api/discounts/${discountId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export async function previewOrder(orderPreviewDto: {
  storeCode: string;
  orderMethod: "PICK_UP" | "DELIVERY";
  destination: string;
  discountCode: string | null;
  lines: OrderLine[];
}): Promise<OrderPreview> {
  const res = await axios.post(`${baseUrl}/api/orders/preview`, {
    storeCode: orderPreviewDto.storeCode,
    orderMethod: orderPreviewDto.orderMethod,
    destination: orderPreviewDto.destination,
    discountCode: orderPreviewDto.discountCode,
    lines: orderPreviewDto.lines.map((line) => ({
      productId: line.productId,
      selectedOptions: line.selectedOptions,
      selectedToppingIds: line.selectedToppingIds,
      quantity: line.quantity,
    })),
  });
  return res.data;
}

export async function fetchOrders(
  token: string,
  params?: {
    pageNumber?: number;
    pageSize?: number;
    sortBy?: string;
    searchKey?: string;
    storeCode?: string;
    orderMethod?: "PICK_UP" | "DELIVERY" | "";
    status?: string;
    discountCode?: string;
    customerPhoneNum?: string;
  }
): Promise<{
  content: Order[];
  totalPages: number;
  number: number;
  totalElements: number;
}> {
  const queryParams: Record<string, string | number> = {
    pageNumber: params?.pageNumber ?? 0,
    pageSize: params?.pageSize ?? 20,
    sortBy: params?.sortBy ?? "-createdAt",
  };

  if (params?.searchKey) queryParams.searchKey = params.searchKey;
  if (params?.storeCode) queryParams.storeCode = params.storeCode;
  if (params?.orderMethod) queryParams.orderMethod = params.orderMethod;
  if (params?.status) queryParams.status = params.status;
  if (params?.discountCode) queryParams.discountCode = params.discountCode;
  if (params?.customerPhoneNum)
    queryParams.customerPhoneNum = params.customerPhoneNum;

  const res = await axios.get(`${baseUrl}/api/orders`, {
    params: queryParams,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export async function fetchOrderById(
  token: string,
  orderId: string
): Promise<Order> {
  const res = await axios.get(`${baseUrl}/api/orders/${orderId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export async function createOrder(
  token: string,
  orderCreateRequest: OrderCreateRequest
): Promise<Order> {
  const res = await axios.post(`${baseUrl}/api/orders`, orderCreateRequest, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export async function updateOrder(
  token: string,
  orderId: string,
  params?: {
    status?: "PENDING" | "PREPARING" | "FULFILLED" | "CANCELED";
    paid?: boolean;
    paymentMethod?: string;
  }
): Promise<Order> {
  const queryParams: Record<string, string | boolean> = {};

  if (params?.status) queryParams.status = params.status;
  if (params?.paid !== undefined) queryParams.paid = params.paid;
  if (params?.paymentMethod) queryParams.paymentMethod = params.paymentMethod;

  const res = await axios.patch(
    `${baseUrl}/api/orders/${orderId}`,
    {},
    {
      params: queryParams,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
}

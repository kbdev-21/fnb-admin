import type {OptionCreate, ToppingCreate, User} from "@/service/types.ts";
import axios from "axios";

const baseUrl = "http://localhost:8080";

export async function login(phoneNumOrEmail: string, password: string): Promise<{
  user: User,
  token: string,
}> {
  const res = await axios.post(`${baseUrl}/api/auth/login`, {
    phoneNumOrEmail: phoneNumOrEmail,
    password: password
  });
  return res.data;
}

export async function createProduct(token: string, productCreateDto: {
  name: string;
  description: string;
  basePrice: number;
  imgUrls: string[];
  comparePrice: number;
  categoryId: string;
  options: OptionCreate[];
  toppings: ToppingCreate[];
}) {
  const res = await axios.post(`${baseUrl}/api/products`, {
    name: productCreateDto.name,
    description: productCreateDto.description,
    imgUrls: productCreateDto.imgUrls,
    basePrice: productCreateDto.basePrice,
    comparePrice: productCreateDto.comparePrice,
    categoryId: productCreateDto.categoryId,
    options: productCreateDto.options,
    toppings: productCreateDto.toppings,
  }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.data;
}

export async function fetchProducts() {
  const res = await axios.get(`${baseUrl}/api/products`);
  return res.data.content;
}

export async function fetchProductBySlug(slug: string) {
  const res = await axios.get(`${baseUrl}/api/products/by-slug/${slug}`);
  return res.data;
}

export async function fetchCategories() {
  const res = await axios.get(`${baseUrl}/api/categories`);
  return res.data;
}

export async function uploadImage(token: string, file: File) {
  if(!file.type.startsWith("image/")) {
    throw new Error("File is not image");
  }

  const formData = new FormData();
  formData.append("file", file);

  const res = await axios.post(
    `${baseUrl}/api/storage/files/upload`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`
      },
    }
  );

  return res.data;
}
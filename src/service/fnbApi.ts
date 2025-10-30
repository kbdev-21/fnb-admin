import type {User} from "@/service/types.ts";
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

export async function fetchProducts() {
  const res = await axios.get(`${baseUrl}/api/products`);
  return res.data.content;
}

export async function fetchProductBySlug(slug: string) {
  const res = await axios.get(`${baseUrl}/api/products/by-slug/${slug}`);
  return res.data;
}
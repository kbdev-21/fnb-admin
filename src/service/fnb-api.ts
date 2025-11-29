import type { OptionDto, ToppingDto, User, Store, Category } from "@/service/types.ts";
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

export async function fetchProducts() {
    const res = await axios.get(`${baseUrl}/api/products`);
    return res.data.content;
}

export async function fetchProductBySlug(slug: string) {
    const res = await axios.get(`${baseUrl}/api/products/by-slug/${slug}`);
    return res.data;
}

export async function fetchCategories(): Promise<Category[]> {
    const res = await axios.get(`${baseUrl}/api/categories`);
    return res.data;
}

export async function fetchStores(): Promise<Store[]> {
    const res = await axios.get(`${baseUrl}/api/stores`);
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

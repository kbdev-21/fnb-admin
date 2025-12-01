import type {
    OptionDto,
    ToppingDto,
    User,
    Store,
    Category,
    Discount,
    Product,
} from "@/api/types";
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

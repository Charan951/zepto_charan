const RAW_BASE =
  import.meta.env.VITE_API_BASE ||
  (import.meta.env.DEV ? "http://localhost:5000" : "https://ecomb.speshwayhrms.com");
const NORMALIZED_BASE = RAW_BASE.endsWith("/") ? RAW_BASE.slice(0, -1) : RAW_BASE;
const API_BASE = `${NORMALIZED_BASE}/api`;

export type User = { id: string; name: string; email: string; role: "user" | "admin" };

export type Category = {
  _id: string;
  name: string;
  icon?: string;
  color?: string;
  description?: string;
  isActive: boolean;
};

export type Product = {
  _id: string;
  name: string;
  price: number;
  stock: number;
  category?: { _id: string; name: string } | string | null;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
};

export type OrderItem = {
  product?: string;
  name: string;
  quantity: number;
  price: number;
};

export type Order = {
  _id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  address?: string;
  items: OrderItem[];
  totalAmount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "unpaid" | "paid" | "refunded";
  paymentMethod?: "cod" | "online";
  notes?: string;
  createdAt: string;
};

async function request(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }
  return data;
}

export const api = {
  login: (payload: { email: string; password: string }) =>
    request("/auth/login", { method: "POST", body: JSON.stringify(payload) }),
  register: (payload: { name: string; email: string; password: string }) =>
    request("/auth/register", { method: "POST", body: JSON.stringify(payload) }),
  me: () => request("/users/me"),
  adminStats: () => request("/users/admin/stats"),
  categoryList: () => request("/admin/categories"),
  categoryCreate: (payload: { name: string; description?: string; isActive?: boolean; icon?: string; color?: string }) =>
    request("/admin/categories", { method: "POST", body: JSON.stringify(payload) }),
  categoryUpdate: (
    id: string,
    payload: { name: string; description?: string; isActive?: boolean; icon?: string; color?: string },
  ) =>
    request(`/admin/categories/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  categoryDelete: (id: string) => request(`/admin/categories/${id}`, { method: "DELETE" }),
  productList: () => request("/admin/products"),
  productCreate: (payload: {
    name: string;
    price: number;
    stock: number;
    category?: string;
    description?: string;
    imageUrl?: string;
    imageData?: string;
    isActive?: boolean;
  }) => request("/admin/products", { method: "POST", body: JSON.stringify(payload) }),
  productUpdate: (
    id: string,
    payload: {
      name: string;
      price: number;
      stock: number;
      category?: string;
      description?: string;
      imageUrl?: string;
      imageData?: string;
      isActive?: boolean;
    },
  ) => request(`/admin/products/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  productDelete: (id: string) => request(`/admin/products/${id}`, { method: "DELETE" }),
  orderList: () => request("/admin/orders"),
  orderCreate: (payload: {
    customerName: string;
    customerEmail: string;
    items: OrderItem[];
    totalAmount: number;
    customerPhone?: string;
    address?: string;
    paymentMethod?: "cod" | "online";
    notes?: string;
  }) => request("/admin/orders", { method: "POST", body: JSON.stringify(payload) }),
  orderUpdate: (id: string, payload: { status?: Order["status"]; paymentStatus?: Order["paymentStatus"]; notes?: string }) =>
    request(`/admin/orders/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  orderDelete: (id: string) => request(`/admin/orders/${id}`, { method: "DELETE" }),
  checkout: (payload: {
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    address?: string;
    notes?: string;
    paymentMethod?: "cod" | "online";
    items: { product?: string; name: string; price: number; quantity: number }[];
  }) => request("/orders/checkout", { method: "POST", body: JSON.stringify(payload) }),
  myOrders: () => request("/orders/my"),
  productsPublic: () => request("/products"),
  productPublic: (id: string) => request(`/products/${id}`),
  categoriesPublic: () => request("/categories"),
};

export { API_BASE };

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, type Category, type Product, type Order } from "@/lib/api";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

export default function AdminDashboard() {
  const [stats, setStats] = useState<{ users: number; admins: number } | null>(null);
  const [tab, setTab] = useState<"overview" | "products" | "categories" | "orders">("overview");
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [categoryForm, setCategoryForm] = useState<{
    id?: string;
    name: string;
    description: string;
    icon: string;
    color: string;
    isActive: boolean;
  }>({ name: "", description: "", icon: "", color: "", isActive: true });
  const [productForm, setProductForm] = useState<{
    id?: string;
    name: string;
    price: string;
    stock: string;
    categoryId: string;
    description: string;
    imageUrl: string;
    imageData?: string;
    isActive: boolean;
  }>({
    name: "",
    price: "",
    stock: "",
    categoryId: "",
    description: "",
    imageUrl: "",
    imageData: undefined,
    isActive: true,
  });
  const [saving, setSaving] = useState(false);
  const [orderStatusFilter, setOrderStatusFilter] = useState<"all" | Order["status"]>("all");
  const [orderPaymentFilter, setOrderPaymentFilter] = useState<"all" | Order["paymentStatus"]>("all");
  const [orderSort, setOrderSort] = useState<"newest" | "oldest">("newest");
  const { logout } = useAuth();
  const navigate = useNavigate();

  const categorySuggestions: { name: string; icon: string; color: string }[] = [
    { name: "Fruits & Vegetables", icon: "🥬", color: "hsl(120, 50%, 92%)" },
    { name: "Dairy & Eggs", icon: "🥛", color: "hsl(45, 80%, 92%)" },
    { name: "Snacks", icon: "🍿", color: "hsl(15, 80%, 92%)" },
    { name: "Beverages", icon: "🥤", color: "hsl(200, 70%, 92%)" },
    { name: "Personal Care", icon: "🧴", color: "hsl(300, 50%, 92%)" },
    { name: "Household", icon: "🧼", color: "hsl(30, 60%, 92%)" },
    { name: "Bakery", icon: "🍞", color: "hsl(35, 80%, 92%)" },
    { name: "Meat & Fish", icon: "🥩", color: "hsl(0, 60%, 92%)" },
    { name: "Frozen Foods", icon: "🧊", color: "hsl(210, 70%, 92%)" },
    { name: "Baby Care", icon: "👶", color: "hsl(340, 80%, 95%)" },
    { name: "Pet Care", icon: "🐾", color: "hsl(30, 80%, 95%)" },
    { name: "Pharmacy / Health", icon: "💊", color: "hsl(0, 70%, 95%)" },
    { name: "Cleaning Supplies", icon: "🧽", color: "hsl(45, 70%, 92%)" },
  ];

  useEffect(() => {
    api
      .adminStats()
      .then((data) => setStats(data.stats))
      .catch((err) => setError(err.message));
    loadCategories();
    loadProducts();
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      const data = await api.orderList();
      setOrders(data.orders);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load orders");
    }
  }

  async function loadCategories() {
    try {
      const data = await api.categoryList();
      setCategories(data.categories);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load categories");
    }
  }

  async function loadProducts() {
    try {
      const data = await api.productList();
      setProducts(data.products);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products");
    }
  }

  function resetCategoryForm() {
    setCategoryForm({ id: undefined, name: "", description: "", icon: "", color: "", isActive: true });
  }

  function resetProductForm() {
    setProductForm({
      id: undefined,
      name: "",
      price: "",
      stock: "",
      categoryId: "",
      description: "",
      imageUrl: "",
      imageData: undefined,
      isActive: true,
    });
  }

  async function handleCategorySubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (categoryForm.id) {
        const data = await api.categoryUpdate(categoryForm.id, {
          name: categoryForm.name,
          description: categoryForm.description || undefined,
          isActive: categoryForm.isActive,
          icon: categoryForm.icon || undefined,
          color: categoryForm.color || undefined,
        });
        setCategories((prev) => prev.map((c) => (c._id === data.category._id ? data.category : c)));
      } else {
        const data = await api.categoryCreate({
          name: categoryForm.name,
          description: categoryForm.description || undefined,
          isActive: categoryForm.isActive,
          icon: categoryForm.icon || undefined,
          color: categoryForm.color || undefined,
        });
        setCategories((prev) => [data.category, ...prev]);
      }
      resetCategoryForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save category");
    } finally {
      setSaving(false);
    }
  }

  async function handleCategoryDelete(id: string) {
    setSaving(true);
    try {
      await api.categoryDelete(id);
      setCategories((prev) => prev.filter((c) => c._id !== id));
      if (categoryForm.id === id) {
        resetCategoryForm();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete category");
    } finally {
      setSaving(false);
    }
  }

  async function handleProductSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      name: productForm.name,
      price: Number(productForm.price),
      stock: Number(productForm.stock),
      category: productForm.categoryId || undefined,
      description: productForm.description || undefined,
      imageUrl: productForm.imageUrl || undefined,
      imageData: productForm.imageData || undefined,
      isActive: productForm.isActive,
    };
    try {
      if (productForm.id) {
        const data = await api.productUpdate(productForm.id, payload);
        setProducts((prev) => prev.map((p) => (p._id === data.product._id ? data.product : p)));
      } else {
        const data = await api.productCreate(payload);
        setProducts((prev) => [data.product, ...prev]);
      }
      resetProductForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save product");
    } finally {
      setSaving(false);
    }
  }

  async function handleProductDelete(id: string) {
    setSaving(true);
    try {
      await api.productDelete(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      if (productForm.id === id) {
        resetProductForm();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete product");
    } finally {
      setSaving(false);
    }
  }

  function handleProductImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      setProductForm((f) => ({ ...f, imageData: undefined }));
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      if (typeof result === "string") {
        setProductForm((f) => ({ ...f, imageData: result, imageUrl: "" }));
      }
    };
    reader.readAsDataURL(file);
  }

  const totalSales = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalOrders = orders.length;
  const totalCustomers = new Set(orders.map((o) => o.customerEmail || o.customerName)).size;
  const lowStockItems = products.filter((p) => p.stock > 0 && p.stock <= 5).length;

  function renderOverview() {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              <CardDescription className="text-xs">All time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">
                ₹{totalSales.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <CardDescription className="text-xs">Placed so far</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{totalOrders}</div>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <CardDescription className="text-xs">Unique by email</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{totalCustomers}</div>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
              <CardDescription className="text-xs">Stock ≤ 5</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{lowStockItems}</div>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Users</CardTitle>
              <CardDescription>Access and roles</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Users</div>
                <div className="text-2xl font-semibold">{stats ? stats.users : "-"}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Admins</div>
                <div className="text-2xl font-semibold">{stats ? stats.admins : "-"}</div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>System</CardTitle>
              <CardDescription>Data health</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Categories</span>
                <span className="font-medium">{categories.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Products</span>
                <span className="font-medium">{products.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Orders</span>
                <span className="font-medium">{orders.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  async function handleOrderUpdate(id: string, partial: { status?: Order["status"]; paymentStatus?: Order["paymentStatus"] }) {
    setSaving(true);
    try {
      const data = await api.orderUpdate(id, partial);
      setOrders((prev) => prev.map((o) => (o._id === data.order._id ? data.order : o)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update order");
    } finally {
      setSaving(false);
    }
  }

  async function handleOrderDelete(id: string) {
    setSaving(true);
    try {
      await api.orderDelete(id);
      setOrders((prev) => prev.filter((o) => o._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete order");
    } finally {
      setSaving(false);
    }
  }

  function renderOrders() {
    const filteredOrders = orders
      .filter((o) => (orderStatusFilter === "all" ? true : o.status === orderStatusFilter))
      .filter((o) => (orderPaymentFilter === "all" ? true : o.paymentStatus === orderPaymentFilter))
      .slice()
      .sort((a, b) => {
        const aTime = new Date(a.createdAt).getTime();
        const bTime = new Date(b.createdAt).getTime();
        return orderSort === "newest" ? bTime - aTime : aTime - bTime;
      });

    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Orders</CardTitle>
          <CardDescription>Manage statuses and payments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Select
              value={orderStatusFilter}
              onValueChange={(value) =>
                setOrderStatusFilter(value === "all" ? "all" : (value as Order["status"]))
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Any status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={orderPaymentFilter}
              onValueChange={(value) =>
                setOrderPaymentFilter(value === "all" ? "all" : (value as Order["paymentStatus"]))
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Any payment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any payment</SelectItem>
                <SelectItem value="unpaid">Unpaid</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={orderSort}
              onValueChange={(value) =>
                setOrderSort(value === "oldest" ? "oldest" : "newest")
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest first</SelectItem>
                <SelectItem value="oldest">Oldest first</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 text-left">Order</th>
                    <th className="py-2 text-left">Total</th>
                    <th className="py-2 text-left">Status</th>
                    <th className="py-2 text-left">Payment</th>
                    <th className="py-2 text-left">Created</th>
                    <th className="py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((o) => (
                    <tr key={o._id} className="border-b last:border-none align-top">
                      <td className="py-2">
                        <div className="font-medium">{o.customerName}</div>
                        <div className="text-xs text-muted-foreground">
                          #{o._id.slice(-6)} • {o.customerEmail}
                        </div>
                      </td>
                      <td className="py-2">{formatPrice(o.totalAmount)}</td>
                      <td className="py-2">
                        <Badge
                          variant={
                            o.status === "cancelled"
                              ? "destructive"
                              : o.status === "delivered"
                              ? "default"
                              : "secondary"
                          }
                          className="capitalize"
                        >
                          {o.status}
                        </Badge>
                      </td>
                      <td className="py-2">
                        <div className="flex flex-wrap items-center gap-1">
                          <Badge
                            variant={
                              o.paymentStatus === "paid"
                                ? "default"
                                : o.paymentStatus === "refunded"
                                ? "outline"
                                : "secondary"
                            }
                            className="capitalize"
                          >
                            {o.paymentStatus}
                          </Badge>
                          {o.paymentMethod && (
                            <Badge variant="outline" className="text-[10px] uppercase tracking-wide">
                              {o.paymentMethod === "cod" ? "COD" : "Online"}
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="py-2 text-xs">
                        {new Date(o.createdAt).toLocaleDateString()}{" "}
                        {new Date(o.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </td>
                      <td className="py-2 text-right space-y-1">
                        <div className="flex flex-wrap justify-end gap-1">
                          <Button
                            size="xs"
                            variant="outline"
                            disabled={saving}
                            onClick={() => handleOrderUpdate(o._id, { status: "processing" })}
                          >
                            Process
                          </Button>
                          <Button
                            size="xs"
                            variant="outline"
                            disabled={saving}
                            onClick={() => handleOrderUpdate(o._id, { status: "shipped" })}
                          >
                            Ship
                          </Button>
                          <Button
                            size="xs"
                            variant="outline"
                            disabled={saving}
                            onClick={() => handleOrderUpdate(o._id, { status: "delivered" })}
                          >
                            Complete
                          </Button>
                          <Button
                            size="xs"
                            variant="outline"
                            disabled={saving}
                            onClick={() => handleOrderUpdate(o._id, { paymentStatus: "paid" })}
                          >
                            Mark Paid
                          </Button>
                          <Button
                            size="xs"
                            variant="destructive"
                            disabled={saving}
                            onClick={() => handleOrderDelete(o._id)}
                          >
                            Delete
                          </Button>
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          {o.items.slice(0, 2).map((it) => `${it.quantity}× ${it.name}`).join(", ")}
                          {o.items.length > 2 ? "…" : ""}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredOrders.length === 0 && (
                    <tr>
                      <td className="py-4 text-center text-muted-foreground" colSpan={6}>
                        No orders found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
          </div>
        </CardContent>
      </Card>
    );
  }

  function renderCategories() {
    return (
      <div className="grid gap-6 md:grid-cols-[2fr,3fr]">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>{categoryForm.id ? "Edit Category" : "New Category"}</CardTitle>
            <CardDescription>Manage product categories</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCategorySubmit} className="space-y-4">
              <div>
                <div className="text-sm mb-1">Name</div>
                <Input
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm((f) => ({ ...f, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <div className="text-sm mb-1">Description</div>
                <Input
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm((f) => ({ ...f, description: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-sm mb-1">Icon</div>
                  <Input
                    value={categoryForm.icon}
                    onChange={(e) => setCategoryForm((f) => ({ ...f, icon: e.target.value }))}
                    placeholder="e.g. 🥬"
                  />
                </div>
                <div>
                  <div className="text-sm mb-1">Color</div>
                  <Input
                    value={categoryForm.color}
                    onChange={(e) => setCategoryForm((f) => ({ ...f, color: e.target.value }))}
                    placeholder="e.g. hsl(120, 50%, 92%)"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Quick suggestions</div>
                <div className="flex flex-wrap gap-2">
                  {categorySuggestions.map((s) => (
                    <Button
                      key={s.name}
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-8 px-2 text-xs"
                      onClick={() =>
                        setCategoryForm((f) => ({
                          ...f,
                          name: f.name || s.name,
                          icon: s.icon,
                          color: s.color,
                        }))
                      }
                    >
                      <span className="mr-1">{s.icon}</span>
                      <span className="truncate max-w-[120px]">{s.name}</span>
                    </Button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="category-active"
                  type="checkbox"
                  checked={categoryForm.isActive}
                  onChange={(e) => setCategoryForm((f) => ({ ...f, isActive: e.target.checked }))}
                  className="h-4 w-4 rounded border-border"
                />
                <label htmlFor="category-active" className="text-sm">
                  Active
                </label>
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={saving} className="flex-1">
                  {categoryForm.id ? "Update" : "Create"}
                </Button>
                {categoryForm.id && (
                  <Button type="button" variant="outline" onClick={resetCategoryForm}>
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Categories</CardTitle>
            <CardDescription>Existing records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 text-left">Name</th>
                    <th className="py-2 text-left">Status</th>
                    <th className="py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((c) => (
                    <tr key={c._id} className="border-b last:border-none">
                      <td className="py-2">{c.name}</td>
                      <td className="py-2">{c.isActive ? "Active" : "Hidden"}</td>
                      <td className="py-2 text-right space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            setCategoryForm({
                              id: c._id,
                              name: c.name,
                              description: c.description || "",
                              icon: c.icon || "",
                              color: c.color || "",
                              isActive: c.isActive,
                            })
                          }
                        >
                          Edit
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleCategoryDelete(c._id)}>
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {categories.length === 0 && (
                    <tr>
                      <td className="py-4 text-center text-muted-foreground" colSpan={3}>
                        No categories yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  function renderProducts() {
    return (
      <div className="grid gap-6 md:grid-cols-[2fr,3fr]">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>{productForm.id ? "Edit Product" : "New Product"}</CardTitle>
            <CardDescription>Manage inventory items</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProductSubmit} className="space-y-4">
              <div>
                <div className="text-sm mb-1">Name</div>
                <Input
                  value={productForm.name}
                  onChange={(e) => setProductForm((f) => ({ ...f, name: e.target.value }))}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-sm mb-1">Price</div>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={productForm.price}
                    onChange={(e) => setProductForm((f) => ({ ...f, price: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <div className="text-sm mb-1">Stock</div>
                  <Input
                    type="number"
                    min="0"
                    value={productForm.stock}
                    onChange={(e) => setProductForm((f) => ({ ...f, stock: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div>
                <div className="text-sm mb-1">Category</div>
                <Select
                  value={productForm.categoryId}
                  onValueChange={(value) => setProductForm((f) => ({ ...f, categoryId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c._id} value={c._id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <div className="text-sm mb-1">Description</div>
                <Input
                  value={productForm.description}
                  onChange={(e) => setProductForm((f) => ({ ...f, description: e.target.value }))}
                />
              </div>
              <div>
                <div className="text-sm mb-1">Product Image</div>
                <Input type="file" accept="image/*" onChange={handleProductImageChange} />
              </div>
              <div>
                <div className="text-sm mb-1">Image URL (optional)</div>
                <Input
                  value={productForm.imageUrl}
                  onChange={(e) => setProductForm((f) => ({ ...f, imageUrl: e.target.value }))}
                  placeholder="Paste image URL or leave empty when uploading"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="product-active"
                  type="checkbox"
                  checked={productForm.isActive}
                  onChange={(e) => setProductForm((f) => ({ ...f, isActive: e.target.checked }))}
                  className="h-4 w-4 rounded border-border"
                />
                <label htmlFor="product-active" className="text-sm">
                  Active
                </label>
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={saving} className="flex-1">
                  {productForm.id ? "Update" : "Create"}
                </Button>
                {productForm.id && (
                  <Button type="button" variant="outline" onClick={resetProductForm}>
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Inventory</CardTitle>
            <CardDescription>Products in stock</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 text-left">Name</th>
                    <th className="py-2 text-left">Category</th>
                    <th className="py-2 text-left">Price</th>
                    <th className="py-2 text-left">Stock</th>
                    <th className="py-2 text-left">Status</th>
                    <th className="py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p._id} className="border-b last:border-none">
                      <td className="py-2">{p.name}</td>
                      <td className="py-2">
                        {typeof p.category === "object" && p.category !== null ? p.category.name : ""}
                      </td>
                      <td className="py-2">{formatPrice(p.price)}</td>
                      <td className="py-2">{p.stock}</td>
                      <td className="py-2">{p.isActive ? "Active" : "Hidden"}</td>
                      <td className="py-2 text-right space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            setProductForm({
                              id: p._id,
                              name: p.name,
                              price: String(p.price),
                              stock: String(p.stock),
                              categoryId:
                                typeof p.category === "object" && p.category !== null ? p.category._id : productForm.categoryId,
                              description: p.description || "",
                              imageUrl: p.imageUrl || "",
                              imageData: undefined,
                              isActive: p.isActive,
                            })
                          }
                        >
                          Edit
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleProductDelete(p._id)}>
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr>
                      <td className="py-4 text-center text-muted-foreground" colSpan={6}>
                        No products yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <ProtectedRoute role="admin">
      <div className="flex min-h-[calc(100vh-4rem)] bg-muted/40">
        <aside className="hidden w-64 border-r bg-background/95 p-4 md:flex md:flex-col">
          <div className="mb-6">
            <div className="text-sm font-semibold text-muted-foreground">Quick Glow Grocer</div>
            <div className="text-lg font-bold">Admin</div>
          </div>
          <nav className="flex-1 space-y-1">
            <button
              type="button"
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm ${
                tab === "overview" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted"
              }`}
              onClick={() => setTab("overview")}
            >
              <span>Dashboard</span>
            </button>
            <button
              type="button"
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm ${
                tab === "products" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted"
              }`}
              onClick={() => setTab("products")}
            >
              <span>Inventory</span>
            </button>
            <button
              type="button"
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm ${
                tab === "categories" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted"
              }`}
              onClick={() => setTab("categories")}
            >
              <span>Categories</span>
            </button>
            <button
              type="button"
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm ${
                tab === "orders" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted"
              }`}
              onClick={() => setTab("orders")}
            >
              <span>Orders</span>
            </button>
          </nav>
        </aside>
        <div className="flex-1">
          <div className="border-b bg-background/95">
            <div className="container mx-auto flex flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                  Manage inventory, categories, orders, and overview metrics.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Input placeholder="Search orders, products..." className="w-full max-w-xs" />
                <Select defaultValue="today">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                >
                  Log out
                </Button>
              </div>
            </div>
          </div>
          <div className="container mx-auto px-4 py-6 space-y-4">
            {error && <div className="text-sm text-destructive">{error}</div>}
            {tab === "overview" && renderOverview()}
            {tab === "products" && renderProducts()}
            {tab === "categories" && renderCategories()}
            {tab === "orders" && renderOrders()}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

"use client";

import { useState } from "react";
import { 
  ShoppingCart, 
  LineChart, 
  Package, 
  FileText, 
  Plus, 
  Minus,
  Trash2,
  Eye,
  TrendingUp,
  DollarSign,
  Users,
  Star,
  RefreshCw
} from "lucide-react";

type Product = {
  id: number;
  name: string;
  stock: number;
  price: number;
  sold: number;
  category: string;
  rating: number;
};

type CartItem = Product & {
  quantity: number;
};

type SalesData = {
  name: string;
  value: number;
  target: number;
};

type TabButtonProps = {
  value: string;
  children: React.ReactNode;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

type StatCardProps = {
  title: string;
  value: string | number;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
  trend?: string;
};

export default function Dashboard() {
  const [search, setSearch] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [qty, setQty] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [totalSales, setTotalSales] = useState<number>(2450000);
  const [todaySales, setTodaySales] = useState<number>(320000);
  const [customers, setCustomers] = useState<number>(28);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: "Tomat", stock: 50, price: 3000, sold: 25, category: "Buah", rating: 4.5 },
    { id: 2, name: "Wortel", stock: 30, price: 4000, sold: 18, category: "Sayur", rating: 4.8 },
    { id: 3, name: "Kangkung", stock: 40, price: 2500, sold: 35, category: "Sayur", rating: 4.3 },
    { id: 4, name: "Bayam", stock: 25, price: 3500, sold: 22, category: "Sayur", rating: 4.6 },
    { id: 5, name: "Cabai", stock: 60, price: 8000, sold: 40, category: "Bumbu", rating: 4.9 },
  ]);

  const salesData: SalesData[] = [
    { name: "Sen", value: 45000, target: 50000 },
    { name: "Sel", value: 52000, target: 50000 },
    { name: "Rab", value: 48000, target: 50000 },
    { name: "Kam", value: 61000, target: 50000 },
    { name: "Jum", value: 55000, target: 50000 },
    { name: "Sab", value: 72000, target: 50000 },
    { name: "Min", value: 38000, target: 50000 },
  ];

  const addToCart = () => {
    if (!selectedProduct || qty <= 0) return;

    const product = products.find(p => p.id === parseInt(selectedProduct));
    if (!product || product.stock < qty) return;

    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + qty }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: qty }]);
    }

    setProducts(products.map(p =>
      p.id === product.id
        ? { ...p, stock: p.stock - qty }
        : p
    ));

    setSelectedProduct("");
    setQty(1);
  };

  const removeFromCart = (id: number) => {
    const item = cart.find(c => c.id === id);
    if (item) {
      setProducts(products.map(p =>
        p.id === id
          ? { ...p, stock: p.stock + item.quantity }
          : p
      ));
      setCart(cart.filter(c => c.id !== id));
    }
  };

  const updateCartQuantity = (id: number, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(id);
      return;
    }

    const item = cart.find(c => c.id === id);
    const product = products.find(p => p.id === id);

    if (item && product) {
      const diff = newQty - item.quantity;
      if (product.stock >= diff) {
        setCart(cart.map(c =>
          c.id === id ? { ...c, quantity: newQty } : c
        ));
        setProducts(products.map(p =>
          p.id === id ? { ...p, stock: p.stock - diff } : p
        ));
      }
    }
  };

  const processCheckout = () => {
    if (cart.length === 0) return;

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTodaySales(prev => prev + total);
    setTotalSales(prev => prev + total);
    setCustomers(prev => prev + 1);
    setCart([]);

    // Animate success
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 1000);
  };

  const TabButton = ({ value, children, icon: Icon }: TabButtonProps) => (
    <button
      onClick={() => setActiveTab(value)}
      className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
        activeTab === value
          ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-200'
          : 'bg-white text-gray-600 hover:bg-green-50 hover:text-green-600 shadow-md'
      }`}
      type="button"
      aria-pressed={activeTab === value}
    >
      <Icon className="w-4 h-4" />
      {children}
    </button>
  );

  const StatCard = ({ title, value, icon: Icon, color, trend }: StatCardProps) => (
    <div className={`relative overflow-hidden rounded-2xl p-6 shadow-xl transform hover:scale-105 transition-all duration-300 ${color}`}>
      <div className="absolute top-0 right-0 w-20 h-20 transform translate-x-6 -translate-y-6">
        <div className="w-full h-full rounded-full bg-white bg-opacity-20"></div>
      </div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <Icon className="w-8 h-8 text-white opacity-80" />
          {trend && (
            <div className="flex items-center text-white text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              +{trend}%
            </div>
          )}
        </div>
        <h3 className="text-white text-sm font-medium opacity-90">{title}</h3>
        <p className="text-white text-3xl font-bold">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
            🥬Toko Sayur Bumi
          </h1>
          <p className="text-gray-600">Sistem Point of Sale Modern untuk Toko Sayur</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-8" role="tablist" aria-label="Dashboard Tabs">
          <TabButton value="overview" icon={LineChart}>Ringkasan</TabButton>
          <TabButton value="sales" icon={ShoppingCart}>Penjualan</TabButton>
          <TabButton value="products" icon={Package}>Produk</TabButton>
          <TabButton value="reports" icon={FileText}>Laporan</TabButton>
        </div>

        {/* Content */}
        <div className="transition-all duration-500 ease-in-out" role="tabpanel">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-8 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="Total Penjualan"
                  value={`Rp ${totalSales.toLocaleString()}`}
                  icon={DollarSign}
                  color="bg-gradient-to-br from-green-500 to-green-600"
                  trend="12"
                />
                <StatCard
                  title="Penjualan Hari Ini"
                  value={`Rp ${todaySales.toLocaleString()}`}
                  icon={TrendingUp}
                  color="bg-gradient-to-br from-blue-500 to-blue-600"
                  trend="8"
                />
                <StatCard
                  title="Total Produk"
                  value={products.length}
                  icon={Package}
                  color="bg-gradient-to-br from-purple-500 to-purple-600"
                  trend="5"
                />
                <StatCard
                  title="Pelanggan Hari Ini"
                  value={customers}
                  icon={Users}
                  color="bg-gradient-to-br from-orange-500 to-orange-600"
                  trend="15"
                />
              </div>

              {/* Quick Stats Chart */}
              <div className="bg-white rounded-2xl p-6 shadow-xl">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Penjualan Mingguan</h3>
                <div className="grid grid-cols-7 gap-2 h-48">
                  {salesData.map((day, index) => (
                    <div key={day.name} className="flex flex-col items-center">
                      <div className="flex-1 flex flex-col justify-end w-full">
                        <div 
                          className="bg-gradient-to-t from-green-500 to-green-400 rounded-t-lg transition-all duration-1000 hover:from-green-600 hover:to-green-500"
                          style={{ 
                            height: `${(day.value / Math.max(...salesData.map(d => d.value))) * 100}%`,
                            animationDelay: `${index * 100}ms`
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium mt-2 text-gray-600">{day.name}</span>
                      <span className="text-xs text-gray-500">Rp {day.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Sales Tab */}
          {activeTab === "sales" && (
            <div className="grid lg:grid-cols-2 gap-8 animate-fade-in">
              {/* Sales Form */}
              <div className="bg-white rounded-2xl p-6 shadow-xl">
                <h2 className="text-2xl font-semibold mb-6 text-gray-800">Form Penjualan</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-2" htmlFor="product-select">Pilih Produk</label>
                    <select
                      id="product-select"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:border-transparent transition-all"
                      value={selectedProduct}
                      onChange={(e) => setSelectedProduct(e.target.value)}
                    >
                      <option value="">-- Pilih Produk --</option>
                      {products.filter(p => p.stock > 0).map((p) => (
                        <option key={p.id} value={p.id.toString()}>
                          {p.name} - Rp {p.price.toLocaleString()} (Stok: {p.stock})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="quantity-input">Jumlah</label>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setQty(Math.max(1, qty - 1))}
                        className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        aria-label="Kurangi jumlah"
                        type="button"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <input
                        id="quantity-input"
                        type="number"
                        value={qty}
                        onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                        className="flex-1 p-3 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        min={1}
                        aria-label="Jumlah produk"
                      />
                      <button
                        onClick={() => setQty(qty + 1)}
                        className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        aria-label="Tambah jumlah"
                        type="button"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={addToCart}
                    disabled={!selectedProduct}
                    className={`w-full py-3 rounded-lg font-medium transition-all transform ${
                      selectedProduct
                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 hover:scale-105 shadow-lg'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    } ${isAnimating ? 'animate-pulse' : ''}`}
                    type="button"
                  >
                    <ShoppingCart className="w-4 h-4 inline mr-2" />
                    Tambah ke Keranjang
                  </button>
                </div>
              </div>

              {/* Shopping Cart */}
              <div className="bg-white rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800">Keranjang Belanja</h2>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {cart.length} item
                  </span>
                </div>

                <div className="space-y-3 max-h-60 overflow-y-auto" aria-live="polite" aria-relevant="additions removals">
                  {cart.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Keranjang masih kosong</p>
                    </div>
                  ) : (
                    cart.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800">{item.name}</h4>
                          <p className="text-sm text-gray-600">Rp {item.price.toLocaleString()}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            className="p-1 bg-white rounded hover:bg-gray-100 transition-colors"
                            aria-label={`Kurangi jumlah produk ${item.name}`}
                            type="button"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            className="p-1 bg-white rounded hover:bg-gray-100 transition-colors"
                            aria-label={`Tambah jumlah produk ${item.name}`}
                            type="button"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors ml-2"
                            aria-label={`Hapus produk ${item.name} dari keranjang`}
                            type="button"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {cart.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-semibold text-gray-800">Total:</span>
                      <span className="text-xl font-bold text-green-600">
                        Rp {cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()}
                      </span>
                    </div>
                    <button
                      onClick={processCheckout}
                      className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg"
                      type="button"
                    >
                      Proses Pembayaran
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === "products" && (
            <div className="animate-fade-in">
              <div className="bg-white rounded-2xl p-6 shadow-xl">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800">Manajemen Produk</h2>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Cari produk..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 text-black rounded-lg "
                      aria-label="Cari produk"
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <Eye className="w-4 h-4 text-black" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products
                    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
                    .map((product) => {
                      const totalSoldStock = product.sold + product.stock;
                      const performancePercent = totalSoldStock > 0 ? Math.round((product.sold / totalSoldStock) * 100) : 0;
                      const widthPercent = Math.min(performancePercent, 100);
                      return (
                        <div
                          key={product.id}
                          className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                              <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                {product.category}
                              </span>
                            </div>
                            <div className="flex items-center text-yellow-500">
                              <Star className="w-4 h-4 fill-current" />
                              <span className="text-sm ml-1 text-gray-600">{product.rating}</span>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Harga:</span>
                              <span className="font-semibold text-green-600">Rp {product.price.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Stok:</span>
                              <span className={`font-semibold ${product.stock > 10 ? 'text-green-600' : 'text-red-500'}`}>
                                {product.stock}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Terjual:</span>
                              <span className="font-semibold text-blue-600">{product.sold}</span>
                            </div>
                          </div>

                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${widthPercent}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              Performa Penjualan: {performancePercent}%
                            </p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === "reports" && (
            <div className="animate-fade-in space-y-8">
              <div className="bg-white rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800">Laporan Penjualan</h2>
                  <button className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors" type="button" aria-label="Refresh laporan">
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                  </button>
                </div>

                {/* Top Products */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4 text-gray-700">Produk Terlaris</h3>
                  <div className="space-y-3">
                    {products
                      .slice()
                      .sort((a, b) => b.sold - a.sold)
                      .slice(0, 5)
                      .map((product, index) => (
                        <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                              index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-500' : 'bg-gray-300'
                            }`}>
                              {index + 1}
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-800">{product.name}</h4>
                              <p className="text-sm text-gray-600">{product.category}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-800">{product.sold} terjual</p>
                            <p className="text-sm text-gray-600">Rp {(product.sold * product.price).toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Sales Chart */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-700">Grafik Penjualan Mingguan</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-7 gap-4 h-64">
                      {salesData.map((day, index) => {
                        const maxValue = Math.max(...salesData.map(d => d.value));
                        return (
                          <div key={day.name} className="flex flex-col items-center">
                            <div className="flex-1 flex flex-col justify-end w-full relative">
                              <div 
                                className="bg-gradient-to-t from-green-500 to-green-400 rounded-t-lg transition-all duration-1000 hover:from-green-600 hover:to-green-500 relative group"
                                style={{ 
                                  height: `${(day.value / maxValue) * 100}%`,
                                  animationDelay: `${index * 150}ms`
                                }}
                              >
                                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                  Rp {day.value.toLocaleString()}
                                </div>
                              </div>
                              {/* Target line */}
                              <div 
                                className="absolute w-full border-t-2 border-dashed border-red-400"
                                style={{ bottom: `${(day.target / maxValue) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium mt-2 text-gray-600">{day.name}</span>
                            <div className="flex items-center gap-1 mt-1">
                              {day.value >= day.target ? (
                                <TrendingUp className="w-3 h-3 text-green-500" />
                              ) : (
                                <TrendingUp className="w-3 h-3 text-red-500 transform rotate-180" />
                              )}
                              <span className={`text-xs ${
                                day.value >= day.target ? 'text-green-600' : 'text-red-500'
                              }`}>
                                {Math.round((day.value / day.target) * 100)}%
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-4 flex items-center justify-center gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gradient-to-t from-green-500 to-green-400 rounded"></div>
                        <span>Penjualan Aktual</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-2 border-t-2 border-dashed border-red-400"></div>
                        <span>Target (Rp 50.000)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}



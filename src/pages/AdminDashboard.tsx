import { useState } from "react";
import { useProducts } from "@/hooks/useProducts";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, ShoppingBag, Users, Package, Settings, 
  LogOut, Menu, X, PlusCircle, Search, Edit2, Trash2, 
  TrendingUp, CreditCard, CheckCircle, Clock, AlertTriangle, 
  ChevronDown, Save, XCircle
} from "lucide-react";
import { toast } from "sonner";


const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  
  const { products: inventory, addProduct, updateProduct, deleteProduct } = useProducts();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [newProduct, setNewProduct] = useState({ name: "", category: "Perfumes", stock: "", price: "" });
  const [filterCategory, setFilterCategory] = useState("All");

  // Filter Logic
  const filteredProducts = filterCategory === "All" 
    ? inventory 
    : inventory.filter(p => p.category.toLowerCase() === filterCategory.toLowerCase());

  // Add Product Logic
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;
    
    const stockNum = parseInt(newProduct.stock) || 0;
    
    addProduct({
      name: newProduct.name,
      category: newProduct.category.toLowerCase() as any,
      price: `₹${parseInt(newProduct.price).toLocaleString()}`,
      numericPrice: parseInt(newProduct.price),
      gender: "unisex",
      image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=600&auto=format&fit=crop", // placeholder
      stock: stockNum,
      status: stockNum > 10 ? "In Stock" : stockNum > 0 ? "Low Stock" : "Out of Stock"
    });
    
    setIsAddModalOpen(false);
    setNewProduct({ name: "", category: "Perfumes", stock: "", price: "" });
    toast.success("Product added successfully!");
  };

  // Delete Product Logic
  const handleDeleteProduct = (id: string) => {
    if (confirm("Are you sure you want to remove this product?")) {
      deleteProduct(id);
      toast.error("Product removed.");
    }
  };

  // Edit Product Logic
  const handleUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const stockNum = parseInt(editingProduct.stock) || 0;
    updateProduct({
      ...editingProduct,
      category: editingProduct.category.toLowerCase() as any,
      price: `₹${parseInt(editingProduct.price).toLocaleString()}`,
      numericPrice: parseInt(editingProduct.price),
      stock: stockNum,
      status: stockNum > 10 ? "In Stock" : stockNum > 0 ? "Low Stock" : "Out of Stock"
    });
    setEditingProduct(null);
    toast.success("Product updated!");
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex font-sans">
      {/* Sidebar - Same as before but with consistent icons */}
      <aside className={`${isSidebarOpen ? "w-64" : "w-20"} bg-[#310101] text-white transition-all duration-300 flex flex-col shrink-0 shadow-2xl relative z-20`}>
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          {isSidebarOpen && <span className="font-serif text-xl tracking-[0.2em] uppercase italic text-[#E5D5C5]">Kaleemiya</span>}
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-1.5 hover:bg-white/10 rounded-lg"><Menu className="w-5 h-5 text-[#E5D5C5]" /></button>
        </div>
        <nav className="flex-1 py-8 px-4 space-y-2">
          {["Dashboard", "Products", "Orders", "Customers", "Settings"].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all ${activeTab === tab ? "bg-[#F9F6F2] text-[#310101] shadow-lg" : "hover:bg-white/5 text-white/60"}`}>
              {tab === "Dashboard" && <LayoutDashboard className="w-5 h-5" />}
              {tab === "Products" && <Package className="w-5 h-5" />}
              {tab === "Orders" && <ShoppingBag className="w-5 h-5" />}
              {tab === "Customers" && <Users className="w-5 h-5" />}
              {tab === "Settings" && <Settings className="w-5 h-5" />}
              {isSidebarOpen && <span className="text-[13px] font-bold uppercase tracking-widest">{tab}</span>}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b h-20 flex items-center justify-between px-10 shrink-0 shadow-sm z-10">
          <h1 className="text-2xl font-serif text-[#310101] italic">{activeTab}</h1>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4 border-l pl-8 border-gray-100">
               <div className="text-right hidden sm:block">
                <p className="text-[11px] font-bold text-[#310101] uppercase tracking-widest leading-none mb-1">Kaleemiya</p>
                <p className="text-[9px] text-gray-400 font-medium">Administrator</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#310101] flex items-center justify-center text-[#F9F6F2] font-serif italic text-lg shadow-xl">K</div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 bg-[#FDFCFB]">
          {activeTab === "Products" && (
            <div className="space-y-6">
              {/* Filter & Add Row */}
              <div className="flex flex-wrap justify-between items-center gap-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-50">
                <div className="flex items-center gap-4 bg-gray-50 px-6 py-2 rounded-full">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Filter:</span>
                  <select 
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="bg-transparent text-[11px] font-bold text-[#310101] uppercase tracking-wider outline-none cursor-pointer"
                  >
                    <option value="All">All Categories</option>
                    <option value="Perfumes">Perfumes</option>
                    <option value="Attar">Attar</option>
                    <option value="Oud">Oud</option>
                    <option value="Bakhoor">Bakhoor</option>
                  </select>
                </div>
                <button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="flex items-center gap-3 bg-[#310101] text-white px-8 py-3.5 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all"
                >
                  <PlusCircle className="w-4 h-4 text-[#E5D5C5]" />
                  Add Product
                </button>
              </div>

              {/* Products Table */}
              <div className="bg-white rounded-3xl shadow-sm border border-gray-50 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-[#F9F6F2]/30 text-[10px] font-bold uppercase tracking-[0.2em] text-[#310101]/40 border-b">
                    <tr>
                      <th className="px-8 py-6">Product Item</th>
                      <th className="px-8 py-6">Category</th>
                      <th className="px-8 py-6">Stock</th>
                      <th className="px-8 py-6">Price</th>
                      <th className="px-8 py-6">Status</th>
                      <th className="px-8 py-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-xs">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-8 py-5 flex items-center gap-4">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg group-hover:scale-105 transition-transform" />
                          <span className="font-bold text-[#310101]">{p.name}</span>
                        </td>
                        <td className="px-8 py-5 font-medium text-gray-500">{p.category}</td>
                        <td className="px-8 py-5 text-gray-600">{(p as any).stock || 0} pcs</td>
                        <td className="px-8 py-5 font-bold text-[#310101]">{p.price}</td>
                        <td className="px-8 py-5">
                          <span className={`px-4 py-1 rounded-full text-[9px] font-bold uppercase ${
                            (p as any).status === "In Stock" ? "bg-green-100 text-green-700" :
                            (p as any).status === "Low Stock" ? "bg-orange-100 text-orange-700" : "bg-red-100 text-red-700"
                          }`}>
                            {(p as any).status || "In Stock"}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => setEditingProduct(p)} className="p-2.5 hover:bg-blue-50 rounded-xl transition-all"><Edit2 className="w-4 h-4 text-gray-400 group-hover:text-blue-600" /></button>
                            <button onClick={() => handleDeleteProduct(p.id)} className="p-2.5 hover:bg-red-50 rounded-xl transition-all"><Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-600" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "Dashboard" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-50">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Sales</p>
                <h3 className="text-3xl font-serif text-[#310101]">₹1,24,500</h3>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Active Products</p>
                 <h3 className="text-3xl font-serif text-[#310101]">{inventory.length}</h3>
              </div>
            </div>
          )}
        </div>

        {/* --- MODALS (Add/Edit) --- */}
        <AnimatePresence>
          {(isAddModalOpen || editingProduct) && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
                className="bg-white w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden p-10 relative"
              >
                <button onClick={() => { setIsAddModalOpen(false); setEditingProduct(null); }} className="absolute top-8 right-8 p-2 hover:bg-gray-100 rounded-full">
                  <XCircle className="w-6 h-6 text-gray-300" />
                </button>
                <h2 className="text-3xl font-serif text-[#310101] italic mb-10">
                  {editingProduct ? "Update Product" : "Add New Experience"}
                </h2>
                <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Product Name</label>
                       <input 
                        required
                        value={editingProduct ? editingProduct.name : newProduct.name}
                        onChange={(e) => editingProduct ? setEditingProduct({...editingProduct, name: e.target.value}) : setNewProduct({...newProduct, name: e.target.value})}
                        className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-xs font-bold text-[#310101] focus:ring-2 focus:ring-[#310101]/5"
                      />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Category</label>
                       <select 
                        value={editingProduct ? editingProduct.category : newProduct.category}
                        onChange={(e) => editingProduct ? setEditingProduct({...editingProduct, category: e.target.value}) : setNewProduct({...newProduct, category: e.target.value})}
                        className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-xs font-bold text-[#310101] focus:ring-2 focus:ring-[#310101]/5"
                      >
                        <option>Perfumes</option><option>Attar</option><option>Oud</option><option>Bakhoor</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Stock Level</label>
                       <input 
                        type="number" required
                        value={editingProduct ? editingProduct.stock : newProduct.stock}
                        onChange={(e) => {
                           const val = e.target.value;
                           if(editingProduct) setEditingProduct({...editingProduct, stock: val, status: parseInt(val) > 10 ? "In Stock" : parseInt(val) > 0 ? "Low Stock" : "Out of Stock"});
                           else setNewProduct({...newProduct, stock: val});
                        }}
                        className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-xs font-bold text-[#310101] focus:ring-2 focus:ring-[#310101]/5"
                      />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Price (₹)</label>
                       <input 
                        type="number" required
                        value={editingProduct ? editingProduct.price : newProduct.price}
                        onChange={(e) => editingProduct ? setEditingProduct({...editingProduct, price: e.target.value}) : setNewProduct({...newProduct, price: e.target.value})}
                        className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-xs font-bold text-[#310101] focus:ring-2 focus:ring-[#310101]/5"
                      />
                    </div>
                  </div>
                  <button className="w-full bg-[#310101] text-white py-4 rounded-full text-[11px] font-bold uppercase tracking-[0.3em] shadow-2xl shadow-[#310101]/20 hover:scale-105 transition-transform mt-6">
                    {editingProduct ? "SAVE CHANGES" : "PUBLISH TO STORE"}
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AdminDashboard;

import { useState, useEffect } from "react";
import { useProducts } from "@/hooks/useProducts";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, ShoppingBag, Users, Package, Settings, 
  LogOut, Menu, X, PlusCircle, Search, Edit2, Trash2, 
  TrendingUp, CreditCard, CheckCircle, Clock, AlertTriangle, 
  ChevronDown, Save, XCircle, Tag, Megaphone, ShieldAlert, Eye, Zap
} from "lucide-react";
import { toast } from "sonner";


const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [requestSearch, setRequestSearch] = useState("");
  
  const { products: inventory, addProduct, updateProduct, deleteProduct } = useProducts();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [newProduct, setNewProduct] = useState({ name: "", category: "Perfumes", stock: "", price: "", image: "" });
  const [filterCategory, setFilterCategory] = useState("All");

  const [globalCategories, setGlobalCategories] = useState<string[]>(() => {
    const stored = localStorage.getItem("kaleemiya_categories");
    return stored ? JSON.parse(stored) : ["Perfumes", "Attar", "Oud", "Bakhoor", "Gift Sets"];
  });

  useEffect(() => {
    localStorage.setItem("kaleemiya_categories", JSON.stringify(globalCategories));
  }, [globalCategories]);

  const allCategories = Array.from(new Set([
    ...globalCategories,
    ...inventory.map(p => p.category ? p.category.charAt(0).toUpperCase() + p.category.slice(1) : "")
  ])).filter(Boolean);

  const handleAddCategory = () => {
    const customCat = window.prompt("Enter new category name:");
    if (customCat && customCat.trim()) {
      const formattedCat = customCat.trim().charAt(0).toUpperCase() + customCat.trim().slice(1);
      if (!allCategories.includes(formattedCat)) {
         setGlobalCategories(prev => [...prev, formattedCat]);
         toast.success("Category added!");
      } else {
         toast.error("Category already exists!");
      }
    }
  };

  // Admin Requests Persistent Logic
  const [adminRequests, setAdminRequests] = useState<any[]>(() => {
    const stored = localStorage.getItem("kaleemiya_admin_requests");
    return stored ? JSON.parse(stored) : [
      { name: "Omar Farooq", email: "omar.farooq@kaleemiya.com", date: "6 March 2026", initial: "O", role: "Store Managerial Access" },
      { name: "Ayesha Ahmed", email: "ayesha.a@kaleemiya.com", date: "7 March 2026", initial: "A", role: "Inventory Staff" },
      { name: "Zaid Shaikh", email: "zaid.s@gmail.com", date: "8 March 2026", initial: "Z", role: "Vendor Access" }
    ];
  });

  const [approvalLogs, setApprovalLogs] = useState<any[]>(() => {
    const stored = localStorage.getItem("kaleemiya_approval_logs");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("kaleemiya_admin_requests", JSON.stringify(adminRequests));
  }, [adminRequests]);

  useEffect(() => {
    localStorage.setItem("kaleemiya_approval_logs", JSON.stringify(approvalLogs));
  }, [approvalLogs]);

  useEffect(() => {
    const syncRequests = () => {
      const stored = localStorage.getItem("kaleemiya_admin_requests");
      if (stored) setAdminRequests(JSON.parse(stored));
    };
    window.addEventListener("admin_requests_updated", syncRequests);
    return () => window.removeEventListener("admin_requests_updated", syncRequests);
  }, []);

  const filteredRequests = adminRequests.filter(req => 
    req.name.toLowerCase().includes(requestSearch.toLowerCase()) || 
    req.email.toLowerCase().includes(requestSearch.toLowerCase())
  );

  const handleApproveReq = (name: string) => {
    setAdminRequests(prev => prev.filter(req => req.name !== name));
    setApprovalLogs(prev => [{ name, action: "Approved Access", date: new Date().toLocaleTimeString() }, ...prev]);
    toast.success(`Access granted for ${name}!`);
  };

  const handleDenyReq = (name: string) => {
    setAdminRequests(prev => prev.filter(req => req.name !== name));
    setApprovalLogs(prev => [{ name, action: "Denied Access", date: new Date().toLocaleTimeString() }, ...prev]);
    toast.info(`Request for ${name} has been denied.`);
  };

  // Import Cloudinary upload logic
  const [isUploading, setIsUploading] = useState(false);

  // Filter Logic
  const filteredProducts = filterCategory === "All" 
    ? inventory 
    : inventory.filter(p => p.category.toLowerCase() === filterCategory.toLowerCase());

  // Handle Image Upload using Cloudinary (Async)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // 1. Validate file size (optional)
      if (file.size > 10 * 1024 * 1024) throw new Error("File too large (max 10MB)");

      // 2. Perform upload to cloud
      // Needs keys in .env
      const { uploadToCloudinary } = await import("@/utils/cloudinary");
      const cloudUrl = await uploadToCloudinary(file);
      
      // 3. Update state
      if (editingProduct) {
        setEditingProduct({ ...editingProduct, image: cloudUrl });
      } else {
        setNewProduct({ ...newProduct, image: cloudUrl });
      }

      toast.success("Media uploaded successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to upload to cloud.");
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

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
      image: newProduct.image || "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=600&auto=format&fit=crop", // placeholder
      stock: stockNum,
      status: stockNum > 10 ? "In Stock" : stockNum > 0 ? "Low Stock" : "Out of Stock"
    });
    
    setIsAddModalOpen(false);
    setNewProduct({ name: "", category: "Perfumes", stock: "", price: "", image: "" });
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
      <aside className={`${isSidebarOpen ? "w-64" : "w-20"} bg-[#310101] text-white transition-all duration-300 flex flex-col shrink-0 shadow-2xl relative z-20`}>
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          {isSidebarOpen && <span className="font-serif text-xl tracking-[0.2em] uppercase italic text-[#E5D5C5]">Kaleemiya</span>}
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-1.5 hover:bg-white/10 rounded-lg"><Menu className="w-5 h-5 text-[#E5D5C5]" /></button>
        </div>
        <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto">
          {["Dashboard", "Products", "Orders", "Customers", "Categories", "Ads Manager", "Admin Requests", "Settings"].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all ${activeTab === tab ? "bg-[#F9F6F2] text-[#310101] shadow-lg" : "hover:bg-white/5 text-white/60"}`}>
              {tab === "Dashboard" && <LayoutDashboard className="w-5 h-5" />}
              {tab === "Products" && <Package className="w-5 h-5" />}
              {tab === "Orders" && <ShoppingBag className="w-5 h-5" />}
              {tab === "Customers" && <Users className="w-5 h-5" />}
              {tab === "Categories" && <Tag className="w-5 h-5" />}
              {tab === "Ads Manager" && <Megaphone className="w-5 h-5" />}
              {tab === "Admin Requests" && <Zap className="w-5 h-5" />}
              {tab === "Settings" && <Settings className="w-5 h-5" />}
              {isSidebarOpen && <span className="text-[13px] font-bold uppercase tracking-widest text-left">{tab}</span>}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10 mt-auto">
          <button onClick={() => window.location.href = "/"} className="w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all hover:bg-white/10 text-white group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <Eye className="w-5 h-5 text-[#E5D5C5]" />
            {isSidebarOpen && <span className="text-[13px] font-bold uppercase tracking-widest">Main Portal</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
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
              <div className="flex flex-wrap justify-between items-center gap-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-50">
                <div className="flex items-center gap-4 bg-gray-50 px-6 py-2 rounded-full">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Filter:</span>
                  <select 
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="bg-transparent text-[11px] font-bold text-[#310101] uppercase tracking-wider outline-none cursor-pointer"
                  >
                    <option value="All">All Categories</option>
                    {allCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
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
                          <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden shrink-0 group-hover:scale-105 transition-transform shadow-sm border border-gray-100">
                            <img src={(p as any).image} alt={p.name} className="w-full h-full object-cover" />
                          </div>
                          <span className="font-bold text-[#310101]">{p.name}</span>
                        </td>
                        <td className="px-8 py-5 font-medium text-gray-500">{p.category}</td>
                        <td className="px-8 py-5 text-gray-600">{(p as any).stock || 0} pcs</td>
                        <td className="px-8 py-5 font-bold text-[#310101]">{p.price}</td>
                        <td className="px-8 py-5">
                          <span className={`px-4 py-1 rounded-full text-[9px] font-bold uppercase ${
                            ((p as any).status || "In Stock") === "In Stock" ? "bg-green-100 text-green-700" :
                            ((p as any).status || "In Stock") === "Low Stock" ? "bg-orange-100 text-orange-700" : "bg-red-100 text-red-700"
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

          {activeTab === "Categories" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-50">
                <h2 className="text-xl font-serif text-[#310101] italic">Categories Directory</h2>
                <button onClick={handleAddCategory} className="bg-[#310101] text-[#E5D5C5] px-6 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest hover:scale-105 transition-transform flex items-center gap-2">
                  <PlusCircle className="w-4 h-4" /> Add Category
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                 {allCategories.map((cat, idx) => {
                   const count = inventory.filter(p => (p.category || "").toLowerCase() === cat.toLowerCase()).length;
                   return (
                     <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-50 shadow-sm hover:shadow-md transition-shadow group flex flex-col items-center text-center space-y-4 relative overflow-hidden">
                       <div className="w-16 h-16 rounded-full bg-[#F9F6F2] flex items-center justify-center text-[#310101] group-hover:scale-110 transition-transform">
                         <Tag className="w-6 h-6" />
                       </div>
                       <div>
                         <h3 className="text-lg font-serif font-bold text-[#310101]">{cat}</h3>
                         <p className="text-xs text-gray-500 font-medium mt-1">{count} Products</p>
                       </div>
                     </div>
                   );
                 })}
              </div>
            </div>
          )}

          {activeTab === "Admin Requests" && (
            <div className="space-y-12 max-w-6xl mx-auto pb-24">
              <div className="flex flex-col gap-10 px-4">
                <div className="flex items-center gap-10">
                   <img src="/logo.png" alt="Kaleemiya Logo" className="h-24 w-auto brightness-0" />
                   <div className="space-y-3">
                      <div className="inline-flex items-center gap-3 bg-[#F9F6F2] px-6 py-2 rounded-full border border-[#E5D5C5]/50">
                         <Zap className="w-4 h-4 text-[#310101]" />
                         <span className="text-[12px] font-black uppercase tracking-[0.2em] text-[#310101]">Security Priority</span>
                      </div>
                      <h2 className="text-7xl font-serif font-black text-black tracking-tighter italic lowercase first-letter:uppercase">Portal Permissions</h2>
                   </div>
                </div>
                
                <p className="text-lg font-bold text-gray-500 uppercase tracking-[0.1em] max-w-3xl ml-1 leading-relaxed opacity-80">
                   Review and verify administrative access for the Kaleemiya storefront. 
                   <span className="block text-gray-400 text-[12px] mt-2 italic tracking-[0.3em] lowercase">Guarding the essence of pure elegance.</span>
                </p>

                <div className="flex flex-wrap gap-10 items-center">
                   {/* Queue Box */}
                   <div className="bg-white px-16 py-12 rounded-[50px] shadow-sm border border-gray-100 flex flex-col items-center justify-center min-w-[300px] h-[240px] hover:shadow-xl transition-all group">
                      <div className="w-14 h-14 rounded-2xl bg-[#F9F6F2] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                         <Users className="w-7 h-7 text-black" />
                      </div>
                      <span className="text-[12px] font-black text-gray-400 uppercase tracking-[0.3em] mb-3 font-bold">Queue Total</span>
                      <span className="text-7xl font-serif font-black text-black leading-none">{adminRequests.length}</span>
                   </div>

                   {/* System Health Box */}
                   <div className="bg-[#310101] px-16 py-12 rounded-[50px] shadow-2xl flex flex-col items-center justify-center border border-[#310101] min-w-[300px] h-[240px] hover:scale-105 transition-all group relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                      <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform">
                         <ShieldAlert className="w-7 h-7 text-white" />
                      </div>
                      <span className="text-[12px] font-black text-[#E5D5C5]/60 uppercase tracking-[0.3em] mb-4 text-center font-bold">Guard Status</span>
                      <div className="flex items-center gap-6">
                        <div className="relative">
                           <div className="w-8 h-8 rounded-full bg-green-400 animate-ping opacity-20 absolute -inset-2"></div>
                           <div className="w-5 h-5 rounded-full bg-green-400 shadow-[0_0_25px_rgba(74,222,128,0.6)] border-2 border-[#310101]"></div>
                        </div>
                        <span className="text-2xl font-black text-white uppercase tracking-[0.2em] italic">Guarded</span>
                      </div>
                   </div>

                   {/* Search Bar - Third Card in Sequence */}
                   <div className="bg-white px-10 py-12 rounded-[50px] shadow-sm border border-gray-100 flex flex-col items-center justify-center min-w-[340px] h-[240px] hover:shadow-xl transition-all group">
                      <div className="w-14 h-14 rounded-2xl bg-[#F9F6F2] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                         <Search className="w-7 h-7 text-black" />
                      </div>
                      <span className="text-[12px] font-black text-gray-400 uppercase tracking-[0.3em] mb-3 font-bold">Quick Filter</span>
                      <div className="w-full relative px-2">
                        <input 
                           type="text" 
                           placeholder="FIND CREDENTIALS..." 
                           value={requestSearch}
                           onChange={(e) => setRequestSearch(e.target.value)}
                           className="w-full bg-transparent border-b-2 border-gray-100 py-3 text-[14px] font-serif font-bold text-black outline-none focus:border-black transition-colors text-center uppercase tracking-widest placeholder:text-gray-300"
                        />
                      </div>
                   </div>
                </div>
              </div>

              <div className="bg-white rounded-[60px] shadow-sm border border-gray-100 overflow-hidden mt-10">
                <div className="px-12 py-12 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
                   <h4 className="text-[14px] font-black text-black uppercase tracking-[0.4em]">Pending Authority Requests ({filteredRequests.length})</h4>
                </div>

                <div className="divide-y divide-gray-100">
                   {filteredRequests.map((item, idx) => (
                     <div key={idx} className="p-12 flex flex-col lg:flex-row items-center justify-between gap-12 hover:bg-gray-50/50 transition-colors">
                        <div className="flex items-center gap-10">
                           <div className="w-28 h-28 rounded-[40px] bg-black text-[#E5D5C5] flex items-center justify-center font-serif text-5xl font-bold shadow-2xl relative">
                              {item.initial}
                              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-full border-8 border-white"></div>
                           </div>
                           <div className="space-y-4">
                              <h5 className="text-4xl font-serif font-bold text-black tracking-tighter italic">{item.name}</h5>
                              <div className="flex items-center gap-10">
                                 <span className="text-[13px] font-black text-gray-600 uppercase tracking-widest font-bold">{item.email}</span>
                                 <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                                 <span className="text-[13px] font-black text-[#310101] uppercase tracking-widest bg-[#F9F6F2] px-6 py-2 rounded-xl border border-[#E5D5C5]/40">{item.role}</span>
                              </div>
                           </div>
                        </div>

                        <div className="flex items-center gap-8">
                           <button onClick={() => handleApproveReq(item.name)} className="bg-black text-white px-14 py-7 rounded-[30px] text-[13px] font-black uppercase tracking-widest hover:scale-105 transition-all">
                              Approve Permission
                           </button>
                           <button onClick={() => handleDenyReq(item.name)} className="bg-white text-gray-600 border border-gray-200 px-14 py-7 rounded-[30px] text-[13px] font-black uppercase tracking-widest hover:bg-red-50 hover:text-red-600 transition-all">
                              Deny
                           </button>
                        </div>
                     </div>
                   ))}
                </div>
              </div>

              <div className="mx-4 p-12 rounded-[55px] bg-[#F9F6F2] border border-[#E5D5C5]/50 flex flex-col md:flex-row items-center justify-between gap-10 group transition-all">
                 <div className="flex items-center gap-10">
                    <div className="w-20 h-20 rounded-[28px] bg-white flex items-center justify-center text-black shadow-md border border-gray-100">
                       <ShieldAlert className="w-10 h-10" />
                    </div>
                    <div>
                       <h6 className="text-[16px] font-black text-black uppercase tracking-[0.3em] mb-3 font-black">Administrative Security Protocol</h6>
                       <p className="text-[12px] font-bold text-gray-500 uppercase tracking-widest">Access delegation authorizes full visibility over secure sales data.</p>
                    </div>
                 </div>
              </div>

              {approvalLogs.length > 0 && (
                <div className="mx-4 space-y-10">
                   <div className="flex items-center gap-6">
                      <div className="h-[1px] flex-1 bg-gray-100"></div>
                      <h5 className="text-[12px] font-black text-gray-300 uppercase tracking-[0.5em]">Global Audit Activity Log</h5>
                      <div className="h-[1px] flex-1 bg-gray-100"></div>
                   </div>
                   <div className="bg-white rounded-[50px] shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
                      {approvalLogs.map((log, i) => (
                        <div key={i} className="px-12 py-8 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                           <div className="flex items-center gap-8">
                              <div className={`w-3 h-3 rounded-full ${log.action.includes('Approved') ? 'bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.4)]' : 'bg-red-400'}`}></div>
                              <span className="text-lg font-serif font-bold text-black italic">{log.name}</span>
                           </div>
                           <div className="flex items-center gap-12">
                              <span className={`text-[10px] font-black uppercase tracking-widest px-5 py-2 rounded-xl ${
                                log.action.includes('Approved') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
                              }`}>
                                {log.action}
                              </span>
                              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest font-mono">{log.date}</span>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "Settings" && (
            <div className="space-y-12 max-w-5xl mx-auto pb-24">
              <div className="px-4">
                 <h2 className="text-6xl font-serif font-black text-black tracking-tighter italic">Global Settings</h2>
                 <p className="text-sm font-bold text-gray-500 uppercase tracking-[0.2em] mt-2">Adjust your storefront's core configuration.</p>
              </div>
              <div className="grid grid-cols-1 gap-10">
                <div className="bg-white p-12 rounded-[50px] shadow-sm border border-gray-100 space-y-10">
                   <div className="flex items-center gap-6 border-b border-gray-100 pb-8">
                      <div className="w-14 h-14 rounded-2xl bg-[#F9F6F2] flex items-center justify-center text-[#310101]">
                         <Package className="w-7 h-7" />
                      </div>
                      <h4 className="text-2xl font-serif font-bold text-black italic">Store Boutique Profile</h4>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-3">
                         <label className="text-[12px] font-black text-gray-400 uppercase tracking-widest ml-2">Boutique Name</label>
                         <input type="text" defaultValue="Kaleemiya Perfumes" className="w-full bg-gray-50/50 border border-gray-100 rounded-[24px] px-8 py-5 text-lg font-serif font-bold text-black outline-none" />
                      </div>
                      <div className="space-y-3">
                         <label className="text-[12px] font-black text-gray-400 uppercase tracking-widest ml-2">Store Currency</label>
                         <select className="w-full bg-gray-50/50 border border-gray-100 rounded-[24px] px-8 py-5 text-lg font-serif font-bold text-black outline-none shadow-sm cursor-pointer">
                            <option>INR (₹)</option>
                            <option>USD ($)</option>
                         </select>
                      </div>
                   </div>
                </div>
                <div className="flex justify-end gap-6 px-4">
                   <button className="bg-white text-gray-400 px-12 py-6 rounded-[28px] border border-gray-100 font-black uppercase tracking-widest">Discard</button>
                   <button className="bg-black text-white px-16 py-6 rounded-[28px] font-black uppercase tracking-widest shadow-2xl">Save Config</button>
                </div>
              </div>
            </div>
          )}
        </div>

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
                <h2 className="text-3xl font-serif text-[#310101] mb-8">
                  {editingProduct ? "Update Product" : "Add New Experience"}
                </h2>
                <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Product Name</label>
                       <input 
                        required
                        value={editingProduct ? editingProduct.name : newProduct.name}
                        onChange={(e) => editingProduct ? setEditingProduct({...editingProduct, name: e.target.value}) : setNewProduct({...newProduct, name: e.target.value})}
                        className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-medium text-[#310101] outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Category</label>
                       <select 
                        value={editingProduct ? editingProduct.category : newProduct.category}
                        onChange={(e) => {
                           if (e.target.value === "__NEW__") {
                             const customCat = window.prompt("Enter new category name:");
                             if (customCat && customCat.trim()) {
                               const formattedCat = customCat.trim().charAt(0).toUpperCase() + customCat.trim().slice(1);
                               if (!allCategories.includes(formattedCat)) setGlobalCategories(prev => [...prev, formattedCat]);
                               if (editingProduct) setEditingProduct({...editingProduct, category: formattedCat});
                               else setNewProduct({...newProduct, category: formattedCat});
                             }
                           } else {
                             if (editingProduct) setEditingProduct({...editingProduct, category: e.target.value});
                             else setNewProduct({...newProduct, category: e.target.value});
                           }
                        }}
                        className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-medium text-[#310101] outline-none cursor-pointer"
                      >
                        {allCategories.map(cat => (
                           <option key={cat} value={cat}>{cat}</option>
                        ))}
                        <option value="__NEW__">Create New Category...</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Stock Level</label>
                       <input 
                        type="number" required
                        value={editingProduct ? editingProduct.stock : newProduct.stock}
                        onChange={(e) => {
                           const val = e.target.value;
                           if(editingProduct) setEditingProduct({...editingProduct, stock: val});
                           else setNewProduct({...newProduct, stock: val});
                        }}
                        className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-medium text-[#310101] outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Price (₹)</label>
                       <input 
                        type="number" required
                        value={editingProduct ? (editingProduct.numericPrice || editingProduct.price?.replace(/[^0-9]/g, "")) : newProduct.price}
                        onChange={(e) => editingProduct ? setEditingProduct({...editingProduct, price: e.target.value}) : setNewProduct({...newProduct, price: e.target.value})}
                        className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-medium text-[#310101] outline-none transition-all focus:ring-2 focus:ring-[#310101]/5"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                       <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Product Media (Image/Video)</label>
                       <div className="flex items-center gap-4 bg-gray-50/50 border border-gray-100 rounded-2xl p-2 pl-4">
                          {isUploading ? (
                             <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#310101]"></div>
                             </div>
                          ) : (editingProduct?.image || newProduct.image) && (
                            <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-white border border-gray-200 shadow-sm">
                              { (editingProduct?.image || newProduct.image)?.includes("video") || (editingProduct?.image || newProduct.image)?.endsWith(".mp4") ? (
                                <video src={editingProduct ? editingProduct.image : newProduct.image} className="w-full h-full object-cover" />
                              ) : (
                                <img src={editingProduct ? editingProduct.image : newProduct.image} alt="Preview" className="w-full h-full object-cover" />
                              )}
                            </div>
                          )}
                          <div className="flex-1 flex flex-col">
                             <input 
                              type="file"
                              accept="image/*,video/*"
                              onChange={handleImageUpload}
                              className="w-full text-sm font-medium text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border file:border-gray-200 file:text-xs file:font-semibold file:uppercase file:tracking-wider file:bg-white file:text-[#310101] hover:file:bg-gray-50 file:shadow-sm file:cursor-pointer cursor-pointer file:transition-all outline-none"
                            />
                            {isUploading && <span className="text-[10px] font-bold text-[#310101] animate-pulse ml-2 mt-1 uppercase tracking-widest">Uploading to Cloud...</span>}
                          </div>
                       </div>
                    </div>
                  </div>
                  <button 
                    disabled={isUploading}
                    className={`w-full py-4 rounded-xl text-xs font-bold uppercase tracking-[0.2em] shadow-xl mt-8 transition-all ${isUploading ? 'bg-gray-300 cursor-not-allowed opacity-50' : 'bg-[#310101] text-white hover:shadow-black/20'}`}
                  >
                    {isUploading ? "PROCESSOR BUSY..." : editingProduct ? "SAVE CHANGES TO CLOUD" : "PUBLISH TO CLOUD STORE"}
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

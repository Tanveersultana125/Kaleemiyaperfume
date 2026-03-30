import { useState, useEffect } from "react";
import { useProducts } from "@/hooks/useProducts";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  doc, 
  updateDoc, 
  writeBatch,
  setDoc
} from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, ShoppingBag, Users, Package, Settings, 
  Menu, X, PlusCircle, Edit2, Trash2, 
  TrendingUp, CreditCard, CheckCircle, Clock,
  ChevronDown, Tag, ShieldAlert, Eye, Zap, LogOut
} from "lucide-react";
import { toast } from "sonner";

const AdminDashboard = () => {
  const { user, role, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [requestSearch, setRequestSearch] = useState("");
  
  const { products: inventory, addProduct, updateProduct, deleteProduct } = useProducts();

  const PAGE_SECTIONS = ["Main Store", "New Arrivals", "Featured", "Top Sellers", "Clearance"];

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [newProduct, setNewProduct] = useState({ 
    name: "", section: "Main Store", category: "Perfumes", subCategory: "Unisex", 
    stock: "", price: "", image: "", isLive: true 
  });
  const [filterCategory, setFilterCategory] = useState("All");
  const [isUploading, setIsUploading] = useState(false);

  // Firestore Category Config
  const [globalCategories, setGlobalCategories] = useState<string[]>([]);
  const [subCategoriesConfig, setSubCategoriesConfig] = useState<Record<string, string[]>>({});

  // Firestore Real-time States
  const [adminRequests, setAdminRequests] = useState<any[]>([]);
  const [approvalLogs, setApprovalLogs] = useState<any[]>([]);

  // Real-time listener for database categories
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "metadata", "categories"), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setGlobalCategories(data.list || []);
        setSubCategoriesConfig(data.subs || {});
      } else {
        // Full pre-seed for your boutique database
        const defaults = ["Perfumes", "Attar", "Oud", "Bakhoor", "Gift Sets", "Tasbhi", "Prayer mats", "Books"];
        const defaultSubs: Record<string, string[]> = {
          "Perfumes": ["Men", "Women", "Unisex", "French", "Arabic", "Concentrated"],
          "Attar": ["Spray Bottle", "Bakhur", "Agarsetti", "Premium Oil", "Roll-on", "Musk"],
          "Oud": ["Cambodi", "Assami", "Indian", "Malaysian"],
          "Bakhoor": ["Spray Bottle", "Tablets", "Loose Wood", "Incense Sticks"],
          "Gift Sets": ["Luxury Boxes", "Sample Sets", "Couple Gifts"],
          "Tasbhi": ["Crystal", "Wooden", "Digital", "Stone"],
          "Prayer mats": ["Velvet", "Travel", "Foam", "Handmade"],
          "Books": ["Quran", "Tasfeer", "Hadith", "Kids", "History"],
        };
        setDoc(doc(db, "metadata", "categories"), { list: defaults, subs: defaultSubs });
      }
    });
    return () => unsub();
  }, []);

  // Real-time listener for admin requests (only for super_admin)
  useEffect(() => {
    if (role === "super_admin") {
      const q = query(
        collection(db, "adminRequests"), 
        where("status", "==", "pending")
      );
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setAdminRequests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }, (error) => {
        console.error("Admin Requests Listener Error:", error);
        toast.error("Dashboard Sync Error: " + error.message);
      });

      const logQ = query(
        collection(db, "adminRequests"), 
        where("status", "!=", "pending")
      );
      
      const unsubscribeLogs = onSnapshot(logQ, (snapshot) => {
        setApprovalLogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }, (error) => {
        console.error("Approval Logs Listener Error:", error);
      });

      return () => {
        unsubscribe();
        unsubscribeLogs();
      };
    }
  }, [role]);

  const allSections = Array.from(new Set([
    ...PAGE_SECTIONS,
    ...inventory.map((p: any) => p.section).filter(Boolean)
  ]));

  const allCategories = Array.from(new Set([
    ...globalCategories,
    ...inventory.map(p => p.category ? p.category.charAt(0).toUpperCase() + p.category.slice(1) : "")
  ])).filter(Boolean);

  const dynamicSubCategories: Record<string, string[]> = {};
  allCategories.forEach(cat => {
    const savedSubs = subCategoriesConfig[cat] || [];
    const fromInventory = inventory
      .filter(p => p.category?.toLowerCase() === cat.toLowerCase())
      .map(p => p.subCategory)
      .filter(Boolean);
    
    const uniqueSubs = Array.from(new Set([...savedSubs, ...fromInventory]));
    dynamicSubCategories[cat] = uniqueSubs.map(s => s.charAt(0).toUpperCase() + s.slice(1));
    if (dynamicSubCategories[cat].length === 0) dynamicSubCategories[cat] = ["General"];
  });

  const handleAddCategory = async () => {
    const customCat = window.prompt("Enter new category name:");
    if (customCat && customCat.trim()) {
      const formatted = customCat.trim().charAt(0).toUpperCase() + customCat.trim().slice(1);
      if (!globalCategories.includes(formatted)) {
        await setDoc(doc(db, "metadata", "categories"), {
          list: [...globalCategories, formatted],
          subs: subCategoriesConfig
        }, { merge: true });
        toast.success("Category saved to database!");
      }
    }
  };

  const [storeSettings, setStoreSettings] = useState(() => {
    const stored = localStorage.getItem("kaleemiya_store_settings");
    return stored ? JSON.parse(stored) : {
      name: "Kaleemiya Perfumes",
      email: "contact@kaleemiya.com",
      currency: "INR (₹)",
      maintenanceMode: false,
      accentColor: "#B0843D",
      publicLivePage: true,
      protectedMode: true
    };
  });

  useEffect(() => {
    localStorage.setItem("kaleemiya_store_settings", JSON.stringify(storeSettings));
    window.dispatchEvent(new CustomEvent("kaleemiya_settings_updated"));
  }, [storeSettings]);

  const filteredRequests = adminRequests.filter(req =>
    req.name?.toLowerCase().includes(requestSearch.toLowerCase()) ||
    req.email?.toLowerCase().includes(requestSearch.toLowerCase())
  );

  const handleApproveReq = async (requestId: string, userId: string, name: string) => {
    if (role !== "super_admin") return;
    try {
      const batch = writeBatch(db);
      
      // Update request status
      const requestRef = doc(db, "adminRequests", requestId);
      batch.update(requestRef, { status: "approved" });
      
      // Update user role
      const userRef = doc(db, "users", userId);
      batch.update(userRef, { role: "admin" });
      
      await batch.commit();
      toast.success(`Access granted for ${name}`);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDenyReq = async (requestId: string, name: string) => {
    if (role !== "super_admin") return;
    try {
      const requestRef = doc(db, "adminRequests", requestId);
      await updateDoc(requestRef, { status: "rejected" });
      toast.info(`Request for ${name} rejected`);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Signed out successfully");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // ═══════════════════ COMPONENTS ═══════════════════
  const StatCard = ({ title, value, icon: Icon, trend }: any) => (
    <div className="bg-white p-8 rounded-[35px] shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-500 group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#B0843D] opacity-0 group-hover:opacity-[0.03] rounded-full -mr-16 -mt-16 transition-all duration-700"></div>
      <div className="flex justify-between items-start mb-6">
        <div className="p-4 bg-[#F9F6F2] rounded-2xl group-hover:bg-[#310101] group-hover:text-white transition-colors duration-500 border border-[#E5D5C5]/30">
          <Icon className="w-7 h-7" />
        </div>
        {trend && (
          <div className="flex items-center gap-1.5 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
            <TrendingUp className="w-3 h-3 text-green-600" />
            <span className="text-[11px] font-black text-green-700 uppercase tracking-widest">{trend}</span>
          </div>
        )}
      </div>
      <div>
        <p className="text-[12px] font-black text-black/30 uppercase tracking-[0.3em] mb-1">{title}</p>
        <p className="text-4xl font-serif font-black text-[#310101] tracking-tighter italic">{value}</p>
      </div>
    </div>
  );

  const sidebarTabs = [
    { title: "Dashboard", icon: LayoutDashboard },
    { title: "Products", icon: Package },
    { title: "Orders", icon: ShoppingBag },
    { title: "Customers", icon: Users },
    { title: "Categories", icon: Tag },
    ...(role === "super_admin" ? [{ title: "Admin Requests", icon: Zap }] : []),
    { title: "Settings", icon: Settings },
  ];

  const filteredProducts = filterCategory === "All"
    ? inventory
    : inventory.filter(p => p.category.toLowerCase() === filterCategory.toLowerCase());

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      if (file.size > 10 * 1024 * 1024) throw new Error("File too large (max 10MB)");
      const { uploadToCloudinary } = await import("@/utils/cloudinary");
      const cloudUrl = await uploadToCloudinary(file);
      if (editingProduct) {
        setEditingProduct((prev: any) => ({ ...prev, image: cloudUrl }));
      } else {
        setNewProduct((prev: any) => ({ ...prev, image: cloudUrl }));
      }
      toast.success("Media uploaded successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to upload to cloud.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) {
      toast.error("Name and price are required");
      return;
    }
    if (!newProduct.image) {
      toast.error("Please upload a product image first!");
      return;
    }

    const stockNum = parseInt(newProduct.stock) || 0;
    addProduct({
      name: newProduct.name,
      section: newProduct.section,
      category: newProduct.category as any,
      subCategory: newProduct.subCategory as any,
      price: `₹${parseInt(newProduct.price).toLocaleString()}`,
      numericPrice: parseInt(newProduct.price),
      gender: "unisex",
      image: newProduct.image,
      stock: stockNum,
      status: stockNum > 10 ? "In Stock" : stockNum > 0 ? "Low Stock" : "Out of Stock",
      isLive: newProduct.isLive
    } as any);
    setIsAddModalOpen(false);
    setNewProduct({ 
      name: "", section: "Main Store", category: "Perfumes", subCategory: "Unisex", 
      stock: "", price: "", image: "", isLive: true 
    });
    toast.success("Product added successfully!");
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm("Are you sure you want to remove this product?")) {
      deleteProduct(id);
      toast.error("Product removed.");
    }
  };

  const handleUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const stockNum = parseInt(editingProduct.stock) || 0;
    updateProduct({
      ...editingProduct,
      section: editingProduct.section,
      category: editingProduct.category as any,
      subCategory: editingProduct.subCategory as any,
      price: `₹${parseInt(editingProduct.price).toLocaleString()}`,
      numericPrice: parseInt(editingProduct.price),
      stock: stockNum,
      status: stockNum > 10 ? "In Stock" : stockNum > 0 ? "Low Stock" : "Out of Stock",
      isLive: editingProduct.isLive ?? true
    });
    setEditingProduct(null);
    toast.success("Product updated!");
  };

  const ORDERS = [
    { id: "ORD-7241", customer: "Zaid Shaikh", item: "Oud Al Malikah", qty: "2 Items", mix: "Bulk: 2x Same", payment: "Paid", amount: "₹5,999", status: "In Transit", location: "Mumbai Central Hub — Sorting Center" },
    { id: "ORD-7240", customer: "Ayesha Ahmed", item: "Majestic Rose", qty: "1 Item", mix: "Single Item", payment: "Paid", amount: "₹3,450", status: "Delivered", location: "Dubai Logistics Park — Out for Delivery" },
    { id: "ORD-7239", customer: "Omar Farooq", item: "Royal Bakhoor", qty: "3 Items", mix: "Mix: 3 Different", payment: "Pending", amount: "₹2,800", status: "Pending", location: "Warehouse — Awaiting Courier" },
    { id: "ORD-7238", customer: "Fatima Bi", item: "Sultan Blend", qty: "5 Items", mix: "Bulk: 5x Same", payment: "Paid", amount: "₹8,900", status: "Pending", location: "Warehouse — Awaiting Courier" }
  ];

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex font-sans">
      {/* ── Sidebar ── */}
      <aside className={`${isSidebarOpen ? "w-64" : "w-20"} bg-[#310101] text-white transition-all duration-300 flex flex-col shrink-0 shadow-2xl relative z-20`}>
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          {isSidebarOpen && <span className="font-serif text-xl tracking-[0.2em] uppercase italic text-[#E5D5C5]">Kaleemiya</span>}
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-1.5 hover:bg-white/10 rounded-lg">
            <Menu className="w-5 h-5 text-[#E5D5C5]" />
          </button>
        </div>
        <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto">
          {["Dashboard", "Products", "Orders", "Customers", "Categories", "Admin Requests", "Settings"].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all ${activeTab === tab ? "bg-[#F9F6F2] text-[#310101] shadow-lg" : "hover:bg-white/5 text-white/60"}`}>
              {tab === "Dashboard" && <LayoutDashboard className="w-5 h-5 shrink-0" />}
              {tab === "Products" && <Package className="w-5 h-5 shrink-0" />}
              {tab === "Orders" && <ShoppingBag className="w-5 h-5 shrink-0" />}
              {tab === "Customers" && <Users className="w-5 h-5 shrink-0" />}
              {tab === "Categories" && <Tag className="w-5 h-5 shrink-0" />}
              {tab === "Admin Requests" && <Zap className="w-5 h-5 shrink-0" />}
              {tab === "Settings" && <Settings className="w-5 h-5 shrink-0" />}
              {isSidebarOpen && <span className="text-[13px] font-black uppercase tracking-[0.15em] text-left truncate">{tab}</span>}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10 mt-auto">
          <button onClick={() => window.location.href = "/"} className="w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all hover:bg-white/10 text-white">
            <Eye className="w-5 h-5 text-[#E5D5C5] shrink-0" />
            {isSidebarOpen && <span className="text-[13px] font-bold uppercase tracking-widest">Main Portal</span>}
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b h-16 flex items-center justify-between px-8 shrink-0 shadow-sm z-10">
          <h1 className="text-xl font-serif text-[#310101] italic font-bold">{activeTab}</h1>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 border-l pl-6 border-gray-100">
              <div className="text-right hidden sm:block">
                <p className="text-[13px] font-black text-[#310101] uppercase tracking-widest leading-none mb-0.5">Kaleemiya</p>
                <p className="text-[10px] text-black font-bold">Administrator</p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-[#310101] flex items-center justify-center text-[#F9F6F2] font-serif italic text-lg shadow-xl">K</div>
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-[#FDFCFB]">

          {/* ═══════════════════ DASHBOARD ═══════════════════ */}
          {activeTab === "Dashboard" && (
            <div className="space-y-10 max-w-7xl mx-auto pb-20">

              {/* Premium Welcome Hero */}
              <div className="pt-4 px-2">
                <div className="bg-white rounded-[70px] p-16 shadow-sm border border-gray-100 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gray-50 rounded-full -mr-40 -mt-40 blur-[130px] opacity-40 pointer-events-none"></div>
                  <div className="relative z-10 space-y-10">
                    <div className="flex items-center gap-4">
                      <div className="bg-[#310101] px-6 py-2 rounded-full flex items-center gap-3">
                        <span className="text-[12px] font-black text-[#E5D5C5] uppercase tracking-[0.2em]">Live Store Status</span>
                        <div className="w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-white animate-pulse"></div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h2 className="text-8xl md:text-9xl font-serif font-black text-[#310101] tracking-tighter leading-[0.9] flex flex-wrap gap-x-6 items-baseline">
                        Welcome,
                        <span className="text-[#B0843D] italic font-light lowercase">Tanveer!</span>
                      </h2>
                      <p className="text-xl font-light text-[#310101]/60 max-w-3xl leading-relaxed mt-6">
                        Curating the essence of elegance at <span className="font-bold text-[#310101] border-b-4 border-[#B0843D] pb-1 uppercase tracking-widest">Kaleemiya</span>. Your dashboard is primed with real-time boutique data.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-6 pt-4">
                      <button onClick={() => setIsAddModalOpen(true)} className="bg-[#310101] text-white px-12 py-7 rounded-[30px] shadow-2xl hover:bg-[#1a0101] hover:scale-105 transition-all flex items-center gap-4 group/btn">
                        <PlusCircle className="w-6 h-6 text-[#E5D5C5] group-hover/btn:rotate-90 transition-transform" />
                        <span className="text-[14px] font-black uppercase tracking-[0.2em]">Publish New Item</span>
                      </button>
                      <button onClick={() => window.location.href = "/"} className="bg-[#B0843D] text-white px-12 py-7 rounded-[30px] font-black uppercase tracking-[0.2em] hover:bg-[#c2964d] transition-all shadow-xl">
                        Main Portal
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Metrics Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-2">
                {[
                  { label: "Total Revenue", val: "₹1,24,500", icon: <CreditCard className="w-6 h-6" />, growth: "+12.5%", color: "text-[#B0843D]" },
                  { label: "Active Products", val: `${inventory.length}`, icon: <Package className="w-6 h-6" />, growth: null, color: "text-[#310101]" },
                  { label: "Total Visitors", val: "2,840", icon: <Users className="w-6 h-6" />, growth: "+5%", color: "text-[#310101]" },
                  { label: "Checkouts", val: "98%", icon: <CheckCircle className="w-6 h-6" />, growth: "Perfect", color: "text-green-600" }
                ].map((stat, idx) => (
                  <div key={idx} className="bg-white p-10 rounded-[50px] shadow-sm border border-[#E5D5C5]/30 group hover:shadow-xl hover:border-[#B0843D]/30 transition-all">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-[#F9F6F2] flex items-center justify-center text-[#310101]">{stat.icon}</div>
                      {stat.growth && <span className="text-[10px] font-black text-green-600 uppercase tracking-widest bg-green-50 px-3 py-1 rounded-full">{stat.growth}</span>}
                    </div>
                    <p className="text-[13px] font-black text-black uppercase tracking-widest mb-2">{stat.label}</p>
                    <h3 className={`text-5xl font-serif font-black ${stat.color}`}>{stat.val}</h3>
                  </div>
                ))}
              </div>

              {/* Analytical Hub */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 px-2">
                <div className="lg:col-span-2 space-y-10">
                  {/* Revenue Chart */}
                  <div className="bg-white rounded-[60px] p-12 border border-[#E5D5C5]/50 shadow-sm">
                    <div className="flex justify-between items-center mb-8">
                      <h4 className="text-2xl font-serif font-bold italic text-[#310101]">Revenue Velocity</h4>
                      <span className="text-[12px] font-black text-[#310101]/40 uppercase tracking-widest">7 Days • LIVE</span>
                    </div>
                    <div className="h-64 flex items-end justify-between gap-4">
                      {[40, 70, 45, 90, 65, 80, 100].map((height, i) => (
                        <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${height}%` }} transition={{ duration: 1, delay: i * 0.1 }}
                          className="flex-1 bg-[#310101] rounded-t-2xl relative group/bar hover:bg-[#B0843D] transition-colors">
                          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#310101] text-[#E5D5C5] text-[10px] font-black px-3 py-1 rounded-lg opacity-0 group-hover/bar:opacity-100 transition-opacity">
                            ₹{(height * 10).toLocaleString()}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    <div className="flex justify-between mt-4 px-2">
                      {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(day => (
                        <span key={day} className="text-[11px] font-black text-[#310101]/30 tracking-widest">{day}</span>
                      ))}
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-white rounded-[60px] p-12 shadow-sm border border-gray-100">
                    <h4 className="text-[18px] font-black font-serif text-black uppercase tracking-[0.2em] mb-2">Recent Activity</h4>
                    <p className="text-[13px] font-black text-black/50 uppercase tracking-widest italic mb-10">Live from the Boutique Floor</p>
                    <div className="space-y-8">
                      {inventory.slice(0, 4).map((item, i) => (
                        <div key={i} onClick={() => setEditingProduct({ ...item, price: item.numericPrice?.toString() || "", stock: item.stock?.toString() || "" })}
                          className="flex items-center justify-between group cursor-pointer hover:bg-gray-50/50 p-4 -mx-4 rounded-[30px] transition-all">
                          <div className="flex items-center gap-6">
                            <div className="w-12 h-12 rounded-[18px] bg-[#F9F6F2] flex items-center justify-center text-[#310101] font-serif font-black text-lg relative shadow-sm">
                              {item.name.charAt(0)}
                              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-4 border-white"></div>
                            </div>
                            <div>
                              <p className="text-[14px] font-bold text-black">
                                Published: <span className="font-serif italic">"{item.name}"</span>
                              </p>
                              <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${i % 2 === 0 ? 'bg-[#F9F6F2] text-[#B0843D]' : 'bg-green-50 text-green-700'}`}>
                                {item.category}
                              </span>
                            </div>
                          </div>
                          <ChevronDown className="w-5 h-5 text-black/20 rotate-[270deg] group-hover:text-[#B0843D] transition-colors" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-10">
                  {/* Category Index */}
                  <div className="bg-[#310101] rounded-[50px] p-12 shadow-2xl border border-white/5">
                    <div className="flex items-center gap-4 mb-10">
                      <TrendingUp className="w-6 h-6 text-[#B0843D]" />
                      <h5 className="text-[16px] font-black text-white uppercase tracking-[0.3em]">Category Index</h5>
                    </div>
                    <div className="space-y-6">
                      {allCategories.slice(0, 5).map((cat, i) => {
                        const count = inventory.filter(p => p.category.toLowerCase() === cat.toLowerCase()).length;
                        const percent = inventory.length > 0 ? (count / inventory.length) * 100 : 10;
                        return (
                          <div key={i} className="space-y-3">
                            <div className="flex justify-between items-center text-[13px] font-black uppercase tracking-widest">
                              <span className="text-white">{cat}</span>
                              <span className="text-[#B0843D] text-[11px]">{count} ITEMS</span>
                            </div>
                            <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                              <motion.div initial={{ width: 0 }} animate={{ width: `${percent || 10}%` }}
                                className="h-full bg-[#B0843D] rounded-full shadow-[0_0_15px_rgba(176,132,61,0.5)]" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Infrastructure Health */}
                  <div className="bg-white rounded-[50px] p-12 shadow-sm border border-[#E5D5C5]/30">
                    <h5 className="text-[14px] font-black text-black uppercase tracking-[0.3em] mb-10">Infrastructure Health</h5>
                    <div className="space-y-8">
                      {[
                        { name: "Cloud Storage", status: "Optimal", color: "bg-green-500" },
                        { name: "CDN Nodes", status: "Active", color: "bg-green-500" },
                        { name: "Database", status: "Syncing", color: "bg-[#B0843D]" }
                      ].map((sys, i) => (
                        <div key={i} className="flex items-center gap-6">
                          <div className={`w-3 h-3 rounded-full ${sys.color} animate-pulse shrink-0`}></div>
                          <div>
                            <p className="text-[14px] font-black text-black uppercase tracking-widest leading-none">{sys.name}</p>
                            <p className="text-[11px] font-black text-black/40 uppercase tracking-[0.2em] mt-1">{sys.status}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════ PRODUCTS ═══════════════════ */}
          {activeTab === "Products" && (
            <div className="space-y-6">
              <div className="flex flex-wrap justify-between items-center gap-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-50">
                <div className="flex items-center gap-3 bg-gray-50 px-5 py-2 rounded-full">
                  <span className="text-[12px] font-black text-black uppercase tracking-widest">Filter:</span>
                  <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="bg-transparent text-[13px] font-bold text-[#310101] uppercase tracking-wider outline-none cursor-pointer">
                    <option value="All">All Categories</option>
                    {allCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <button onClick={() => setIsAddModalOpen(true)} className="bg-[#310101] text-[#E5D5C5] px-6 py-2.5 rounded-full text-[12px] font-black uppercase tracking-widest hover:scale-105 transition-transform flex items-center gap-2">
                  <PlusCircle className="w-4 h-4" /> Add Product
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="bg-white rounded-2xl overflow-hidden border border-gray-50 group hover:shadow-xl transition-all">
                    <div className="aspect-square overflow-hidden bg-[#F9F6F2] relative">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      {!product.isLive && (
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                          <span className="bg-[#310101] text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl">Hidden from Store</span>
                        </div>
                      )}
                    </div>
                    <div className="p-5 space-y-3">
                      <div>
                        <h3 className="font-serif font-black text-black text-base leading-tight">{product.name}</h3>
                        <p className="text-[11px] font-black text-black/40 uppercase tracking-widest mt-1">{product.category}</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-black text-[#310101] text-lg">{product.price}</span>
                        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                          product.status === "In Stock" ? "bg-green-50 text-green-700" :
                          product.status === "Low Stock" ? "bg-orange-50 text-orange-600" : "bg-red-50 text-red-600"
                        }`}>{product.status}</span>
                      </div>
                      <div className="flex gap-2 pt-1">
                        <button onClick={() => setEditingProduct({ ...product, price: product.numericPrice?.toString() || "", stock: product.stock?.toString() || "" })} className="flex-1 bg-[#310101] text-white py-2 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-[#1a0101] transition-colors flex items-center justify-center gap-1">
                          <Edit2 className="w-3 h-3" /> Edit
                        </button>
                        <button onClick={() => handleDeleteProduct(product.id)} className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══════════════════ ORDERS (Fulfillment Portal) ═══════════════════ */}
          {activeTab === "Orders" && (
            <div className="space-y-6 pb-4">
              <div>
                <h2 className="text-5xl font-serif font-black text-black tracking-tighter italic">Fulfillment Portal</h2>
                <p className="text-[13px] font-black text-black/50 uppercase tracking-[0.2em] mt-2">Click any status to track real-time location</p>
              </div>

              <div className="bg-white rounded-[30px] shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left min-w-[900px]">
                    <thead className="bg-[#F9F6F2] text-[13px] font-black uppercase tracking-[0.15em] text-[#310101] border-b border-gray-100">
                      <tr>
                        <th className="px-8 py-6">Order ID</th>
                        <th className="px-8 py-6">Customer</th>
                        <th className="px-8 py-6">Items</th>
                        <th className="px-8 py-6">Volume</th>
                        <th className="px-8 py-6">Payment</th>
                        <th className="px-8 py-6">Amount</th>
                        <th className="px-8 py-6">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {ORDERS.map((order, i) => (
                        <tr key={i} className="hover:bg-gray-50/40 transition-colors">
                          <td className="px-8 py-7 font-mono font-black text-black text-base tracking-widest whitespace-nowrap">{order.id}</td>
                          <td className="px-8 py-7">
                            <div className="flex items-center gap-4 whitespace-nowrap">
                              <div className="w-9 h-9 rounded-full bg-[#310101] flex items-center justify-center font-serif italic text-white font-bold">{order.customer.charAt(0)}</div>
                              <span className="font-black text-black text-base">{order.customer}</span>
                            </div>
                          </td>
                          <td className="px-8 py-7 whitespace-nowrap">
                            <p className="text-black font-serif italic font-bold text-base">{order.item}</p>
                            <p className="text-[11px] font-black uppercase tracking-[0.1em] text-[#310101]/50 mt-0.5">{order.mix}</p>
                          </td>
                          <td className="px-8 py-7 font-black text-black text-base whitespace-nowrap">{order.qty}</td>
                          <td className="px-8 py-7">
                            <span className={`text-[12px] font-black uppercase tracking-widest ${order.payment === "Paid" ? "text-green-700" : "text-orange-600 animate-pulse"}`}>
                              {order.payment}
                            </span>
                          </td>
                          <td className="px-8 py-7 font-black text-black text-lg whitespace-nowrap">{order.amount}</td>
                          <td className="px-8 py-7">
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className={`px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest whitespace-nowrap hover:scale-105 transition-all ${
                                order.status === "Pending" ? "bg-orange-600 text-white" :
                                order.status === "In Transit" ? "bg-blue-600 text-white" : "bg-green-600 text-white"
                              }`}
                            >
                              {order.status}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════ CUSTOMERS ═══════════════════ */}
          {activeTab === "Customers" && (
            <div className="space-y-6 pb-4">
              <h2 className="text-5xl font-serif font-black text-black tracking-tighter italic">Boutique Clientele</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { name: "Zaid Shaikh", email: "zaid.s@gmail.com", orders: 5, spent: "₹24,500", tier: "Gold Member" },
                  { name: "Ayesha Ahmed", email: "ayesha.a@kaleemiya.com", orders: 12, spent: "₹86,200", tier: "Platinum" },
                  { name: "Omar Farooq", email: "omar.farooq@kaleemiya.com", orders: 3, spent: "₹12,400", tier: "Member" }
                ].map((cust, i) => (
                  <div key={i} className="bg-white p-8 rounded-[30px] shadow-sm border border-gray-100 hover:shadow-xl transition-all">
                    <div className="flex items-center gap-5 mb-6">
                      <div className="w-16 h-16 rounded-[20px] bg-[#310101] text-white flex items-center justify-center font-serif text-2xl italic font-bold shrink-0">
                        {cust.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-2xl font-serif font-black text-black">{cust.name}</h4>
                        <p className="text-[12px] font-black text-black/40 uppercase tracking-widest">{cust.tier}</p>
                      </div>
                    </div>
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between text-[13px] font-black uppercase tracking-widest">
                        <span className="text-black/40">Total Spent</span>
                        <span className="text-[#310101] font-black text-base">{cust.spent}</span>
                      </div>
                      <div className="flex justify-between text-[13px] font-black uppercase tracking-widest">
                        <span className="text-black/40">Orders</span>
                        <span className="text-[#310101] font-black text-base">{cust.orders}</span>
                      </div>
                    </div>
                    <div className="pt-5 border-t border-gray-100 flex items-center justify-between">
                      <div>
                        <p className="text-[11px] font-black text-black/30 uppercase tracking-widest">Email</p>
                        <p className="text-[14px] font-black text-black">{cust.email}</p>
                      </div>
                      <button className="p-3 bg-gray-50 rounded-xl hover:bg-[#310101] hover:text-white transition-all">
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══════════════════ CATEGORIES ═══════════════════ */}
          {activeTab === "Categories" && (
            <div className="space-y-6 pb-4">
              <div className="flex justify-between items-center bg-white p-5 rounded-2xl shadow-sm border border-gray-50">
                <h2 className="text-xl font-serif font-black text-[#310101] italic">Categories Directory</h2>
                <button onClick={handleAddCategory} className="bg-[#310101] text-[#E5D5C5] px-5 py-2 rounded-full text-[12px] font-black uppercase tracking-widest hover:scale-105 transition-transform flex items-center gap-2">
                  <PlusCircle className="w-4 h-4" /> Add
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                {allCategories.map((cat, idx) => {
                  const count = inventory.filter(p => (p.category || "").toLowerCase() === cat.toLowerCase()).length;
                  return (
                    <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-50 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center space-y-3 group">
                      <div className="w-14 h-14 rounded-full bg-[#F9F6F2] flex items-center justify-center text-[#310101] group-hover:bg-[#310101] group-hover:text-white transition-colors duration-500">
                        <Tag className="w-6 h-6" />
                      </div>
                      <h3 className="text-base font-serif font-black text-[#310101]">{cat}</h3>
                      <p className="text-[12px] font-black text-black/40 uppercase tracking-widest">{count} Items</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ═══════════════════ ADMIN REQUESTS ═══════════════════ */}
          {activeTab === "Admin Requests" && (
            <div className="space-y-12 max-w-6xl mx-auto pb-24">
              {/* Hero Header */}
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
                <p className="text-xl font-bold text-black uppercase tracking-[0.1em] max-w-3xl ml-1 leading-relaxed opacity-100">
                  Review and verify administrative access for the Kaleemiya storefront.
                  <span className="block text-black/40 text-[14px] mt-4 italic tracking-[0.3em] lowercase">Guarding the essence of pure elegance.</span>
                </p>
              </div>

              {/* Requests List */}
              <div className="mx-4 bg-white rounded-[55px] shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-12 py-10 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
                  <h4 className="text-[14px] font-black text-black uppercase tracking-[0.4em]">Pending Authority Requests ({filteredRequests.length})</h4>
                  <input
                    value={requestSearch}
                    onChange={e => setRequestSearch(e.target.value)}
                    placeholder="Search requests..."
                    className="bg-white border border-gray-100 rounded-2xl px-5 py-3 text-[13px] font-bold text-black outline-none shadow-sm w-56"
                  />
                </div>
                <div className="divide-y divide-gray-100">
                  {filteredRequests.map((item) => {
                    const initials = item.name?.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) || "?";
                    return (
                      <div key={item.id} className="p-12 flex flex-col lg:flex-row items-center justify-between gap-12 hover:bg-gray-50/50 transition-colors">
                        <div className="flex items-center gap-10">
                          <div className="w-28 h-28 rounded-[40px] bg-black text-[#E5D5C5] flex items-center justify-center font-serif text-5xl font-bold shadow-2xl relative shrink-0">
                            {initials}
                            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-full border-8 border-white"></div>
                          </div>
                          <div className="space-y-4">
                            <h5 className="text-5xl font-serif font-black text-black tracking-tighter italic">{item.name}</h5>
                            <div className="flex items-center gap-10 flex-wrap">
                              <span className="text-[15px] font-black text-black">{item.email}</span>
                              <div className="w-2 h-2 bg-[#310101] rounded-full shrink-0"></div>
                              <span className="text-[14px] font-black text-[#310101] uppercase tracking-widest bg-[#F9F6F2] px-8 py-3 rounded-2xl border border-[#B0843D]/30">Requested Admin Authority</span>
                            </div>
                            <p className="text-[14px] font-medium text-black/50 italic max-w-lg leading-relaxed">
                              " {item.reason} "
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-8 shrink-0">
                          <button 
                            onClick={() => handleApproveReq(item.id, item.userId, item.name)} 
                            className="bg-black text-white px-14 py-7 rounded-[30px] text-[13px] font-black uppercase tracking-widest hover:scale-105 transition-all"
                          >
                            Approve Permission
                          </button>
                          <button 
                            onClick={() => handleDenyReq(item.id, item.name)} 
                            className="bg-white text-black border border-gray-200 px-14 py-7 rounded-[30px] text-[13px] font-black uppercase tracking-widest hover:bg-red-50 hover:text-red-600 transition-all font-sans"
                          >
                            Deny
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  {filteredRequests.length === 0 && (
                    <div className="px-12 py-16 text-center">
                      <p className="text-[14px] font-black text-black/30 uppercase tracking-widest">No pending requests</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Security Protocol Banner */}
              <div className="mx-4 p-12 rounded-[55px] bg-[#F9F6F2] border border-[#E5D5C5]/50 flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="flex items-center gap-10">
                  <div className="w-20 h-20 rounded-[28px] bg-white flex items-center justify-center text-black shadow-md border border-gray-100">
                    <ShieldAlert className="w-10 h-10" />
                  </div>
                  <div>
                    <h6 className="text-[16px] font-black text-black uppercase tracking-[0.3em] mb-3">Administrative Security Protocol</h6>
                    <p className="text-[13px] font-bold text-black/50 uppercase tracking-widest">Access delegation authorizes full visibility over secure sales data.</p>
                  </div>
                </div>
              </div>

              {/* Approval Log */}
              {approvalLogs.length > 0 && (
                <div className="mx-4 space-y-6 pb-12">
                  <h4 className="text-[14px] font-black text-black uppercase tracking-[0.4em]">Historical Resolution Log</h4>
                  <div className="space-y-4">
                    {approvalLogs.map((log) => (
                      <div key={log.id} className="bg-white p-8 rounded-[35px] border border-gray-100 shadow-sm flex justify-between items-center group hover:border-[#310101]/20 transition-all">
                        <div className="flex items-center gap-6">
                           <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${log.status === "approved" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
                             {log.status === "approved" ? <CheckCircle className="w-5 h-5" /> : <X className="w-5 h-5" />}
                           </div>
                           <span className="text-[16px] font-black text-black">{log.name}</span>
                        </div>
                        <span className={`text-[11px] font-black uppercase tracking-widest px-6 py-2.5 rounded-full ${log.status === "approved" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                          Access {log.status}
                        </span>
                        <span className="text-[12px] font-black text-black/20 uppercase tracking-widest">
                          {log.createdAt?.toDate ? log.createdAt.toDate().toLocaleDateString() : "Historical"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ═══════════════════ SETTINGS ═══════════════════ */}
          {activeTab === "Settings" && (
            <div className="space-y-12 max-w-6xl mx-auto pb-24 px-4 pt-4">
              {/* Settings Header */}
              <div className="flex flex-col gap-6">
                <div className="inline-flex items-center gap-4 bg-[#F9F6F2] px-6 py-2.5 rounded-full border border-[#E5D5C5]/50 w-fit">
                  <Settings className="w-5 h-5 text-[#310101]" />
                  <span className="text-[12px] font-black uppercase tracking-[0.2em] text-[#310101]">System Configuration</span>
                </div>
                <h2 className="text-7xl font-serif font-black text-black tracking-tighter italic lowercase first-letter:uppercase">Boutique Core</h2>
                <p className="text-xl font-medium text-black/50 uppercase tracking-[0.15em] max-w-2xl leading-relaxed">
                  Manage the fundamental parameters, security, and aesthetics of the <span className="text-[#310101] font-black">Kaleemiya Dashboard</span>.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                {/* Column 1 */}
                <div className="space-y-12">
                  {/* Store Profile Section */}
                  <div className="bg-white rounded-[50px] p-12 shadow-sm border border-gray-100 space-y-10 group hover:shadow-xl transition-all duration-500">
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 rounded-[30px] bg-[#310101] flex items-center justify-center text-white shadow-2xl">
                        <ShoppingBag className="w-10 h-10" />
                      </div>
                      <h3 className="text-4xl font-serif font-black text-black italic">Store Profile</h3>
                    </div>

                    <div className="space-y-8">
                      <div className="space-y-2">
                        <label className="text-[11px] font-black uppercase tracking-[0.3em] text-black/40 ml-1">Boutique Name</label>
                        <input
                          type="text"
                          value={storeSettings.name}
                          onChange={(e) => setStoreSettings({ ...storeSettings, name: e.target.value })}
                          className="w-full bg-[#FDFCFB] border border-gray-100 rounded-3xl px-8 py-5 text-lg font-bold text-black outline-none focus:border-[#B0843D] transition-colors shadow-inner"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[11px] font-black uppercase tracking-[0.3em] text-black/40 ml-1">Support Email</label>
                        <input
                          type="email"
                          value={storeSettings.email}
                          onChange={(e) => setStoreSettings({ ...storeSettings, email: e.target.value })}
                          className="w-full bg-[#FDFCFB] border border-gray-100 rounded-3xl px-8 py-5 text-lg font-bold text-black outline-none focus:border-[#B0843D] transition-colors shadow-inner"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[11px] font-black uppercase tracking-[0.3em] text-black/40 ml-1">Primary Currency</label>
                        <select
                          value={storeSettings.currency}
                          onChange={(e) => setStoreSettings({ ...storeSettings, currency: e.target.value })}
                          className="w-full bg-[#FDFCFB] border border-gray-100 rounded-3xl px-8 py-5 text-lg font-bold text-black outline-none focus:border-[#B0843D] transition-colors shadow-inner appearance-none"
                        >
                          <option>INR (₹)</option>
                          <option>USD ($)</option>
                          <option>AED (د.إ)</option>
                          <option>GBP (£)</option>
                        </select>
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                        localStorage.setItem("kaleemiya_store_settings", JSON.stringify(storeSettings));
                        toast.success("Boutique profile updated successfully!");
                      }}
                      className="w-full bg-[#310101] text-white py-6 rounded-[30px] font-black uppercase tracking-[0.3em] text-[13px] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl"
                    >
                      Update Profile
                    </button>
                  </div>

                  {/* Security Panel */}
                  <div className="bg-[#310101] rounded-[50px] p-12 shadow-2xl space-y-10 border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#B0843D] rounded-full -mr-32 -mt-32 blur-[100px] opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity"></div>
                    
                    <div className="flex items-center gap-6 relative z-10">
                      <div className="w-20 h-20 rounded-[30px] bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/10">
                        <ShieldAlert className="w-10 h-10" />
                      </div>
                      <h3 className="text-4xl font-serif font-black text-white italic">Security Shield</h3>
                    </div>

                    <div className="space-y-8 relative z-10">
                      <div className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/10 group/row hover:bg-white/10 transition-colors">
                        <div>
                          <p className="text-white font-black uppercase tracking-widest text-sm mb-1">Two-Factor Auth</p>
                          <p className="text-white/40 text-[11px] font-bold uppercase tracking-widest">Enhanced Data Safety</p>
                        </div>
                        <div className="w-16 h-8 bg-black rounded-full p-1 relative cursor-pointer border border-white/20">
                          <div className="w-6 h-6 bg-[#B0843D] rounded-full shadow-lg"></div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/10 group/row hover:bg-white/10 transition-colors">
                        <div>
                          <p className="text-white font-black uppercase tracking-widest text-sm mb-1">Administrative Password</p>
                          <p className="text-white/40 text-[11px] font-bold uppercase tracking-widest">Last updated 12 days ago</p>
                        </div>
                        <button className="bg-white/10 hover:bg-[#B0843D] px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white transition-colors">
                          Reset
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/10 group/row hover:bg-white/10 transition-colors">
                        <div>
                          <p className="text-white font-black uppercase tracking-widest text-sm mb-1">Active Sessions</p>
                          <p className="text-white/40 text-[11px] font-bold uppercase tracking-widest">3 Devices Connected</p>
                        </div>
                        <p className="text-[#B0843D] font-black text-sm uppercase tracking-widest">Manage</p>
                      </div>
                    </div>
                  </div>

                  {/* Aesthetics Section */}
                  <div className="bg-white rounded-[50px] p-12 shadow-sm border border-gray-100 space-y-10">
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 rounded-[30px] bg-[#B0843D] flex items-center justify-center text-white shadow-xl">
                        <Zap className="w-10 h-10" />
                      </div>
                      <h3 className="text-4xl font-serif font-black text-black italic">Aesthetics</h3>
                    </div>

                    <div className="space-y-8">
                      <div className="space-y-4">
                        <label className="text-[11px] font-black uppercase tracking-[0.3em] text-black/40 ml-1">Brand Accent Color</label>
                        <div className="flex gap-4">
                          {["#310101", "#B0843D", "#4A5D23", "#1A1A1A", "#722F37", "#CC9900"].map((color) => (
                            <button
                              key={color}
                              onClick={() => setStoreSettings({ ...storeSettings, accentColor: color })}
                              style={{ backgroundColor: color }}
                              className={`w-14 h-14 rounded-2xl border-4 transition-all hover:scale-110 shadow-lg ${storeSettings.accentColor === color ? "border-[#FDFCFB] scale-110 shadow-xl" : "border-transparent opacity-60"}`}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                         <div className="p-6 bg-[#FDFCFB] border border-gray-100 rounded-3xl space-y-2 group/card hover:border-[#B0843D] transition-colors cursor-pointer shadow-sm">
                           <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center shadow-sm">
                             <div className="w-6 h-6 rounded-full bg-black"></div>
                           </div>
                           <p className="text-black font-black uppercase tracking-widest text-[13px]">Bespoke Dark</p>
                           <p className="text-black/30 font-bold uppercase tracking-widest text-[9px]">Dashboard UI</p>
                         </div>
                         <div className="p-6 bg-[#FDFCFB] border border-[#B0843D] rounded-3xl space-y-2 group/card hover:border-[#B0843D] transition-colors cursor-pointer shadow-md">
                           <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center shadow-sm">
                             <div className="w-6 h-6 rounded-full border-2 border-black"></div>
                           </div>
                           <p className="text-black font-black uppercase tracking-widest text-[13px]">Linen White</p>
                           <p className="text-[#B0843D] font-bold uppercase tracking-widest text-[9px]">Active Choice</p>
                         </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 2 */}
                <div className="space-y-12">
                  {/* System Settings Section (Grid Layout) */}
                  <div className="bg-white rounded-[50px] p-12 shadow-sm border border-gray-100 space-y-12 group hover:shadow-xl transition-all duration-700">
                    <div className="flex flex-col gap-2">
                       <h3 className="text-[28px] font-sans font-black text-[#0A1D37] tracking-tight uppercase">System Settings</h3>
                       <p className="text-[12px] font-bold text-black/30 uppercase tracking-[0.2em]">Global Configurations for the Portal</p>
                    </div>

                    <div className="flex flex-col gap-12">
                      {/* Section 1: Security & Status */}
                      <div className="space-y-6 lg:space-y-10">
                        {/* Live Controls Card */}
                        <div className="bg-[#111111] rounded-[40px] md:rounded-[55px] p-8 md:p-12 space-y-8 relative overflow-hidden group/live shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] flex flex-col min-h-[320px] md:min-h-[380px] justify-end border border-white/5">
                          <div className="absolute top-0 right-0 w-48 h-48 bg-[#B0843D] rounded-full -mr-24 -mt-24 blur-[90px] opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity duration-700"></div>
                          <div className="inline-flex w-14 h-14 rounded-2xl bg-white/5 border border-white/10 items-center justify-center text-[#B0843D] mb-4">
                            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12l3-3 3 6 4-12 3 9 3-3" /></svg>
                          </div>
                          <div className="space-y-4 relative z-10">
                            <h4 className="text-2xl md:text-3xl font-sans font-black text-white uppercase tracking-tight leading-tight">Live Controls</h4>
                            <p className="text-[12px] md:text-[13px] font-bold text-white/40 leading-relaxed uppercase tracking-widest">Emergency override for all live news updates. Disabling this will instantly hide the live feed from the public portal.</p>
                          </div>
                        </div>

                        {/* Security Card */}
                        <div className="bg-white border border-gray-100/60 rounded-[35px] p-8 md:p-10 flex items-center gap-6 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.02)] group/sec hover:border-[#B0843D]/30 hover:shadow-xl transition-all duration-500">
                          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-inner ${storeSettings.publicLivePage ? "bg-[#F9F6F2] text-[#B0843D]" : "bg-red-50 text-red-500"}`}>
                            <ShieldAlert className="w-7 h-7" />
                          </div>
                          <div className="space-y-0.5">
                            <p className="text-[10px] font-black text-black/20 uppercase tracking-[0.3em]">Security</p>
                            <p className="text-lg font-black text-[#0A1D37] uppercase tracking-tight leading-none transition-colors">
                               {storeSettings.publicLivePage ? "Protected Mode Active" : "Security Override Active"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Section 2: Feature Management */}
                      <div className="bg-[#FDFCFB]/80 border border-[#E5D5C5]/40 rounded-[50px] md:rounded-[65px] p-8 md:p-14 space-y-12 relative shadow-sm hover:border-[#E5D5C5]/60 transition-all duration-700">
                        <div className="flex items-center justify-between">
                           <h4 className="text-[14px] font-black text-[#0A1D37] uppercase tracking-[0.4em] font-serif italic">Feature Management</h4>
                           <Settings className="w-5 h-5 text-black/10" />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                          {/* Public Live Page Toggle Card */}
                          <div className="bg-white rounded-[45px] p-8 md:p-10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.03)] border border-gray-100/50 relative group/toggle transition-all hover:shadow-[0_40px_80px_-20px_rgba(176,132,61,0.1)] flex flex-col justify-between">
                             <div className="space-y-5">
                                <div className="flex flex-col sm:flex-row items-center gap-4">
                                   <h5 className="text-xl font-sans font-black text-[#0A1D37] uppercase tracking-tighter leading-none">Public Live Page</h5>
                                   <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm border transition-all duration-500 ${storeSettings.publicLivePage ? "bg-green-50 text-green-700 border-green-100" : "bg-red-50 text-red-700 border-red-100"}`}>
                                      {storeSettings.publicLivePage ? "Online" : "Offline"}
                                   </span>
                                </div>
                                <p className="text-[13px] font-bold text-black/30 uppercase tracking-[0.15em] leading-relaxed">Toggle the visibility of the real-time news feed across the entire portal.</p>
                             </div>
                             
                             <div className="pt-8">
                               <div 
                                 onClick={() => setStoreSettings({ ...storeSettings, publicLivePage: !storeSettings.publicLivePage })}
                                 className={`w-28 h-14 rounded-full p-1.5 cursor-pointer transition-all duration-500 ease-in-out flex items-center shrink-0 border-4 ${storeSettings.publicLivePage ? "bg-[#B0843D] border-[#B0843D]/10" : "bg-gray-100 border-transparent shadow-inner"}`}
                               >
                                 <motion.div 
                                   layout
                                   className="w-9 h-9 bg-white rounded-full shadow-2xl flex items-center justify-center border border-gray-100"
                                   animate={{ x: storeSettings.publicLivePage ? 56 : 0 }}
                                   transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                 >
                                    <div className={`w-3 h-3 rounded-full transition-colors duration-500 shadow-inner ${storeSettings.publicLivePage ? "bg-[#B0843D]" : "bg-gray-300"}`}></div>
                                 </motion.div>
                               </div>
                             </div>
                          </div>

                          {/* Info Note Box */}
                          <div className="bg-[#F4F9FF] border border-[#DCEBFF] rounded-[45px] p-8 md:p-10 space-y-6 flex flex-col justify-center shadow-sm">
                             <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center flex-shrink-0 text-[#2B7FFF] shadow-sm border border-white">
                                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                             </div>
                             <p className="text-[15px] font-medium text-[#2B5699] font-sans leading-relaxed tracking-tight">
                                Note: Disabling the live page will not delete any news posts, it only hides the "Live" section from the public view.
                             </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-center sm:justify-end gap-3.5 opacity-40 hover:opacity-100 transition-all duration-500">
                           <div className="relative">
                              <div className="w-5 h-5 rounded-full border-2 border-green-500/30 flex items-center justify-center">
                                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                              </div>
                           </div>
                           <span className="text-[11px] font-black text-[#0A1D37] uppercase tracking-[0.4em]">Settings Synced in Real-Time</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Advanced / API Section */}
                  <div className="bg-[#F9F6F2] border border-[#E5D5C5]/50 rounded-[50px] p-12 space-y-10 group shadow-sm">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-[24px] bg-white flex items-center justify-center text-[#310101] shadow-sm border border-[#E5D5C5]/30">
                        <Tag className="w-8 h-8" />
                      </div>
                      <h3 className="text-3xl font-serif font-black text-[#310101] italic">Infrastructure</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                      <div className="bg-white border border-white rounded-[40px] p-8 flex flex-col justify-between group/item hover:border-[#B0843D]/30 transition-all shadow-sm">
                        <div className="flex items-center gap-4 mb-6">
                          <div className={`w-3 h-3 rounded-full ${storeSettings.maintenanceMode ? "bg-orange-500" : "bg-green-500"} animate-pulse`}></div>
                          <div>
                            <p className="text-[#310101] font-black uppercase tracking-widest text-xs">Maintenance Vault</p>
                            <p className="text-black/30 font-bold text-[9px] uppercase tracking-widest mt-0.5">{storeSettings.maintenanceMode ? "Closed" : "Accessible"}</p>
                          </div>
                        </div>
                        <div 
                          onClick={() => setStoreSettings({ ...storeSettings, maintenanceMode: !storeSettings.maintenanceMode })}
                          className={`w-14 h-7 rounded-full transition-all flex items-center px-1 cursor-pointer ${storeSettings.maintenanceMode ? "bg-orange-500" : "bg-black"}`}
                        >
                          <motion.div 
                            layout
                            className="w-5 h-5 bg-white rounded-full shadow-lg"
                            animate={{ x: storeSettings.maintenanceMode ? 28 : 0 }}
                          />
                        </div>
                      </div>

                      <div className="bg-red-50/50 border border-red-100 rounded-[40px] p-8 flex flex-col justify-center space-y-4">
                        <p className="text-red-800 font-black uppercase tracking-[0.2em] text-[10px] text-center">Cautionary Zone</p>
                        <button className="w-full bg-white text-red-600 border border-red-100 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-red-600 hover:text-white transition-all shadow-sm">
                          Wipe Cache
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Version Info */}
              <div className="flex flex-col items-center gap-4 opacity-30 pt-10">
                <p className="text-[12px] font-black uppercase tracking-[0.5em] text-black">Kaleemiya • v4.2.0-Elite</p>
                <div className="w-1 h-20 bg-gradient-to-b from-black to-transparent"></div>
              </div>
            </div>
          )}

        </div>
        {/* End scrollable content */}

        {/* ═══ Modals (fixed, inside main container) ═══ */}
        <AnimatePresence>
          {(isAddModalOpen || editingProduct) && (
            <motion.div
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md"
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[40px] shadow-2xl relative border border-gray-100"
              >
                <div className="sticky top-0 z-10 flex items-center justify-between p-8 bg-[#310101] text-white">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-serif font-black tracking-tighter italic">
                        {editingProduct ? "Refinement" : "New Creation"}
                      </h2>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">
                        Boutique Inventory Portal • {editingProduct ? "Modify Item" : "Publish Item"}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setIsAddModalOpen(false);
                      setEditingProduct(null);
                    }}
                    className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>

                <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct} className="p-8 space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-[11px] font-black uppercase tracking-widest text-black/50 mb-1 block">Product Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Oud Al Malikah"
                        value={editingProduct ? editingProduct.name : newProduct.name}
                        onChange={e => editingProduct
                          ? setEditingProduct({ ...editingProduct, name: e.target.value })
                          : setNewProduct({ ...newProduct, name: e.target.value })
                        }
                        className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-[14px] font-bold text-black outline-none focus:border-[#310101] shadow-sm transition-all"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] font-black uppercase tracking-widest text-black/50 mb-1 block">Price (₹)</label>
                        <input
                          type="number"
                          placeholder="2500"
                          value={editingProduct ? editingProduct.price : newProduct.price}
                          onChange={e => editingProduct
                            ? setEditingProduct({ ...editingProduct, price: e.target.value })
                            : setNewProduct({ ...newProduct, price: e.target.value })
                          }
                          className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-[14px] font-bold text-black outline-none focus:border-[#310101] shadow-sm transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-black uppercase tracking-widest text-black/50 mb-1 block">Stock Quantity</label>
                        <input
                          type="number"
                          placeholder="15"
                          value={editingProduct ? editingProduct.stock : newProduct.stock}
                          onChange={e => editingProduct
                            ? setEditingProduct({ ...editingProduct, stock: e.target.value })
                            : setNewProduct({ ...newProduct, stock: e.target.value })
                          }
                          className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-[14px] font-bold text-black outline-none focus:border-[#310101] shadow-sm transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <label className="text-[11px] font-black uppercase tracking-widest text-black/50 mb-1 block">Page Section</label>
                      <select
                        value={editingProduct ? editingProduct.section : newProduct.section}
                        onChange={e => editingProduct
                          ? setEditingProduct({ ...editingProduct, section: e.target.value })
                          : setNewProduct({ ...newProduct, section: e.target.value })
                        }
                        className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-[14px] font-bold text-black outline-none focus:border-[#310101] shadow-sm transition-all bg-[#FDFCFB]"
                      >
                        {allSections.map(sec => <option key={sec} value={sec}>{sec}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-black uppercase tracking-widest text-black/50 mb-1 block">Category</label>
                      <select
                        value={editingProduct ? editingProduct.category : newProduct.category}
                        onChange={e => {
                          const newCat = e.target.value;
                          const sub = dynamicSubCategories[newCat]?.[0] || "General";
                          editingProduct
                            ? setEditingProduct({ ...editingProduct, category: newCat, subCategory: sub })
                            : setNewProduct({ ...newProduct, category: newCat, subCategory: sub });
                        }}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-[14px] font-bold text-black outline-none focus:border-[#310101] shadow-sm transition-all bg-[#FDFCFB]"
                      >
                        {allCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-black uppercase tracking-widest text-black/50 mb-1 block">Sub-Category</label>
                      <select
                        value={editingProduct ? editingProduct.subCategory : newProduct.subCategory}
                        onChange={async (e) => {
                          if (e.target.value === "ADD_NEW") {
                            const custom = window.prompt("Enter new sub-category:");
                            if (custom) {
                              const currentCat = editingProduct ? editingProduct.category : newProduct.category;
                              const newSubs = { ...subCategoriesConfig };
                              newSubs[currentCat] = [...(newSubs[currentCat] || []), custom];
                              await setDoc(doc(db, "metadata", "categories"), { subs: newSubs }, { merge: true });
                              editingProduct
                                ? setEditingProduct({ ...editingProduct, subCategory: custom })
                                : setNewProduct({ ...newProduct, subCategory: custom });
                            }
                          } else {
                            editingProduct
                              ? setEditingProduct({ ...editingProduct, subCategory: e.target.value })
                              : setNewProduct({ ...newProduct, subCategory: e.target.value });
                          }
                        }}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-[14px] font-bold text-black outline-none focus:border-[#310101] shadow-sm transition-all bg-[#FDFCFB]"
                      >
                        {(dynamicSubCategories[editingProduct ? editingProduct.category : newProduct.category] || ["General"]).map(sub => (
                          <option key={sub} value={sub}>{sub}</option>
                        ))}
                        <option value="ADD_NEW">+ New Sub-category...</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-6 bg-[#FDFCFB] border border-gray-100 rounded-3xl">
                    <label className="text-[11px] font-black uppercase tracking-widest text-black/50 mb-4 block">Product Media Component</label>
                    
                    {(editingProduct?.image || newProduct.image) && (
                      <div className="mb-4 relative group w-32 h-32">
                        <img 
                          src={editingProduct ? editingProduct.image : newProduct.image} 
                          alt="Preview" 
                          className="w-full h-full object-cover rounded-2xl border border-gray-200 shadow-sm"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                          <CheckCircle className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    )}

                    <div className="relative">
                      <input
                        type="file" 
                        accept="image/*,video/*" 
                        onChange={handleImageUpload}
                        className="w-full text-sm font-medium text-black file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border file:border-gray-200 file:text-xs file:font-black file:uppercase file:bg-white file:text-[#310101] hover:file:bg-gray-50 file:cursor-pointer"
                        disabled={isUploading}
                      />
                      {isUploading && (
                        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center rounded-xl">
                          <div className="w-4 h-4 border-2 border-[#310101] border-t-transparent animate-spin rounded-full mr-2"></div>
                          <span className="text-[10px] font-black uppercase tracking-widest">Processing Media...</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-6 bg-[#FDFCFB] border border-gray-100 rounded-3xl">
                    <div>
                      <p className="text-[13px] font-black text-[#310101] uppercase tracking-tight">Public Visibility</p>
                      <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest">Toggle storefront status</p>
                    </div>
                    <div 
                      onClick={() => editingProduct 
                        ? setEditingProduct({ ...editingProduct, isLive: editingProduct.isLive === undefined ? false : !editingProduct.isLive })
                        : setNewProduct({ ...newProduct, isLive: !newProduct.isLive })
                      }
                      className={`w-14 h-7 rounded-full p-1 cursor-pointer transition-all flex items-center ${editingProduct ? (editingProduct.isLive !== false ? "bg-[#310101]" : "bg-gray-200") : (newProduct.isLive ? "bg-[#310101]" : "bg-gray-200")}`}
                    >
                      <motion.div 
                        layout
                        className="w-5 h-5 bg-white rounded-full shadow-sm"
                        animate={{ x: editingProduct ? (editingProduct.isLive !== false ? 28 : 0) : (newProduct.isLive ? 28 : 0) }}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isUploading}
                    className={`w-full py-4 rounded-2xl text-[12px] font-black uppercase tracking-[0.2em] shadow-xl mt-4 transition-all ${isUploading ? "bg-gray-300 pointer-events-none" : "bg-[#310101] text-white hover:bg-black"}`}
                  >
                    {isUploading ? "Please Wait..." : editingProduct ? "Confirm Revisions" : "Publish to Portal"}
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══ Order Tracking Modal ═══ */}
        <AnimatePresence>
          {selectedOrder && (
            <motion.div
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/30 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.9, y: 30 }} 
                animate={{ scale: 1, y: 0 }} 
                exit={{ scale: 0.9, y: 30 }}
                className="bg-[#310101] text-white w-full max-w-xl rounded-[40px] shadow-2xl p-10 relative border border-white/10"
              >
                <button onClick={() => setSelectedOrder(null)} className="absolute top-8 right-8 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
                  <X className="w-5 h-5 text-white" />
                </button>

                <div className="flex items-center gap-5 mb-8">
                  <div className="w-14 h-14 rounded-[20px] bg-white flex items-center justify-center shadow-xl">
                    <Clock className="w-7 h-7 text-[#310101]" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-serif font-black tracking-tighter italic">Tracking Detail</h2>
                    <p className="text-[11px] font-black text-white/40 uppercase tracking-[0.3em]">Fulfillment Portal • {selectedOrder.id}</p>
                  </div>
                </div>

                <div className="bg-white/5 p-7 rounded-[24px] border border-white/10 space-y-6 mb-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[11px] font-black text-[#B0843D] uppercase tracking-widest mb-1">Current Location</p>
                      <p className="text-lg font-serif italic text-white leading-snug">{selectedOrder.location}</p>
                    </div>
                    <div className={`px-4 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-widest ${
                      selectedOrder.status === "Delivered" ? "bg-green-500/20 text-green-400" :
                      selectedOrder.status === "In Transit" ? "bg-blue-500/20 text-blue-400" : "bg-orange-500/20 text-orange-400"
                    }`}>
                      {selectedOrder.status}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
                    <div>
                      <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Client</p>
                      <p className="text-[14px] font-black text-white">{selectedOrder.customer}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Volume</p>
                      <p className="text-[14px] font-black text-white">{selectedOrder.qty}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Payment</p>
                      <p className={`text-[14px] font-black ${selectedOrder.payment === "Paid" ? "text-green-400" : "text-orange-400"}`}>{selectedOrder.payment}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-7">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-white">Item Breakdown</h4>
                    <span className="text-[10px] font-black text-[#B0843D] uppercase tracking-widest bg-[#B0843D]/10 px-3 py-1 rounded-full">{selectedOrder.mix}</span>
                  </div>
                  <div className="flex items-center gap-4 p-5 bg-white/5 rounded-2xl border border-white/5">
                    <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center font-serif text-lg italic text-white">
                      {selectedOrder.item ? selectedOrder.item.charAt(0) : "P"}
                    </div>
                    <div className="flex-1">
                      <p className="font-serif italic text-base text-white">{selectedOrder.item}</p>
                      <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mt-0.5">Essential Collection</p>
                    </div>
                    <p className="text-[11px] font-black text-[#B0843D] uppercase tracking-widest">{selectedOrder.mix?.includes("Bulk") ? "SAME SKU" : "MIXED SKU"}</p>
                  </div>
                </div>

                <button onClick={() => setSelectedOrder(null)} className="w-full bg-[#B0843D] py-4 rounded-2xl font-black uppercase tracking-widest text-[12px] hover:bg-[#c2964d] transition-all shadow-xl">
                  Close Tracking View
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
};

export default AdminDashboard;

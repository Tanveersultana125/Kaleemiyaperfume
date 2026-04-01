import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const PolicyLayout = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="min-h-screen bg-[#FDFCFB]">
    <Header />
    <div className="h-24 md:h-32"></div>
    <main className="max-w-4xl mx-auto px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="font-serif text-4xl md:text-5xl text-[#310101] mb-12 border-b border-[#310101]/10 pb-8">{title}</h1>
        <div className="prose prose-stone max-w-none prose-h3:font-serif prose-h3:text-[#310101] prose-h3:text-xl prose-p:text-[#310101] prose-p:leading-relaxed prose-li:text-[#310101]">
          {children}
        </div>
      </motion.div>
    </main>
    <Footer />
  </div>
);

const ShippingInfo = () => (
  <PolicyLayout title="Shipping Information">
    <p>Kaleemiya Perfumes is committed to delivering excellence. Our shipping process reflects our dedication to premium service.</p>
    
    <h3>1. Delivery Times</h3>
    <p>Standard domestic shipping typically takes 3-5 business days. Express shipping options are available at checkout. International delivery usually ranges from 7-14 business days depending on customs.</p>
    
    <h3>2. Order Processing</h3>
    <p>All orders are processed and prepared within 24-48 hours. Orders placed on weekends or holidays will be processed on the next business day.</p>
    
    <h3>3. Tracking Your Shipment</h3>
    <p>Once your premium fragrance has been dispatched, you will receive a tracking number via email. You can also monitor your order status directly on our Track Order page.</p>
    
    <h3>4. Customs & Duties</h3>
    <p>For international orders, recipients are responsible for any customs duties or taxes applied by their local authorities.</p>
  </PolicyLayout>
);

export default ShippingInfo;

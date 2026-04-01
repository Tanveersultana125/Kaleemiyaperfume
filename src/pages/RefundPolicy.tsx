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

const RefundPolicy = () => (
  <PolicyLayout title="Refund Policy">
    <p>At Kaleemiya Perfumes, we strive to ensure you are completely satisfied with your purchase. However, if you are not, we are here to help.</p>
    
    <h3>1. Eligibility for Refund</h3>
    <p>To be eligible for a refund, the item must be unused, in its original packaging, and in the same condition as when you received it. Refunds must be requested within 14 days of the initial delivery.</p>
    
    <h3>2. Non-Refundable Items</h3>
    <p>Please note that for hygiene reasons, opened or used perfumes, attars, and other personal care items cannot be returned or refunded.</p>
    
    <h3>3. Refund Process</h3>
    <p>Once we receive and inspect your returned item, we will notify you of the status of your refund. If approved, the refund will be processed and applied to your original method of payment within 5-10 business days.</p>
    
    <h3>4. Shipping Costs</h3>
    <p>Shipping costs for returns are the responsibility of the customer and are non-refundable.</p>
  </PolicyLayout>
);

export default RefundPolicy;

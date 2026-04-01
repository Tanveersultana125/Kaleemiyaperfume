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
        <div className="prose prose-stone max-w-none prose-h3:font-serif prose-h3:text-[#310101] prose-h3:text-xl prose-p:text-[#310101] prose-p:leading-relaxed">
          {children}
        </div>
      </motion.div>
    </main>
    <Footer />
  </div>
);

const TermsOfService = () => (
  <PolicyLayout title="Terms of Service">
    <p>By accessing or using the services provided by Kaleemiya Perfumes, you agree to the following terms and conditions.</p>
    
    <h3>1. Use of Service</h3>
    <p>You agree to use our services in accordance with applicable laws and regulations. You must provide accurate and complete information when registering or making a purchase.</p>
    
    <h3>2. Intellectual Property</h3>
    <p>All content on this website, including text, images, and logos, is the property of Kaleemiya Perfumes and is protected by copyright laws. You may not reproduce or use our content without our express permission.</p>
    
    <h3>3. Order Cancellation</h3>
    <p>We reserve the right to cancel or refuse any order for any reason. You will be notified of any such cancellations via email.</p>
    
    <h3>4. Limitation of Liability</h3>
    <p>Kaleemiya Perfumes is not liable for any indirect, incidental, or consequential damages arising from the use of our products or services.</p>
  </PolicyLayout>
);

export default TermsOfService;

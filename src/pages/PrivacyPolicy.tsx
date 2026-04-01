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

const PrivacyPolicy = () => (
  <PolicyLayout title="Privacy Policy">
    <p>At Kaleemiya Perfumes, your privacy is our highest priority. This policy outlines how we collect, use, and protect your personal information.</p>
    
    <h3>1. Information Collection</h3>
    <p>We collect information you provide directly to us, such as when you create an account, make a purchase, or contact our support team. This may include your name, email address, shipping address, and payment details.</p>
    
    <h3>2. Use of Information</h3>
    <p>Your information is used to process your orders, communicate with you about your purchases, and improve our services. We do not sell or lease your personal information to third parties.</p>
    
    <h3>3. Data Security</h3>
    <p>We implement industry-standard encryption and security measures to protect your sensitive data. However, no method of transmission over the internet is 100% secure.</p>
    
    <h3>4. Cookies</h3>
    <p>We use cookies to enhance your browsing experience and analyze website traffic. You can manage your cookie preferences through your browser settings.</p>
  </PolicyLayout>
);

export default PrivacyPolicy;

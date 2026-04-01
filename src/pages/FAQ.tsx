import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "Do you offer international shipping?",
    answer: "Yes, Kaleemiya Perfumes ships to many international destinations. Shipping costs and delivery times vary by location."
  },
  {
    question: "How long does shipping take?",
    answer: "Typically, domestic orders are delivered within 3-5 business days. International orders may take 10-15 business days."
  },
  {
    question: "Are your perfumes 100% authentic?",
    answer: "Yes, all our perfumes and attars are 100% authentic and crafted with the highest quality ingredients."
  },
  {
    question: "How do I track my order?",
    answer: "Once your order is shipped, you will receive an email with a tracking number and a link to our tracking page."
  },
  {
    question: "What is your return policy?",
    answer: "We accept returns for unused items in their original packaging within 14 days of delivery. For more details, see our Refund Policy."
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#FDFCFB]">
      <Header />
      <div className="h-24 md:h-32"></div>
      <main className="max-w-4xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="font-serif text-4xl md:text-5xl text-[#310101] mb-12 border-b border-[#310101]/10 pb-8">Frequently Asked Questions</h1>
          
          <div className="space-y-6">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border-b border-[#310101]/5 pb-6">
                <button 
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  className="w-full flex items-center justify-between text-left group"
                >
                  <span className="font-serif text-lg text-[#310101] group-hover:text-[#B0843D] transition-colors">{faq.question}</span>
                  {openIndex === idx ? (
                    <Minus className="w-5 h-5 text-[#B0843D]" />
                  ) : (
                    <Plus className="w-5 h-5 text-[#310101]/80 group-hover:text-[#B0843D]" />
                  )}
                </button>
                {openIndex === idx && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-4 text-[#310101] font-sans leading-relaxed text-sm"
                  >
                    {faq.answer}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;

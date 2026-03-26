import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";

const footerLinks = {
  Shop: [
    { name: "Perfumes", href: "/shop" },
    { name: "Attar", href: "/attar" },
    { name: "Oud", href: "/oud" },
    { name: "Bakhoor", href: "/gift-sets" },
    { name: "Gift Sets", href: "/gift-sets" },
  ],
  Support: [
    { name: "Track Order", href: "#" },
    { name: "Shipping Info", href: "#" },
    { name: "Returns", href: "#" },
    { name: "FAQ", href: "#" },
  ],
  Policies: [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
    { name: "Refund Policy", href: "#" },
  ],
  Contact: [
    { name: "support@kaleemiya.com", href: "mailto:support@kaleemiya.com" },
    { name: "+91 98765 43210", href: "tel:+919876543210" },
    { name: "Hyderabad, Telangana 500001", href: "/contact" },
  ],
};

const Footer = () => {
  return (
    <footer className="relative">
      {/* Newsletter - Light Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-[#F9F6F0] max-w-full mx-auto px-4 md:px-10 lg:px-16 py-16 text-center border-b border-[#310101]/10"
      >
        <h3 className="font-serif text-2xl md:text-3xl mb-3 text-[#310101]">Join the Kaleemiya World</h3>
        <p className="text-[#310101]/70 font-sans text-sm mb-8 max-w-md mx-auto">
          Exclusive launches, artisan stories, and offers — delivered with care.
        </p>
        <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-3">
          <input
            type="email"
            placeholder="Your email address"
            className="flex-1 bg-white border border-[#310101]/20 rounded-none px-4 py-3 text-sm font-sans text-[#310101] placeholder:text-[#310101]/40 focus:outline-none focus:border-[#310101]/50 transition-colors"
          />
          <Button className="px-6 py-6 sm:py-3 text-xs tracking-[0.15em] uppercase rounded-none bg-[#310101] text-white hover:bg-[#310101]/90 w-full sm:w-auto">
            Subscribe
          </Button>
        </div>
      </motion.div>

      {/* Links & Bottom - Light Section (#F9F6F0) */}
      <div className="bg-[#F9F6F0] text-[#310101]">
        <div className="max-w-full mx-auto px-4 md:px-10 lg:px-16 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-serif text-sm md:text-base text-[#310101] mb-3 tracking-wide font-semibold">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    {link.href.startsWith("http") || link.href.startsWith("mailto") || link.href.startsWith("tel") || link.href.startsWith("#") ? (
                      <a href={link.href} className="text-[#310101]/85 font-sans text-xs hover:text-[#310101] transition-colors duration-300 break-words">
                        {link.name}
                      </a>
                    ) : (
                      <Link to={link.href} className="text-[#310101]/85 font-sans text-xs hover:text-[#310101] transition-colors duration-300">
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Area - Dark maroon section (#310101) */}
        <div className="bg-[#310101] text-[#F9F6F0]">
          <div className="max-w-full mx-auto px-4 md:px-10 lg:px-16 py-8 border-t border-[#F9F6F0]/10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col items-center md:items-start gap-4">
              <img 
                src="/logo.png" 
                alt="Kaleemiya Logo" 
                className="h-14 w-auto object-contain hover:scale-110 transition-transform duration-500 sepia-[1.2] saturate-[25] hue-rotate-[20deg] brightness-[0.95]"
              />
              <p className="text-[#F9F6F0]/60 text-xs font-sans font-medium">
                © 2026 Kaleemiya Perfumes. All rights reserved.
              </p>
            </div>
            <div className="flex items-center gap-5">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="text-[#D4AF37]/80 hover:text-[#D4AF37] transition-colors duration-300" aria-label="Social link">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

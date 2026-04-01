import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";
import productExtra1 from "@/assets/product-extra-1.png";
import productExtra2 from "@/assets/product-extra-2.png";
import productExtra3 from "@/assets/product-extra-3.png";
import productExtra4 from "@/assets/product-extra-4.png";
import productExtra5 from "@/assets/product-extra-5.png";
import productExtra6 from "@/assets/product-extra-6.png";
import tasbeeh1 from "@/assets/tasbeeh-1.png";
import tasbeeh2 from "@/assets/tasbeeh-2.jpg";
import tasbeeh3 from "@/assets/tasbeeh-3-fixed.jpg";
import tasbeeh4 from "@/assets/tasbeeh-4.png";
import tasbeeh5 from "@/assets/tasbeeh-5.jpg";
import store1 from "@/assets/store-1.jpg";
import store2 from "@/assets/store-2.jpg";
import store3 from "@/assets/store-3.jpg";
import store4 from "@/assets/store-4.jpg";
import store5 from "@/assets/store-5.jpg";
import store6 from "@/assets/store-6.jpg";
import store7 from "@/assets/store-7.jpg";

// New unique bestseller images
import imperialOud from "@/assets/imperial_oud.png";
import saffronSilk from "@/assets/saffron_silk.png";
import majesticRose from "@/assets/majestic_rose.png";
import sultansSecret from "@/assets/sultans_secret.png";
import goldenDust from "@/assets/golden_dust.png";
import royalVelvet from "@/assets/royal_velvet.png";

export interface Product {
  id: string;
  image: string;
  name: string;
  price: string;
  numericPrice: number;
  gender: "men" | "women" | "unisex";
  category: "perfumes" | "attar" | "oud" | "giftsets" | "prayer mats" | "books";
  subCategory?: string;
  isNew?: boolean;
  isBestseller?: boolean;
  bestsellerRank?: number;
  description?: string;
  highlights?: string[];
  specs?: Record<string, string>;
  stock?: number;
  status?: "In Stock" | "Low Stock" | "Out of Stock";
  isLive?: boolean;
}

export const allProducts: Product[] = [
  { id: "b1", image: imperialOud, name: "Imperial Oud", price: "₹8,499", numericPrice: 8499, gender: "unisex", category: "oud", bestsellerRank: 1, stock: 10, status: "In Stock", description: "A majestic blend of aged Cambodian Oud with hints of leather and spice." },
  { id: "b2", image: saffronSilk, name: "Saffron Silk", price: "₹4,899", numericPrice: 4899, gender: "unisex", category: "perfumes", bestsellerRank: 2, stock: 15, status: "In Stock", description: "Exotic saffron and soft silk notes for a sophisticated, warm aroma." },
  { id: "b3", image: majesticRose, name: "Majestic Rose", price: "₹3,799", numericPrice: 3799, gender: "women", category: "perfumes", bestsellerRank: 3, stock: 8, status: "In Stock", description: "True Taifi rose petals distilled into a breathtaking floral masterpiece." },
  { id: "b4", image: sultansSecret, name: "Sultan's Secret", price: "₹2,599", numericPrice: 2599, gender: "men", category: "attar", bestsellerRank: 4, stock: 20, status: "In Stock", description: "A dark, mysterious fragrance with notes of deep amber and ancient musk." },
  { id: "b5", image: goldenDust, name: "Golden Dust", price: "₹3,299", numericPrice: 3299, gender: "unisex", category: "perfumes", bestsellerRank: 5, stock: 12, status: "In Stock", description: "Sparkling citrus top notes with a base of golden amber and vanilla." },
  { id: "b6", image: royalVelvet, name: "Royal Velvet", price: "₹9,999", numericPrice: 9999, gender: "unisex", category: "oud", bestsellerRank: 6, stock: 5, status: "Low Stock", description: "A royal experience of pure deer musk and rich sandalwood." },
  { id: "b7", image: saffronSilk, name: "Silk Musk", price: "₹2,599", numericPrice: 2599, gender: "unisex", category: "perfumes", bestsellerRank: 7, stock: 15, status: "In Stock", description: "A soft, clean, and elegant white musk fragrance that feels like silk on the skin." },
  
  { 
    id: "1", 
    image: product1, 
    name: "Noor Al Attar", 
    price: "₹3,499", 
    numericPrice: 3499, 
    gender: "unisex", 
    category: "attar", 
    description: "A divine blend of white musk and pure Taifi rose, Noor Al Attar embodies the spiritual light and purity of the holy cities. This concentrated oil is designed to last for over 12 hours, leaving a trail of serenity.",
    highlights: ["Concentrated Oil (CPO)", "100% Alcohol-Free", "Long-lasting (12h+)", "Hand-finished bottle"],
    specs: { "Volume": "12ml", "Origin": "Taif, Saudi Arabia", "Base": "White Musk", "Notes": "Rose, Amber, Vanilla" },
    stock: 12,
    status: "In Stock"
  },
  { id: "2", image: product2, name: "Sultan Al Oud", price: "₹2,799", numericPrice: 2799, gender: "men", category: "oud", stock: 5, status: "Low Stock" },
  { id: "3", image: product3, name: "Oud Al Malikah", price: "₹5,999", numericPrice: 5999, gender: "women", category: "oud", stock: 0, status: "Out of Stock" },
  { id: "4", image: product4, name: "Bakhoor Al Dar", price: "₹1,899", numericPrice: 1899, gender: "unisex", category: "giftsets", stock: 24, status: "In Stock" },

  { id: "5", image: product5, name: "Rose Taifi", price: "₹4,299", numericPrice: 4299, gender: "women", category: "attar", isNew: true },
  { id: "6", image: product6, name: "Musk Al Madinah", price: "₹2,199", numericPrice: 2199, gender: "unisex", category: "attar" },
  { id: "7", image: product1, name: "Gentleman's Oud", price: "₹4,199", numericPrice: 4199, gender: "men", category: "oud" },
  { id: "8", image: product2, name: "Desert Rose", price: "₹3,199", numericPrice: 3199, gender: "women", category: "perfumes" },
  { id: "9", image: product3, name: "Midnight Musk", price: "₹2,599", numericPrice: 2599, gender: "men", category: "attar", isNew: true },
  { id: "10", image: product4, name: "Golden Attar", price: "₹1,599", numericPrice: 1599, gender: "unisex", category: "attar" },
  { id: "11", image: product5, name: "Princess Oud", price: "₹5,499", numericPrice: 5499, gender: "women", category: "oud" },
  { id: "12", image: product6, name: "Emperor's Choice", price: "₹6,999", numericPrice: 6999, gender: "men", category: "oud" },
  { id: "13", image: product1, name: "Noorique", price: "₹4,999", numericPrice: 4999, gender: "unisex", category: "perfumes", isNew: true },
  { id: "14", image: product2, name: "Oudify", price: "₹5,299", numericPrice: 5299, gender: "unisex", category: "oud" },
  { id: "15", image: product3, name: "Jannat Fragrances", price: "₹6,499", numericPrice: 6499, gender: "women", category: "perfumes" },
  { id: "16", image: product4, name: "Barakah Oud", price: "₹7,899", numericPrice: 7899, gender: "unisex", category: "oud" },
  { id: "17", image: product5, name: "Khalifa Fragrance", price: "₹8,999", numericPrice: 8999, gender: "men", category: "perfumes" },
  { id: "18", image: product6, name: "Al Rehan Attar", price: "₹2,999", numericPrice: 2999, gender: "unisex", category: "attar" },
  { id: "19", image: product1, name: "Royal Madinah Musk", price: "₹4,599", numericPrice: 4599, gender: "unisex", category: "attar" },
  { id: "20", image: product2, name: "Al Khaas Oud", price: "₹9,999", numericPrice: 9999, gender: "men", category: "oud", isNew: true },
  { id: "21", image: productExtra1, name: "Premium Gift Set", price: "₹12,499", numericPrice: 12499, gender: "unisex", category: "giftsets", bestsellerRank: 0 },
  { id: "22", image: productExtra2, name: "Islamic Car Diffuser", price: "₹3,999", numericPrice: 3999, gender: "unisex", category: "giftsets", isNew: true },
  { id: "23", image: productExtra3, name: "Majestic Scent Tray", price: "₹15,999", numericPrice: 15999, gender: "unisex", category: "giftsets" },
  { id: "24", image: productExtra4, name: "Pearl Oud Box", price: "₹18,999", numericPrice: 18999, gender: "unisex", category: "giftsets" },
  { id: "25", image: productExtra5, name: "Modern Leather Diffuser", price: "₹5,499", numericPrice: 5499, gender: "unisex", category: "giftsets", isNew: true },
  { id: "26", image: productExtra6, name: "Pure Khus Special", price: "₹4,999", numericPrice: 4999, gender: "unisex", category: "attar" },
  { 
    id: "27", 
    image: tasbeeh1, 
    name: "Elite Digital Ring Counter", 
    price: "₹1,499", 
    numericPrice: 1499, 
    gender: "unisex", 
    category: "giftsets", 
    subCategory: "tasbeeh", 
    isNew: true,
    description: "The next generation of spiritual tools. This smart ring Tasbeeh featuring a high-contrast OLED display and vibration alerts for milestones (33, 66, 99, 100). Crafted with premium aviation-grade aluminum.",
    highlights: ["Bluetooth App Sync", "OLED Display", "Vibration Alerts", "3-Day Battery Life"],
    specs: { "Material": "Aviation Aluminum", "Display": "OLED Smart Screen", "Charging": "USB Type-C", "Waterproof": "IP67 Rated" }
  },
  { 
    id: "28", 
    image: tasbeeh2, 
    name: "Royal Wood-Grain Counter", 
    price: "₹899", 
    numericPrice: 899, 
    gender: "unisex", 
    category: "giftsets", 
    subCategory: "tasbeeh",
    description: "Elegance meets technology. A digital tally counter finished in a rich, warm wood-grain texture. Features a silent-press mechanism for discreet use in masjid or gatherings.",
    highlights: ["Silent-Click Technology", "Eco-friendly Wood Finish", "Ergonomic Design", "Large LCD Screen"],
    specs: { "Material": "ABS with Wood-Grain Coating", "Battery": "CR2032 (Replaceable)", "Max Count": "99,999", "Weight": "25g" }
  },
  { 
    id: "29", 
    image: tasbeeh3, 
    name: "Crystal Luxe Tasbeeh Set", 
    price: "₹1,999", 
    numericPrice: 1999, 
    gender: "unisex", 
    category: "giftsets", 
    subCategory: "tasbeeh", 
    isNew: true,
    description: "A complete spiritual gifting set. Each set includes a crystal-encrusted digital counter paired with a matching 33-bead pearl Tasbeeh, presented in a luxury floating display box.",
    highlights: ["Complete Gifting Set", "Floating Display Box", "Handcrafted Beads", "SWAROVSKI-style Crystals"],
    specs: { "Set Includes": "Digital Counter + 33-Bead Tasbeeh", "Box Type": "Floating Silicone Display", "Material": "Synthetic Pearl & Crystal", "Colors": "Available in Red, White, Blue, Pink" }
  },
  { 
    id: "30", 
    image: tasbeeh4, 
    name: "Diamond Sparkle Counter", 
    price: "₹1,299", 
    numericPrice: 1299, 
    gender: "unisex", 
    category: "giftsets", 
    subCategory: "tasbeeh",
    description: "Shine in your shop with this brilliant, diamond-encrusted tally counter. Perfect for special occasions or as a high-value gift for loved ones.",
    highlights: ["Premium Crystal Inlay", "Adjustable Silicone Strap", "Energy Saving Mode", "Gift-ready Packaging"],
    specs: { "Bead Count": "Digital", "Crystal Type": "Premium Grade AAA", "Strap": "Medical-Grade Silicone", "Reset": "Manual Lock Button" }
  },
  { 
    id: "31", 
    image: tasbeeh5, 
    name: "Heritage Wooden Beads", 
    price: "₹799", 
    numericPrice: 799, 
    gender: "unisex", 
    category: "giftsets", 
    subCategory: "tasbeeh",
    description: "Traditional 99-bead Tasbeeh handcrafted from individual wood varieties. Each bead carries the natural aroma and grain of its source tree, offering a grounding tactile experience.",
    highlights: ["99 Handmade Beads", "Natural Wood Aroma", "Reinforced Silk Thread", "Traditional Hand-tie Imam Bead"],
    specs: { "Wood Types": "Sandalwood, Ebony, Rosewood Mix", "Length": "14 inches", "Diameter": "8mm Beads", "Origin": "Artisan Crafted" }
  },
  { 
    id: "32", 
    image: "/prayer-mat-1.png", 
    name: "Medina Heritage Janamaz", 
    price: "₹1,499", 
    numericPrice: 1499, 
    gender: "unisex", 
    category: "prayer mats",
    description: "Inspired by the motifs of the Prophet's Mosque, this premium prayer mat features a soft, plush pile that provides exceptional comfort during Salah. Its non-slip base ensures stability on any surface.",
    highlights: ["Plush Foam Filling", "Classic Islamic Art Motif", "Sleek Non-Slip Backing", "Standard Full-Size (70x120cm)"],
    specs: { "Material": "Mercerized Cotton & Velvet", "Origin": "Turkey", "Thickness": "6mm", "Washable": "Dry Clean Recommended" }
  },
  { 
    id: "33", 
    image: "/prayer-mat-2.png", 
    name: "Luxury Velvet Floral Mat", 
    price: "₹2,299", 
    numericPrice: 2299, 
    gender: "unisex", 
    category: "prayer mats",
    isNew: true,
    description: "A masterpiece of weaving, this mat combines luxury velvet with intricate floral embossing. Designed for those who seek elegance and extra cushioning for their joints.",
    highlights: ["High-Density Velvet", "Embossed Floral Borders", "Ornate Tassel Finishes", "Joint Comfort Cushioning"],
    specs: { "Material": "Luxury Velvet", "Weave": "Jacquard", "Dimensions": "80x130cm", "Weight": "1.2kg" }
  },
  { 
    id: "34", 
    image: "/prayer-mat-3.png", 
    name: "Artisan Turkish Sejjada", 
    price: "₹1,899", 
    numericPrice: 1899, 
    gender: "unisex", 
    category: "prayer mats",
    description: "Hand-finished prayer mat from the heart of Bursa. Features traditional Ottoman geometry and a rich color palette that symbolizes spiritual heritage.",
    highlights: ["Traditional Ottoman Pattern", "Durable Silk-Cotton Blend", "Fringe Detail", "Authentic Turkish Craftsmanship"]
  },
  { 
    id: "35", 
    image: "/islamic-books.png", 
    name: "The Sealed Nectar", 
    price: "₹850", 
    numericPrice: 850, 
    gender: "unisex", 
    category: "books",
    subCategory: "english",
    description: "A complete authoritative book on the life of Prophet Muhammad (S) by Sheikh Safi-ur-Rahman al-Mubarkpuri. Translated into English, it offers a detailed and chronological account of Islamic history.",
    highlights: ["Award Winning Biography", "Hardcover Edition", "Translated to English", "Authentic References"],
    specs: { "Author": "Safi-ur-Rahman al-Mubarkpuri", "Pages": "580", "Binding": "Hardcover", "Language": "English" }
  },
  { 
    id: "36", 
    image: "/islamic-books.png", 
    name: "Hisnul Muslim (Roman)", 
    price: "₹199", 
    numericPrice: 199, 
    gender: "unisex", 
    category: "books",
    subCategory: "roman",
    description: "The complete pocket-sized guide to daily duas and supplications. This Roman transliterated edition is perfect for those who want to memorize and recite authentic duas from the Sunnah.",
    highlights: ["Pocket Sized", "Roman Transliteration", "English Translation Included", "Daily Protection Duas"]
  },
  { 
    id: "37", 
    image: "/islamic-books.png", 
    name: "Riyad us-Saliheen", 
    price: "₹1,200", 
    numericPrice: 1200, 
    gender: "unisex", 
    category: "books",
    subCategory: "english",
    isNew: true,
    description: "Compiled by Imam An-Nawawi, this 2-volume set contains over 1,800 Hadiths covering ethics, behavior, and the path of righteousness.",
    highlights: ["2 Volume Deluxe Set", "Original Arabic + English", "Thematic Categorization", "Essential Hadith Collection"],
    specs: { "Volumes": "2", "Binding": "Leather Bound Style", "Weight": "2.1kg" }
  },
  { 
    id: "38", 
    image: "/islamic-books.png", 
    name: "Prophet's Prayer Guide", 
    price: "₹450", 
    numericPrice: 450, 
    gender: "unisex", 
    category: "books",
    subCategory: "english",
    description: "A step-by-step guide to the Salah according to the authentic Sunnah of Rasulullah (S). Includes illustrations and evidences for every posture.",
    highlights: ["Step-by-Step Guide", "Authentic Hadith Evidence", "Clear Illustrations", "Ideal for Beginners"]
  }
];

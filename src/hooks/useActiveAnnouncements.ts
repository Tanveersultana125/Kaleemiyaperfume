import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query } from "firebase/firestore";

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: string;
  startDate: string;
  endDate: string;
  targetCategory: string;
  targetSubCategory: string;
  discountPercent: string;
}

export const useActiveAnnouncements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    const q = query(collection(db, "news"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allNews = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Announcement));

      const now = new Date();
      now.setHours(0, 0, 0, 0);

      const active = allNews.filter(item => {
        const start = item.startDate ? new Date(item.startDate) : null;
        const end = item.endDate ? new Date(item.endDate) : null;
        
        if (start) start.setHours(0, 0, 0, 0);
        if (end) end.setHours(23, 59, 59, 999);

        const isStarted = !start || now >= start;
        const isNotExpired = !end || now <= end;
        
        return isStarted && isNotExpired;
      });

      setAnnouncements(active);
    });

    return () => unsubscribe();
  }, []);

  const getDiscountForProduct = (productCategory: string, productSubCategory?: string) => {
    // Find the best discount percentage applicable to this product category/sub-category
    let maxDiscount = 0;

    announcements.forEach(ann => {
      const percent = parseInt(ann.discountPercent) || 0;
      if (percent <= 0) return;

      const catMatch = ann.targetCategory === "All" || ann.targetCategory.toLowerCase() === productCategory.toLowerCase();
      const subCatMatch = ann.targetSubCategory === "All" || ann.targetSubCategory.toLowerCase() === (productSubCategory || "").toLowerCase();

      if (catMatch && subCatMatch) {
         if (percent > maxDiscount) maxDiscount = percent;
      }
    });

    return maxDiscount;
  };

  return { announcements, getDiscountForProduct };
};

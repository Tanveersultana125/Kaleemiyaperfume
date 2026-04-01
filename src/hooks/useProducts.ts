import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, addDoc, updateDoc, deleteDoc, doc, Timestamp } from "firebase/firestore";

export interface Product {
    id: string;
    name: string;
    price: string;
    discountPrice?: string;
    numericPrice: number;
    category: string;
    subCategory?: string;
    gender: string;
    image: string;
    section?: string;
    stock?: number;
    status?: string;
    isLive?: boolean;
    isNew?: boolean;
    isBestseller?: boolean;
    description?: string;
    highlights?: string[];
    specs?: Record<string, string>;
    createdAt?: any;
    isFallback?: boolean;
}

export const BOUTIQUE_FALLBACKS: Product[] = [];

export const useProducts = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, "products"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const productList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Product));
            
            if (productList.length > 0) {
                setProducts(productList);
            } else {
                setProducts(BOUTIQUE_FALLBACKS);
            }
            
            setLoading(false);
        }, (error) => {
            console.error("Error fetching products:", error);
            setProducts(BOUTIQUE_FALLBACKS);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const addProduct = async (product: Omit<Product, "id">) => {
        try {
            await addDoc(collection(db, "products"), {
                ...product,
                createdAt: Timestamp.now()
            });
        } catch (error) {
            console.error("Error adding product:", error);
            throw error;
        }
    };

    const updateProduct = async (updatedProduct: Product) => {
        try {
            const productRef = doc(db, "products", updatedProduct.id);
            const { id, isFallback, ...data } = updatedProduct;
            await updateDoc(productRef, data);
        } catch (error) {
            console.error("Error updating product:", error);
            throw error;
        }
    };

    const deleteProduct = async (id: string) => {
        try {
            await deleteDoc(doc(db, "products", id));
        } catch (error) {
            console.error("Error deleting product:", error);
            throw error;
        }
    };

    return { products, loading, addProduct, updateProduct, deleteProduct };
};

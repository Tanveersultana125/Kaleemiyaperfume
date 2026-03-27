import { useState, useEffect } from "react";
import { allProducts, Product } from "@/data/products";

export const getStoredProducts = (): Product[] => {
  const stored = localStorage.getItem("kaleemiya_products");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Failed to parse stored products", e);
    }
  }
  return allProducts;
};

export const saveStoredProducts = (products: Product[]) => {
  localStorage.setItem("kaleemiya_products", JSON.stringify(products));
  window.dispatchEvent(new Event("products_updated"));
};

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>(getStoredProducts());

  useEffect(() => {
    const handleStorageChange = () => {
      setProducts(getStoredProducts());
    };

    window.addEventListener("products_updated", handleStorageChange);
    window.addEventListener("storage", handleStorageChange); // To listen across tabs

    return () => {
      window.removeEventListener("products_updated", handleStorageChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const addProduct = (product: Omit<Product, "id">) => {
    const newProducts = [...products, { ...product, id: Math.random().toString(36).substr(2, 9) }];
    setProducts(newProducts);
    saveStoredProducts(newProducts);
  };

  const updateProduct = (updatedProduct: Product) => {
    const newProducts = products.map(p => p.id === updatedProduct.id ? updatedProduct : p);
    setProducts(newProducts);
    saveStoredProducts(newProducts);
  };

  const deleteProduct = (id: string) => {
    const newProducts = products.filter(p => p.id !== id);
    setProducts(newProducts);
    saveStoredProducts(newProducts);
  };

  return { products, addProduct, updateProduct, deleteProduct };
};

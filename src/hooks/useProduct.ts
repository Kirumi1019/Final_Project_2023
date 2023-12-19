import { useState } from "react";

import {useRouter} from 'next/navigation';

export default function useProduct() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();


  const createProduct = async ({
    productName,
    description,
    price,
    inventory,
    sellerID,
    categoryID,
  }: {
    productName: string;
    description: string;
    price: number;
    inventory: number;
    sellerID: string;
    categoryID: string;
  }) => {
    setLoading(true);
    const res = await fetch(`/api/products`, {
      method: "POST",
      body: JSON.stringify({
        productName,
        description,
        price,
        inventory,
        sellerID,
        categoryID,
        
      }),
    });

    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error);
    }

    // router.refresh() is a Next.js function that refreshes the page without
    // reloading the page. This is useful for when we want to update the UI
    // from server components.
    router.refresh();
    setLoading(false);
  };

  const updateProduct = async ({
    productId,
    productName,
    productDescription,
    productPrice,
    productInv
  }: {
    productId: string;
    productName: string;
    productPrice: number;
    productInv: number
    productDescription: string;
  }) => {
    setLoading(true);

    const res = await fetch(`/api/products`, {
      method: "PUT",
      body: JSON.stringify({
        productId,
        productName,
        productPrice,
        productDescription,
        productInv,
        
      }),
    });

    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error);
    }

    // router.refresh() is a Next.js function that refreshes the page without
    // reloading the page. This is useful for when we want to update the UI
    // from server components.
    router.refresh();
    setLoading(false);
  };
  
  const deleteProduct = async ({
    productId,
  }: {
    productId: string;
  }) => {
    if (loading) return;

    setLoading(true);
    const res = await fetch("/api/products", {
      method: "DELETE",
      body: JSON.stringify({
        productId
      }),
    });

    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error);
    }

    router.refresh();
    setLoading(false);
  };

  return {
    createProduct,
    updateProduct,
    deleteProduct,
    loading,
  };
}




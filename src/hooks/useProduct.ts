import { useState } from "react";

import { useRouter } from "next/navigation";

export default function useProduct() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const postProduct = async ({
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

    const res = await fetch("/api/products", {
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

  return {
    postProduct,
    loading,
  };
}

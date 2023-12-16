import { useState } from "react";

import { useRouter } from "next/navigation";

export default function useOrder() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const postOrder = async ({
    buyerId,
    productId,
    quantity,
  }: {
    buyerId: string;
    quantity: number;
    productId: string;
  }) => {
    setLoading(true);

    const res = await fetch("/api/orders", {
      method: "POST",
      body: JSON.stringify({
        buyerId,
        productId,
        quantity,
        
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
    postOrder,
    loading,
  };
}

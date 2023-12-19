import { useState } from "react";

import { useRouter } from "next/navigation";

export default function useComplete() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const postComplete = async ({
    orderId,
    transactionStatus
  }: {
    orderId: string;
    transactionStatus: string;
  }) => {
    setLoading(true);

    const res = await fetch("/api/complete", {
      method: "POST",
      body: JSON.stringify({
        orderId,
        transactionStatus,
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
    postComplete,
    loading,
  };
}

import { useState } from "react";

import { useRouter } from "next/navigation";

export default function useReport() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const postReport = async ({
    reporterID,
    suspectID,
    reportDescription,
  }: {
    reporterID: string;
    suspectID: string;
    reportDescription: string;
  }) => {
    setLoading(true);

    const res = await fetch("/api/reports", {
      method: "POST",
      body: JSON.stringify({
        reporterID,
        reportDescription,
        suspectID,        
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
    postReport,
    loading,
  };
}

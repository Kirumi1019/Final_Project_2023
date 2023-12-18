import { useState } from "react";

import { useRouter } from "next/navigation";
import { isInterestedInTable } from "@/db/schema";
import { db } from "@/db";

export default function useLike() {
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const postLike = async ({
    userId,
    productId,
  }: {
    userId: string;
    productId: string;
  }) => {
    setLoading(true);

    const res = await fetch("/api/likes", {
      method: "POST",
      body: JSON.stringify({
        userId,
        productId,      
      }),
    });


    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error);
    }

    router.refresh();
    setLoading(false);
  };


  const deleteLike = async ({
    userId,
    productId,
  }: {
    userId: string;
    productId: string;
  }) => {
    setLoading(true);

    const res = await fetch("/api/likes", {
      method: "DELETE",
      body: JSON.stringify({
        userId,
        productId,      
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

  // const getLike = async ({
  //   userId,
  //   productId,
  // }: {
  //   userId: string;
  //   productId: string;
  // }) => {
  //   setLoading(true);

  //   const res = await fetch("/api/likes", {
  //     method: "GET",
  //     body: JSON.stringify({
  //       userId,
  //       productId,      
  //     }),
  //   });

  //   if (!res.ok) {
  //     const body = await res.json();
  //     throw new Error(body.error);
  //   }

  //   // router.refresh() is a Next.js function that refreshes the page without
  //   // reloading the page. This is useful for when we want to update the UI
  //   // from server components.
  //   router.refresh();
  //   setLoading(false);
  // }

  return {
    postLike,
    deleteLike,
    // getLike,
    loading,
  };
}

import { useState } from "react";

import {useRouter} from 'next/navigation';

export default function useMember() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const updateMember = async ({
    schoolId,
    realname,
    password,
    phone,
    username
  }: {
    schoolId: string;
    realname: string;
    password: string;
    phone: string;
    username: string;
  }) => {
    setLoading(true);

    const res = await fetch(`/api/members`, {
      method: "PUT",
      body: JSON.stringify({
        schoolId,
        realname,
        password,
        phone,
        username,
        
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
    updateMember,
    loading,
  };
}




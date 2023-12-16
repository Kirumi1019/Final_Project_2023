
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { publicEnv } from "@/lib/env/public";

import ToProducts from "./ToProducts";

async function Navbar() {
  const session = await auth();
  if (!session || !session?.user?.id) {
    redirect(publicEnv.NEXT_PUBLIC_BASE_URL);
  }

  const username = session.user.username;

  return (
    <div className="w-full">
      <nav className="sticky top-0 w-full border bg-slate-100 p-3">Hello, {username}</nav>
      <Link href={'/'}>
        <Button>Log out</Button>
      </Link>
      
      <section>
        <ToProducts />
      </section>
    </div>
  );
}

export default Navbar;


import { Button } from "@/components/ui/button";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { publicEnv } from "@/lib/env/public";

import Menu from "./Menu";

async function Navbar() {
  const session = await auth();
  if (!session || !session?.user?.id) {
    redirect(publicEnv.NEXT_PUBLIC_BASE_URL);
  }

  const username = session.user.username;

  return (
    <div className="w-full">
      <nav className="sticky flex flex-around content-center top-0 w-full border bg-slate-100 p-3">
        Hello, {username}
      </nav>

      
      <section className="h-full flex flex-col justify-around m-3">

      <div>
          <Link href={'/'}>
            <Button>Log out</Button>
          </Link>
      </div>
      <Menu />
        
      </section>
    </div>
  );
}

export default Navbar;

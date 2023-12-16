import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { publicEnv } from "@/lib/env/public";
import Link from "next/link";
import { redirect } from "next/navigation";

async function Menu() {
  const session = await auth();
  if (!session || !session?.user?.id) {
    redirect(publicEnv.NEXT_PUBLIC_BASE_URL);
  }

  const id = session.user.id;
  return (
    <>
      <div className="w-full">
      買家功能
      </div>

      <div className="w-full">
      <Link href={'/mainPage/Products'}>
        <Button>All Products</Button>
      </Link>
      </div>

      <div className="w-full">
      <Link href={`/mainPage/${id}/Orders`}>
        <Button>My Orders</Button>
      </Link>
      </div>

      <div className="w-full">
      賣家功能
      </div>

      <div className="w-full">
      <Link href={`/mainPage/${id}/MyProducts`}>
        <Button>My Products</Button>
      </Link>
      </div>

      <div className="w-full">
      <Link href={`/mainPage/${id}/Transactions`}>
        <Button>My Transaction</Button>
      </Link>
      </div>

      <div className="w-full">
      <Link href={`/mainPage/${id}/Reports`}>
        <Button>Report Buyer</Button>
      </Link>
      </div>
    </>
    
    
  );
}

export default Menu;
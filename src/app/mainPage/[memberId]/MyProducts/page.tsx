import { auth } from "@/lib/auth";
import { publicEnv } from "@/lib/env/public";
import { redirect } from "next/navigation";
import { getMyProducts } from "../../_components/actions";

async function MyProducts() {
  const session = await auth();
  if (!session || !session?.user?.id) {
    redirect(publicEnv.NEXT_PUBLIC_BASE_URL);
  }
  const userId = session.user.id;
  const myProducts = await getMyProducts(userId);

  return (
    <div>
      <h1>MyProducts</h1>
      {myProducts.map((myProduct)=>{
          return <div>{myProduct.productName} / {myProduct.price} / {myProduct.inventory}</div>
        })}
    </div>
  );
}
export default MyProducts;

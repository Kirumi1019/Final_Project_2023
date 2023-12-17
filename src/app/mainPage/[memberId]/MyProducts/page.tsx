import { auth } from "@/lib/auth";
import { publicEnv } from "@/lib/env/public";
import { redirect } from "next/navigation";
import { getMyProducts } from "../../_components/actions";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";


async function MyProducts() {
  const session = await auth();
  if (!session || !session?.user?.id) {
    redirect(publicEnv.NEXT_PUBLIC_BASE_URL);
  }
  const userId = session.user.id;
  const myProducts = await getMyProducts(userId);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/2">Product Name</TableHead>
            <TableHead className="w-1/3">Price</TableHead>
            <TableHead className="w-1/4">In-stock</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {myProducts.map((myProduct) => (
            <TableRow key={myProduct.productID}>
              <TableCell className="font-medium">{myProduct.productName}</TableCell>
              <TableCell>{myProduct.price} NTD</TableCell>
              <TableCell>{myProduct.inventory}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}
export default MyProducts;

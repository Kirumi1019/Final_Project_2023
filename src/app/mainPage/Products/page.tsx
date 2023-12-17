import { getProducts } from "../_components/actions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Buy from "./Buy";
import { auth } from "@/lib/auth";
import { publicEnv } from "@/lib/env/public";
import { redirect } from "next/navigation";




async function Products() {

  const products = await getProducts();
  const session = await auth();
  if (!session || !session?.user?.id) {
    redirect(publicEnv.NEXT_PUBLIC_BASE_URL);
  }
  const userId = session.user.id;
  return (
    <>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Product Name</TableHead>
            <TableHead>Product Description</TableHead>
            <TableHead>Product Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.productID}>
              <TableCell className="font-medium">{product.productName}</TableCell>
              <TableCell>{product.description}</TableCell>
              <TableCell>{product.price} NTD</TableCell>
              <TableCell><Buy userId={userId} productId={product.productID} productName={product.productName} productPrice={product.price} /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>

  );
}
export default Products;




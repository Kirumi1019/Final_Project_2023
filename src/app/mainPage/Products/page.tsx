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
import Like from "./Like";

import { auth } from "@/lib/auth";
import { publicEnv } from "@/lib/env/public";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { and, eq, isNotNull } from "drizzle-orm";
import { isInterestedInTable } from "@/db/schema";

async function Products() {
      
  const products = await getProducts();
    const session = await auth();
    if (!session || !session?.user?.id) {
        redirect(publicEnv.NEXT_PUBLIC_BASE_URL);
    }
    const userId = session.user.id;


    const getinitialLike = async (productId:string) =>
    {
      const exist = await db
      .select({
        userid: isInterestedInTable.memberID
      })
      .from(isInterestedInTable)
      .where(
        and(
          eq(isInterestedInTable.memberID, userId),
          eq(isInterestedInTable.productID, productId),
        )
      )
      .execute();
      // console.log(exist);
      // console.log(exist.length);
      if(exist.length != 0)
      {
        // console.log(true);
        return true;
      }
      else{
        // console.log(false);
        return false;
      }
    }
    

    return (
      <>
        
            <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Product Name</TableHead>
          <TableHead>Product Description</TableHead>
          <TableHead>Product Price</TableHead>
          <TableHead>Product Inventory</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.productID}>
            <TableCell className="font-medium">{product.productName}</TableCell>
            <TableCell>{product.description}</TableCell>
            <TableCell>{product.price} NTD</TableCell>
            <TableCell>{product.inventory}</TableCell>
            <TableCell><Buy userId={userId} productId={product.productID} productName={product.productName} productPrice={product.price} productInv={product.inventory}/></TableCell>
            <TableCell><Like initialLike={Boolean(getinitialLike(product.productID))} userId={userId} productId={product.productID}/></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
      </>
      
    );
  }
  export default Products;




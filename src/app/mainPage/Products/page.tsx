import { getProducts } from "../_components/actions";
import {
  Table,
  TableBody,
  TableCaption,
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
import { and, eq, sql } from "drizzle-orm";
import { isInterestedInTable } from "@/db/schema";
import { boolean } from "drizzle-orm/mysql-core";

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
      
      if(exist)
      {
        return true;
      }
      else{
        return false;
      }
    }
    

    return (
      <>
        
            <Table>
      <TableCaption>A list of all products</TableCaption>
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
            <TableCell><Buy userId={userId} productId={product.productID} productName={product.productName} productPrice={product.price}/></TableCell>
            <TableCell><Like initialLike={getinitialLike(product.productID)} userId={userId} productId={product.productID}/></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
      </>
      
    );
  }
  export default Products;



  
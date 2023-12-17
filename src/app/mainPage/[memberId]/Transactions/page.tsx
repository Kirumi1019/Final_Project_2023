import { db } from "@/db";
import { ordersContainTable, ordersTable, productTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { publicEnv } from "@/lib/env/public";
import { eq, sum } from "drizzle-orm";
import { redirect } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

async function Transactions() {
  const session = await auth();
  if (!session || !session?.user?.id) {
    redirect(publicEnv.NEXT_PUBLIC_BASE_URL);
  }
  const userId = session.user.id;

  const innerQuery = await db.select({
    productId: productTable.productID,
    productName: productTable.productName,
  }).from(productTable)
  .where(eq(productTable.sellerID, userId))
  .as("sellingList")

  const myTransactions = await db.select({
    orderContain_productId: ordersContainTable.productId,
    sellingList_productName: innerQuery.productName,
    sellingNum: sum(ordersContainTable.quantity)
  })
  .from(ordersContainTable)
  .innerJoin(innerQuery, eq(ordersContainTable.productId, innerQuery.productId))
  .groupBy(ordersContainTable.productId, innerQuery.productName)

  return (
    //myTransactions.map((item)=>{
      //return(
        <div>
          <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Quantity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {myTransactions.map((item) => (
              <TableRow key={item.sellingList_productName}>
                <TableCell>{item.sellingList_productName}</TableCell>
                <TableCell>{item.sellingNum}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          </Table>
        </div>
        //<div>{item.sellingList_productName} / {item.sellingNum}</div>
      )
    //})
  //);
}
export default Transactions;

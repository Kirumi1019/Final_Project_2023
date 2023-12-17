import { ordersContainTable, ordersTable, productTable } from "@/db/schema";
import { db } from "@/db";
import { auth } from "@/lib/auth";
import { publicEnv } from "@/lib/env/public";
import { redirect } from "next/navigation";
import { eq, and, isNotNull, sql } from "drizzle-orm";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";


async function Orders() {

  const session = await auth();
  if (!session || !session?.user?.id) {
    redirect(publicEnv.NEXT_PUBLIC_BASE_URL);
  }
  const userId = session.user.id;

  const myOrders = await db.select({
    order_BuyerId: ordersTable.buyerId,
    product_ProductName: productTable.productName,
    product_Price: productTable.price,
    ordersContain_Quantity: ordersContainTable.quantity,
    ordersContain_OrderId: ordersContainTable.orderId,
    order_Timestamp: ordersTable.placeOrderDate,
  }).from(ordersContainTable)
    .innerJoin(ordersTable, eq(ordersTable.orderId, ordersContainTable.orderId))
    .innerJoin(productTable, eq(productTable.productID, ordersContainTable.productId))
    .where(and(eq(ordersTable.buyerId, userId), isNotNull(productTable.price)))
    .orderBy(sql`${productTable.price} * ${ordersContainTable.quantity} DESC`)

  return (
    <div>
    <Table>
    <TableHeader>
      <TableRow>
        <TableHead className="w-[100px]">Order Date</TableHead>
        <TableHead>Product</TableHead>
        <TableHead>Quantity</TableHead>
        <TableHead>Price Total</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {myOrders.map((item) => (
        <TableRow key={item.ordersContain_OrderId}>
          <TableCell className="font-medium">{item.order_Timestamp?.toLocaleDateString()} </TableCell>
          <TableCell>{item.product_ProductName}</TableCell>
          <TableCell>{item.ordersContain_Quantity}</TableCell>
          <TableCell>{item.ordersContain_Quantity * item.product_Price}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
  </div>
  )

};

export default Orders;
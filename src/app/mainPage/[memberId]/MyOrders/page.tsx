import { deliveryTable, membersTable, ordersContainTable, ordersTable, productTable } from "@/db/schema";
import { db } from "@/db";
import { auth } from "@/lib/auth";
import { publicEnv } from "@/lib/env/public";
import { redirect } from "next/navigation";
import { eq, and, isNotNull, sql } from "drizzle-orm";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import Complete from "./complete";



async function Orders() {

  const session = await auth();
  if (!session || !session?.user?.id) {
    redirect(publicEnv.NEXT_PUBLIC_BASE_URL);
  }
  const userId = session.user.id;

  const myOrders = await db.select({

    order_BuyerId: ordersTable.buyerId,
    order_BuyerName: membersTable.name,
    product_ProductName: productTable.productName,
    product_Price: productTable.price,
    ordersContain_Quantity: ordersContainTable.quantity,
    ordersLocation: deliveryTable.doneDliveryLocation,
    ordersMethod: deliveryTable.deliveryMethod,
    order_Timestamp: ordersTable.placeOrderDate,
    order_Status: ordersTable.transactionStatus,
    ordersContain_OrderId: ordersTable.orderId,
  }).from(ordersContainTable)
    .innerJoin(ordersTable, eq(ordersTable.orderId, ordersContainTable.orderId))
    .innerJoin(productTable, eq(productTable.productID, ordersContainTable.productId))
    .innerJoin(deliveryTable, eq(deliveryTable.orderId, ordersTable.orderId))
    .innerJoin(membersTable, eq(ordersTable.buyerId,membersTable.schoolID))
    .where(eq(productTable.sellerID, userId))
    .orderBy(sql`${ordersTable.placeOrderDate} DESC`)

  return (
    <div>
    <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Buyer School ID</TableHead>
        <TableHead>Buyer Name</TableHead>
        <TableHead>Product</TableHead>
        <TableHead>Quantity</TableHead>
        <TableHead>Price Total</TableHead>
        <TableHead>Order Date</TableHead>
        <TableHead>Transaction Status</TableHead>
        <TableHead>Change Transaction Status</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {myOrders.map((item) => (
        <TableRow key={item.ordersContain_OrderId}>
          <TableCell>{item.order_BuyerId}</TableCell>
          <TableCell>{item.order_BuyerName}</TableCell>
          <TableCell>{item.product_ProductName}</TableCell>
          <TableCell>{item.ordersContain_Quantity}</TableCell>
          <TableCell>{item.ordersContain_Quantity * item.product_Price}</TableCell>
          <TableCell className="font-medium">{item.order_Timestamp?.toLocaleDateString()} </TableCell>
          <TableCell>{item.order_Status}</TableCell>
          <TableCell>{item.order_Status != "Cancel" && <Complete orderId={item.ordersContain_OrderId} transactionStatus={item.order_Status}></Complete>}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
  </div>
  )

};

export default Orders;
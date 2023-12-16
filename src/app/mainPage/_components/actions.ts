import { eq } from "drizzle-orm";

import { db } from "@/db";
import { membersTable } from "@/db/schema";

// export const createProduct = async (userId: string) => {
//   "use server";
//   console.log("[createProduct]");

//   const newProId = await db.transaction(async (tx) => {
//     const [newPro] = await tx
//       .insert(productsTable)
//       .values({
          
//       })
//       .returning();

//     return newPro.displayId;
//   });
//   return newProId;
// };

// export const getProducts = async () => {
//   "use server";

//   const products = await db.query.productsTable.findMany();
//   return products;
// };

// export const getMyProducts = async (userId: string) => {
//   "use server";

//   const products = await db.query.productsTable.findMany({
//     where: eq(productsTable.userId, userId),
//   });
//   return products;
// };

// export const deleteProduct = async (productId: string) => {
//   "use server";
//   console.log("[deleteProduct]");
//   await db
//     .delete(productsTable)
//     .where(eq(documentsTable.displayId, productId));
//   return;
// };

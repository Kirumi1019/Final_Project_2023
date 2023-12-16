import { eq } from "drizzle-orm";

import { db } from "@/db";
import { productTable } from "@/db/schema";

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

export const getProducts = async () => {
  "use server";
  const products = await db.query.productTable.findMany(
    { where: eq(productTable.productStatus, "launched"), }
  );
  return products;
};

export const getMyProducts = async (userId: string) => {
  "use server";

  const products = await db.query.productTable.findMany({
    where: eq(productTable.sellerID, userId),
  });
  return products;
};

// export const deleteProduct = async (productId: string) => {
//   "use server";
//   console.log("[deleteProduct]");
//   await db
//     .delete(productsTable)
//     .where(eq(documentsTable.displayId, productId));
//   return;
// };

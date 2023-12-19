import { and, eq, ne, sql } from "drizzle-orm";

import { db } from "@/db";
import { productTable, ordersTable, isInterestedInTable, membersTable } from "@/db/schema";
import { z } from "zod";


export const createProduct = async (userId: string, newProductName: string, newProductDescription: string,
    newPrice: number, newInventory: number, newProductCategoryID: string) => {
  "use server";
  //console.log("[createProduct]");

  const addProductSchema = z.object({
    userId: z.string().length(9),
    newProductName: z.string().max(50),
    newProductDescription: z.string().max(100),
    newPrice: z.number(),
    newInventory: z.number(),
    newProductCategoryID: z.string().uuid(),
  });    

  try{
    addProductSchema.parse({
      userId, newProductName, newProductDescription,
    newPrice, newInventory, newProductCategoryID
  });
  } catch(error)
  {
    console.log(error);
    return null;
  }
  

  await db.transaction(async (tx) => {
    await tx
      .insert(productTable)
      .values({
        productName: newProductName,
        description: newProductDescription,
        price: newPrice, 
        inventory: newInventory,
        sellerID: userId,
        categoryID: newProductCategoryID,
      })
      .execute();
});

};

export const getProducts = async () => {
  "use server";
  const products = await db.select().from(productTable).where(ne(productTable.inventory,0)).orderBy(sql`${productTable.price} ASC`)

  return products;
};

export const getMyProducts = async (userId: string) => {
  "use server";

  const products = await db.query.productTable.findMany({
    where: eq(productTable.sellerID, userId),
  });
  return products;
};

export const getMyOrders = async (userId: string) => {
  "use server";

  const MyOrders = await db.query.ordersTable.findMany({
    where: eq(ordersTable.buyerId, userId)
  });
  return MyOrders;
};

export const getCategories = async () => {
  "use server";
  const categories = await db.query.categoryTable.findMany();
  return categories;
};

export const getMyinfo = async (userId: string) => {
  "use server";
  const info = await db.select().from(membersTable).where(eq(membersTable.schoolID, userId));
  return info;
};

// export const deleteProduct = async (productId: string) => {
//   "use server";
//   console.log("[deleteProduct]");
//   await db
//     .delete(productsTable)
//     .where(eq(documentsTable.displayId, productId));
//   return;
// };

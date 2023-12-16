import { eq } from "drizzle-orm";

import { db } from "@/db";
import { productTable, categoryTable, ordersTable, ordersContainTable } from "@/db/schema";
import Orders from "../[memberId]/Orders/page";

export const createProduct = async (userId: string, newProductName: string, newProductDescription: string,
    newPrice: number, newInventory: number, newProductCategoryID: string) => {
  "use server";
  //console.log("[createProduct]");
  const newProductId = await db.transaction(async (tx) => {
    const [newPro] = await tx
      .insert(productTable)
      .values({
        productName: newProductName,
        description: newProductDescription,
        price: newPrice, 
        inventory: newInventory,
        sellerID: userId,
        categoryID: newProductCategoryID,
      })
      .returning();
});
return newProductId;
};

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

export const getCategories = async () => {
  "use server";
  const categories = await db.query.categoryTable.findMany();
  return categories;
}


// export const deleteProduct = async (productId: string) => {
//   "use server";
//   console.log("[deleteProduct]");
//   await db
//     .delete(productsTable)
//     .where(eq(documentsTable.displayId, productId));
//   return;
// };

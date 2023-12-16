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

//   const products = await db.query.productsTable.findMany({
//     with: {
//       product: {
//         columns: {
//           // displayId: true,
//           // title: true,
//         },
//       },
//     },
//   });
//   return documents;
// };

// export const getMyProducts = async (userId: string) => {
//   "use server";

//   const documents = await db.query.usersToDocumentsTable.findMany({
//     where: eq(usersToDocumentsTable.userId, userId),
//     with: {
//       document: {
//         columns: {
//           displayId: true,
//           title: true,
//         },
//       },
//     },
//   });
//   return documents;
// };

// export const deleteDocument = async (documentId: string) => {
//   "use server";
//   console.log("[deleteDocument]");
//   await db
//     .delete(documentsTable)
//     .where(eq(documentsTable.displayId, documentId));
//   return;
// };

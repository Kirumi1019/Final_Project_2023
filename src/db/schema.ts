import { char, integer, primaryKey, index, pgTable, unique, varchar, serial, timestamp, uuid, pgEnum } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";


export const membersTable = pgTable(
  "member",
  {
    schoolID: char("Member_id", { length: 9 }).primaryKey(),
    // displayId: uuid("display_id").defaultRandom().notNull().unique(),
    name: varchar("Member_name", { length: 30 }).notNull(),
    phone: char("Phone_number", {length: 10}).notNull(),
    username: varchar("User_name", { length: 20 }).notNull().unique(),
    password: varchar("Password", { length: 20 }).notNull(),
    violationCount: integer("Violation_count").default(0),
    permission: varchar("Permission_status", { length: 9, enum: ["Permitted", "Banned"] }).notNull().default("Permitted"),
    // provider: varchar("provider", {
    //   length: 100,
    //   enum: ["github", "credentials"],
    // })
    //   .notNull()
    //   .default("credentials"),
  },
  (table) => ({
    idIndex: index("member_id_index").on(table.schoolID),
    usernameIndex: index("username_index").on(table.username),
  }),
);

export const memberRoleTable = pgTable(
    "member_role",
    {
      schoolID: char("Member_id", {length: 9}).notNull().references(()=>membersTable.schoolID, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
      role: varchar("Role", {length: 5, enum: ["User","Admin"]}).notNull(),
    },
    (table) => ({
      pk: primaryKey({ columns: [table.schoolID, table.role] }),
      }),
);

export const ordersTable = pgTable(
  "orders",
  {
    orderId: uuid("Order_id").defaultRandom().notNull().primaryKey(),
    // displayId: uuid("display_id").defaultRandom().notNull().unique(),
    buyerId: char("Buyer_id", {length: 9}).notNull().references(()=>membersTable.schoolID, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
    transactionStatus: varchar("Transaction status", {length: 8,  enum: ["Complete","Cancel","Underway"]}).notNull(),
    buyerConfirmation: varchar("Buyer_confirmation ", {length: 10,  enum: ["Unfinished","Finished"]}).notNull().default("Unfinished"),
    sellerConfirmation: varchar("Seller_confirmation ", {length: 10,  enum: ["Unfinished","Finished"]}).notNull().default("Unfinished"),
    transactionRate: integer("Transaction_rate ").notNull(),
    transactionContent: varchar("Transaction_content ", {length: 80}),
    placeOrderDate: timestamp("Place_order_datetime").defaultNow().notNull(),

  },
  (table) => ({
    orderIdIndex: index("orderId_index").on(table.orderId),
    orderBuyerIndex: index("orderBuyer_index").on(table.buyerId),
    
  })
);

export const ordersContainTable = pgTable(
  "orders_contain",
  {
    orderId: uuid("Order_id").defaultRandom().notNull().references(()=>ordersTable.orderId, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
    productId: uuid("Product_id").defaultRandom().notNull().references(()=>productTable.productID, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
    // displayId: uuid("display_id").defaultRandom().notNull().unique(),
    quantity: integer("Quantity").notNull(),

  },
  (table) => ({
    pk: primaryKey({ columns: [table.orderId, table.productId] }),
    orderContainProductIdIndex: index("orderProductId_index").on(table.productId)
  }),
);

export const deliveryTable = pgTable(
  "delivery",
  {
    orderId: uuid("Order_id").defaultRandom().notNull().references(()=>ordersTable.orderId, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }), //訂單編號
    // displayId: uuid("display_id").defaultRandom().notNull().unique(),
    deliveryMethod: varchar("Delivery_method", { length: 10, enum:["Freight","FaceToFace"] }).notNull(),
    doneDeliveryDatetime: timestamp("Done_delivery_datetime").defaultNow(),
    doneDliveryLocation: varchar("Done_delivery_location", { length: 50 }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.orderId, table.deliveryMethod] }),
  }),
);
export const reportTable = pgTable(
  "report",
  {
    reportID: uuid("Report_id").defaultRandom().notNull().unique(),
    reporterID: char("Reporter_id", { length: 9 }).notNull().references(() => membersTable.schoolID, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
    suspectID: char("Suspect_id", { length: 9 }).notNull().references(() => membersTable.schoolID, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
    reportDescription: varchar("Report_description", { length: 100 }),
    reporterDatetime: timestamp("Reporter_datetime").default(sql`now()`).notNull(),
  }
);

export const isInterestedInTable = pgTable(
  "is_interested_in",
  {
    memberID: char("Member_id", { length: 9 }).notNull().references(() => membersTable.schoolID, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
    productID: uuid("Product_id").notNull().references(() => productTable.productID, {
      onDelete: "cascade",
      onUpdate: "cascade",
    })
  },
  (table) => ({
    pk: primaryKey({ columns: [table.memberID, table.productID] }),    
    interestMemIndex: index("interest_memberID_index").on(table.memberID),
    interestProIndex: index("interest_productID_index").on(table.productID),
  })
);

export const productTable = pgTable(
  "product", {
    productID: uuid("Product_id").defaultRandom().notNull().primaryKey(),
    productName: varchar("Product_name", { length: 50}).notNull(),
    description: varchar("Description", { length: 100 }),
    price: integer("Price").notNull(),
    inventory: integer("Inventory").default(0).notNull(),
    sellerID: char("Seller_id", { length: 9 }).notNull().references(() => membersTable.schoolID, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
    offerDatetime: timestamp("Offer_datetime").default(sql`now()`).notNull(),
    categoryID: uuid("Category_id").references(() => categoryTable.categoryID, {
      onDelete: "set null",
    }).default(sql`NULL`),
    productStatus: varchar("Product_status", { length: 12, enum: ["launched", "stop-selling"] }).default("launched").notNull(),
  },
  (table) => ({
    productIdIndex: index("productID_index").on(table.productID),
    productStatusIndex: index("productStatus_index").on(table.productStatus),
    productSellerIndex: index("productSeller_index").on(table.sellerID),

    
  })

);

export const categoryTable = pgTable(
  "category", {
  categoryID: uuid("Category_id").defaultRandom().notNull().primaryKey(),
  categoryName: varchar("Category_name", { length: 20 }).notNull()
},
);

export const giveFeedbackTable = pgTable(
  "give_feedback", {
  sellerID: char("Seller_id", { length: 9 }).notNull().references(() => membersTable.schoolID, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),
  buyerID: char("Buyer_id", { length: 9 }).notNull().references(() => membersTable.schoolID, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),
  feedbackContent: varchar("Feedback_content", { length: 100 }),
  feedbackDatetime: timestamp("Feedback_datetime").default(sql`now()`).notNull(),
},
  (table) => ({
    pk: primaryKey({ columns: [table.sellerID, table.buyerID, table.feedbackDatetime] }),
  })
);
import { char, integer, primaryKey, index, pgTable,unique, varchar, serial, uuid, timestamp,} from "drizzle-orm/pg-core";


export const membersTable = pgTable(
  "member",
  {
    schoolID: char("Member_id", {length: 9}).primaryKey(),
    // displayId: uuid("display_id").defaultRandom().notNull().unique(),
    name: varchar("Member_name", { length: 20 }).notNull(),
    phone: char("Phone_number", {length: 10}).notNull(),
    username: varchar("User_name", { length: 20 }).notNull().unique(),
    password: varchar("Password", { length: 20 }).notNull(),
    violationCount: integer("Violation_count").default(0),
    permission: varchar("Permission_status", {length: 9, enum: ["Permitted", "Banned"]}).notNull().default("Permitted"),
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
    "member-role",
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
    orderId: uuid("Order_id").defaultRandom().notNull().unique().primaryKey(),
    // displayId: uuid("display_id").defaultRandom().notNull().unique(),
    buyerId: char("Buyer_id", {length: 9}).notNull().references(()=>membersTable.schoolID, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
    transactionStatus: varchar("Transaction status", {length: 8,  enum: ["Complete","Cancel","Underway"]}).notNull(),
    buyerConfirmation: varchar("Buyer_confirmation ", {length: 10,  enum: ["Unfinished","Finished"]}).notNull().default("Unfinished"),
    sellerConfirmation: varchar("Seller_confirmation ", {length: 10,  enum: ["Unfinished","Finished"]}).notNull().default("Unfinished"),
    transactionRate: integer("Transaction_rate ").notNull(),
    transactionContent: varchar("Transaction_content ", {length: 50}),
    placeOrderDatetime: timestamp("timestamp").defaultNow().notNull(),

  },
  (table) => ({
    
  }),
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
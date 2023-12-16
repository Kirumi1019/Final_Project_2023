import { char, integer, primaryKey, index, pgTable, unique, varchar, serial, timestamp, uuid, pgEnum } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";


export const membersTable = pgTable(
  "member",
  {
    schoolID: char("Member_id", { length: 9 }).primaryKey(),
    // displayId: uuid("display_id").defaultRandom().notNull().unique(),
    name: varchar("Member_name", { length: 20 }).notNull(),
    phone: char("Phone_Number", { length: 10 }).notNull(),
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
  "member-role",
  {
    schoolID: char("Member_id", { length: 9 }).notNull().references(() => membersTable.schoolID, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
    role: varchar("Role", { length: 5, enum: ["User", "Admin"] }).notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.schoolID, table.role] }),
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
    reportDescription: varchar("Report_description", { length: 50 }),
    reporterDatetime: timestamp("Reporter_datetime").default(sql`now()`).notNull(),
  }
);

export const isInterestedInTable = pgTable(
  "is-interested-in",
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
  })
);

export const productTable = pgTable(
  "product", {
  productID: uuid("Product_id").defaultRandom().notNull().unique().primaryKey(),
  productName: varchar("Product_name", { length: 20 }).notNull(),
  description: varchar("Description", { length: 100 }),
  price: integer("Price").notNull(),
  inventory: integer("Inventory").default(0),
  sellerID: char("Seller_id", { length: 9 }).notNull().references(() => membersTable.schoolID, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),
  offerDatetime: timestamp("Offer_datetime").default(sql`now()`).notNull(),
  categoryID: uuid("Category_id").references(() => categoryTable.categoryID, {
    onDelete: "set null",
  }).default(sql`NULL`),
  productStatus: varchar("Product_status", { length: 12, enum: ["Launched", "Stop-selling"] }).default("Launched").notNull(),
},
);

export const categoryTable = pgTable(
  "category", {
  categoryID: uuid("Category_id").defaultRandom().notNull().unique().primaryKey(),
  categoryName: varchar("Category_name", { length: 20 }).notNull()
},
);

export const giveFeedbackTable = pgTable(
  "give-feedback", {
  sellerID: char("Seller_id", { length: 9 }).notNull().references(() => membersTable.schoolID, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),
  buyerID: char("Buyer_id", { length: 9 }).notNull().references(() => membersTable.schoolID, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),
  feedbackContent: varchar("Feedback_content", { length: 50 }),
  feedbackDatetime: timestamp("Feedback_datetime").default(sql`now()`).notNull(),
},
  (table) => ({
    pk: primaryKey({ columns: [table.sellerID, table.buyerID, table.feedbackDatetime] }),
  })
);

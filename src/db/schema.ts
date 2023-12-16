import { char, integer, primaryKey, index, pgTable,unique, varchar, serial } from "drizzle-orm/pg-core";


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

      id: serial("id").primaryKey(),
      schoolID: char("Member_id", {length: 9}).notNull().references(()=>membersTable.schoolID, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
      role: varchar("Role", {length: 5, enum: ["User","Admin"]}).notNull(),
    },
    (table) => ({
      uniqCombination: unique().on(table.schoolID, table.role),
      }),

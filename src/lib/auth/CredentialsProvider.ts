import CredentialsProvider from "next-auth/providers/credentials";

// import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { membersTable, memberRoleTable } from "@/db/schema";
import { authSchema } from "@/validators/auth";

export default CredentialsProvider({
  name: "credentials",
  credentials: {
    schoolID: {label: "MemberID", type: "text"},
    name: { label: "MemberName", type: "text", optional: true  },
    phone: { label: "MemberPhone", type: "text", optional: true},
    username: { label: "Userame", type: "text", optional: true},
    password: { label: "Password", type: "password" },
  },
  async authorize(credentials) {
    let validatedCredentials: {
      schoolID: string
      name?: string;
      phone?: string;
      username?:string;
      password: string;
    };

    try {
      validatedCredentials = authSchema.parse(credentials);
    } catch (error) {
      console.log(credentials);
      console.log("Failed to sign in.");
      console.log(error);
      return null;
    }

    const { schoolID, name, phone, username, password } = validatedCredentials;

    
    const [existedUser] = await db
        .select({
          schoolID: membersTable.schoolID,
          password: membersTable.password,
        })
        .from(membersTable)
        .where(eq(membersTable.schoolID, schoolID.toLowerCase()))
        .execute();
      
    if (!existedUser) {
      // Sign up
      if(!schoolID)
      {
        console.log("School ID is required.");
        return null;
      }
      if (!username) {
        console.log("Name is required.");
        return null;
      }
      if (!password)
      {
        console.log("Password is required.");
        return null;
      }
      if(!name)
      {
        console.log("Real name is required.");
        return null;
      }
      if(!phone || phone.length != 10)
      {
        console.log("Phone number is required.");
        return null;
      }
      

      const [createdUser] = await db
        .insert(membersTable)
        .values({
          schoolID: schoolID.toLocaleLowerCase(),
          name,
          username,
          phone,
          password,
        })
        .returning();

      await db.insert(memberRoleTable)
      .values({
        schoolID: createdUser.schoolID,
        role: "User",
      }).execute();

        return {
          // must have id for credential !!!!
          id: createdUser.schoolID,
          name: createdUser.schoolID,
        };
    }

    // Sign in

    const isValid = (password ===  existedUser.password);
    if (!isValid) {
      console.log("Wrong password. Try again.");
      return null;
    }
    return {
      id: existedUser.schoolID,
      name: existedUser.schoolID,
    };
  },
});

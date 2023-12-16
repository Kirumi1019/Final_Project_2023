import CredentialsProvider from "next-auth/providers/credentials";

// import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { membersTable } from "@/db/schema";
import { authSchema } from "@/validators/auth";
import { revalidatePath } from "next/cache";

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
      console.log("Failed to sign in.");
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
      if(!phone)
      {
        console.log("Phone number is reruired.");
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

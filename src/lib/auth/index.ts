import NextAuth from "next-auth";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { membersTable } from "@/db/schema";

import CredentialsProvider from "./CredentialsProvider";

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  providers: [CredentialsProvider],
  callbacks: {
    async session({ session, token }) {
      const schoolID = token.name || session?.user?.username;
      if (!schoolID) return session;

      const [user] = await db
        .select({
          id: membersTable.schoolID,
          username: membersTable.username,
        })
        .from(membersTable)
        .where(eq(membersTable.schoolID, schoolID.toLowerCase()))
        .execute();

      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          username: user.username,
        },
      };
    },
  },
  pages: {
    signIn: "/Error",
  },
});

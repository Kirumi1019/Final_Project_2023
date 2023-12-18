import { NextResponse, type NextRequest } from "next/server";

import { z } from "zod";

import { db } from "@/db";
import { membersTable } from "@/db/schema";
import { eq } from "drizzle-orm";

const postProductRequestSchema = z.object({
  schoolId: z.string().length(9),
  realname: z.string().max(30),
  username: z.string().max(20),
  phone: z.string().length(10),
  password: z.string().max(20),
});

type PostTweetRequest = z.infer<typeof postProductRequestSchema>;

export async function PUT(request: NextRequest) {
  const data = await request.json();

  try {
    postProductRequestSchema.parse(data);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Invalid Input" }, { status: 400 });
  }

  const { schoolId,realname,username,phone,password } = data as PostTweetRequest;

    try{
    if(realname && username && phone && password)
    {
      await db.transaction(async (tx) => {
        await tx.update(membersTable)
        .set({
          name: realname,
          username,
          phone,
          password
        })
        .where(eq(membersTable.schoolID,schoolId))
        .execute()
      });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }

  return new NextResponse("OK", { status: 200 });
}
import { NextResponse, type NextRequest } from "next/server";

import { z } from "zod";

import { db } from "@/db";
import { isInterestedInTable } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";

const likeRequestSchema = z.object({
  userId: z.string().length(9),
  productId: z.string().uuid(),
});

type PostLikeRequest = z.infer<typeof likeRequestSchema>;

export async function GET(request: NextRequest) {
  const data = await request.json();

  try {
    likeRequestSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { userId, productId } = data as PostLikeRequest;

  try {
    const [exist] = await db
      .select({ dummy: sql`1` })
      .from(isInterestedInTable)
      .where(
        and(
          eq(isInterestedInTable.memberID, userId),
          eq(isInterestedInTable.productID, productId),
        ),
      )
      .execute();
    // The NextResponse object is a easy to use API to handle responses.
    // IMHO, it's more concise than the express API.
    return NextResponse.json({ liked: Boolean(exist) }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  data.price = Number(data.price);
  data.inventory = Number(data.inventory);
  try {
    // parse will throw an error if the data doesn't match the schema
    likeRequestSchema.parse(data);
  } catch (error) {
    // in case of an error, we return a 400 response
    console.log(error);
    return NextResponse.json({ error: "Invalid Input" }, { status: 400 });
  }

  const { userId,productId } = data as PostLikeRequest;
  const [exist] = await db
      .select({ dummy: sql`1` })
      .from(isInterestedInTable)
      .where(
        and(
          eq(isInterestedInTable.memberID, userId),
          eq(isInterestedInTable.productID, productId),
        ),
      )
      .execute();
      
  if(!exist)
  {
      try {
        await db.transaction(async (tx) => {
          await tx
            .insert(isInterestedInTable)
            .values({
              memberID: userId,
              productID: productId,

            })
            .execute();
        });
      } catch (error) {

        return NextResponse.json(
          { error: "Something went wrong" },
          { status: 500 },
        );
      }
  }

  return new NextResponse("OK", { status: 200 });
}




type deleteLikeRequest = z.infer<typeof likeRequestSchema>;

export async function DELETE(request: NextRequest) {
  const data = await request.json();

  try {
    likeRequestSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { userId, productId } = data as deleteLikeRequest;

  try {
    await db
        .delete(isInterestedInTable)
        .where(and(eq(isInterestedInTable.memberID,userId),
        eq(isInterestedInTable.productID,productId)));
    }
  catch (error) {
  // The NextResponse object is a easy to use API to handle responses.
  // IMHO, it's more concise than the express API.
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }

  return new NextResponse("OK", { status: 200 });
}
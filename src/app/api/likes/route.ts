import { NextResponse, type NextRequest } from "next/server";

import { z } from "zod";

import { db } from "@/db";
import { isInterestedInTable } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";

const likeRequestSchema = z.object({
  userId: z.string(),
  productId: z.string(),
});

type PostLikeRequest = z.infer<typeof likeRequestSchema>;

export async function GET(request: NextRequest) {
  const data = await request.json();

  try {
    likeRequestSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Now we can safely use the data from the request body
  // the `as` keyword is a type assertion, this tells typescript
  // that we know what we're doing and that the data is of type LikeTweetRequest.
  // This is safe now because we've already validated the data with zod.
  const { userId, productId } = data as PostLikeRequest;

  try {
    // This is a common pattern to check if a row exists
    // if the query returns a row with a dummy column of value 1
    // then the row which satisfies the condition exists.
    // You can also select any column here, but since we don't need
    // any of those data, we just select a dummy column of constant value 1,
    // this saves us from copying any data from the disk to the memory.
    //
    // You can also do this with count(*) and check if the count is greater than 0.
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
        const newProId = await db.transaction(async (tx) => {
          const [newPro] = await tx
            .insert(isInterestedInTable)
            .values({
              memberID: userId,
              productID: productId,

            })
            .returning();
          return newPro.productID;
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
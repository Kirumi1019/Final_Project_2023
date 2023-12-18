import { NextResponse, type NextRequest } from "next/server";

import { z } from "zod";

import { db } from "@/db";
import { ordersContainTable, ordersTable } from "@/db/schema";

const postOrderRequestSchema = z.object({
  buyerId: z.string().length(9),
  productId: z.string().uuid(),
  quantity: z.number(),
});

type PostTweetRequest = z.infer<typeof postOrderRequestSchema>;

export async function POST(request: NextRequest) {
  let data = await request.json();
  data.quantity = Number(data.quantity);
  try {
    // parse will throw an error if the data doesn't match the schema
    postOrderRequestSchema.parse(data);
  } catch (error) {
    // in case of an error, we return a 400 response
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { buyerId,productId,quantity } = data as PostTweetRequest;

  try {

    await db.transaction(async (tx) => {
      const [newOrd] = await tx
        .insert(ordersTable)
        .values({
          buyerId: buyerId,
          transactionStatus: "Underway",
          transactionRate: 0,
        })
        .returning();
      await tx.insert(ordersContainTable).values({
        orderId: newOrd.orderId,
        productId: productId,
        quantity: quantity,
      });
    });
  } catch (error) {


    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }

  return new NextResponse("OK", { status: 200 });
}

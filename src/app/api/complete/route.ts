import { NextResponse, type NextRequest } from "next/server";

import { z } from "zod";

import { db } from "@/db";
import {  ordersTable } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

const postOrderRequestSchema = z.object({
  orderId: z.string().uuid(),
  transactionStatus: z.string().max(8),

});

type PostTweetRequest = z.infer<typeof postOrderRequestSchema>;

export async function POST(request: NextRequest) {
  const data = await request.json();
  try {
    // parse will throw an error if the data doesn't match the schema
    postOrderRequestSchema.parse(data);
  } catch (error) {
    // in case of an error, we return a 400 response
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { orderId,transactionStatus } = data as PostTweetRequest;
  try {
    console.log(transactionStatus);
    if(transactionStatus === "Complete" || transactionStatus === "Underway"){
      await db.transaction(async (tx) => {
        await tx.update(ordersTable).set({
          transactionStatus: transactionStatus,
        })
        .where(eq(ordersTable.orderId,orderId))
        .execute();
  
      });
    }
    
  } catch (error) {


    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }

  return new NextResponse("OK", { status: 200 });
}

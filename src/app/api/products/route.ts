import { NextResponse, type NextRequest } from "next/server";

import { z } from "zod";

import { db } from "@/db";
import { productTable } from "@/db/schema";
import { eq } from "drizzle-orm";

// zod is a library that helps us validate data at runtime
// it's useful for validating data coming from the client,
// since typescript only validates data at compile time.
// zod's schema syntax is pretty intuitive,
// read more about zod here: https://zod.dev/
const postProductRequestSchema = z.object({
  productName: z.string(),
  description: z.string(),
  price: z.number(),
  inventory: z.number(),
  sellerID: z.string(),
  categoryID: z.string(),
});

// you can use z.infer to get the typescript type from a zod schema
type PostTweetRequest = z.infer<typeof postProductRequestSchema>;

// This API handler file would be trigger by http requests to /api/likes
// POST requests would be handled by the POST function
// GET requests would be handled by the GET function
// etc.
// read more about Next.js API routes here:
// https://nextjs.org/docs/app/building-your-application/routing/route-handlers
export async function POST(request: NextRequest) {
  const data = await request.json();
  data.price = Number(data.price);
  data.inventory = Number(data.inventory);
  try {
    // parse will throw an error if the data doesn't match the schema
    postProductRequestSchema.parse(data);
  } catch (error) {
    // in case of an error, we return a 400 response
    console.log(error);
    return NextResponse.json({ error: "Invalid Input" }, { status: 400 });
  }

  // Now we can safely use the data from the request body
  // the `as` keyword is a type assertion, this tells typescript
  // that we know what we're doing and that the data is of type LikeTweetRequest.
  // This is safe now because we've already validated the data with zod.
  const { productName,description,price,inventory,sellerID,categoryID } = data as PostTweetRequest;

  try {
    // This piece of code runs the following SQL query:
    // INSERT INTO tweets (
    //  user_handle,
    //  content,
    //  reply_to_tweet_id
    // ) VALUES (
    //  {handle},
    //  {content},
    //  {replyToTweetId}
    // )
    const newProId = await db.transaction(async (tx) => {
      const [newPro] = await tx
        .insert(productTable)
        .values({
          productName,
          description,
          price,
          inventory,
          sellerID,
          categoryID,
        })
        .returning();
      return newPro.productID;
    });
  } catch (error) {
    // The NextResponse object is a easy to use API to handle responses.
    // IMHO, it's more concise than the express API.
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }

  return new NextResponse("OK", { status: 200 });
}



const putOrderRequestSchema = z.object({
  productId: z.string(),
  productName: z.string().optional(),
  productDescription: z.string().optional(),
  productPrice: z.number().optional(),
  productInv: z.number().optional(),
});

type PutProductRequest = z.infer<typeof putOrderRequestSchema>;

// PUT /api/documents/:documentId
export async function PUT(
  request: NextRequest,
) {
  

    // Parse the request body
    const data = await request.json();
    try {
      data.productPrice = +data.productPrice;
      data.productInv = +data.productInv;
      putOrderRequestSchema.parse(data);
    } catch (error) {
      return NextResponse.json({ error: "Bad Request" }, { status: 400 });
    }

    const { productId,productName,productDescription,productPrice,productInv } = data as PutProductRequest;
    
    try {
    // Update document
    if(productName)
    {
      await db
      .update(productTable)
      .set({
        productName,
      })
      .where(eq(productTable.productID, productId))
    }

    if(productDescription)
    {
      await db
      .update(productTable)
      .set({
        description: productDescription,
      })
      .where(eq(productTable.productID, productId))
    }

    if(productPrice)
    {
      await db
      .update(productTable)
      .set({
        price: productPrice,
      })
      .where(eq(productTable.productID, productId))
    }

    if(productInv)
    {
      await db
      .update(productTable)
      .set({
        inventory: productInv,
      })
      .where(eq(productTable.productID, productId))
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




const deleteProjectRequestSchema = z.object({
  productId: z.string(),
});

type deleteProductRequest = z.infer<typeof deleteProjectRequestSchema>;

export async function DELETE(request: NextRequest) {
  const data = await request.json();

  try {
    deleteProjectRequestSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { productId } = data as deleteProductRequest;

  try {
    await db
      .delete(productTable)
      .where(
          eq(productTable.productID, productId)
      )
      .execute();
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }

  return new NextResponse("OK", { status: 200 });
}
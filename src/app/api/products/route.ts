import { NextResponse, type NextRequest } from "next/server";

import { z } from "zod";

import { db } from "@/db";
import { productTable } from "@/db/schema";
import { eq } from "drizzle-orm";

const postProductRequestSchema = z.object({
  productName: z.string().max(50),
  description: z.string().max(100),
  price: z.number(),
  inventory: z.number(),
  sellerID: z.string().length(9),
  categoryID: z.string().uuid(),
});

type PostTweetRequest = z.infer<typeof postProductRequestSchema>;

export async function POST(request: NextRequest) {
  let data = await request.json();
  data.price = Number(data.price);
  data.inventory = Number(data.inventory);
  try {
    postProductRequestSchema.parse(data);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Invalid Input" }, { status: 400 });
  }

  const { productName,description,price,inventory,sellerID,categoryID } = data as PostTweetRequest;

  try {
    await db.transaction(async (tx) => {
      await tx
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
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }

  return new NextResponse("OK", { status: 200 });
}



const putOrderRequestSchema = z.object({
  productId: z.string().uuid(),
  productName: z.string().max(50).optional(),
  productDescription: z.string().max(100).optional(),
  productPrice: z.number().optional(),
  productInv: z.number().optional(),
});

type PutProductRequest = z.infer<typeof putOrderRequestSchema>;

// PUT /api/documents/:documentId
export async function PUT(
  request: NextRequest,
) {
  

    // Parse the request body
    let data = await request.json();
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
      await db.transaction(async (tx) => {
        await tx
        .update(productTable)
        .set({
          productName,
        })
        .where(eq(productTable.productID, productId))
        .execute()
      });
    }  

    if(productDescription)
    {
      await db.transaction(async (tx) => {
        await tx
        .update(productTable)
        .set({
          description: productDescription,
        })
        .where(eq(productTable.productID, productId))
        .execute()
      });
    }

    if(productPrice)
    {
      await db.transaction(async (tx) => {
        await tx
      .update(productTable)
      .set({
        price: productPrice,
      })
      .where(eq(productTable.productID, productId))
      .execute()
      });
    }

    if(productInv)
    {
      await db.transaction(async (tx) => {
        await tx
      .update(productTable)
      .set({
        inventory: productInv,
      })
      .where(eq(productTable.productID, productId))
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




const deleteProjectRequestSchema = z.object({
  productId: z.string().uuid(),
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
    await db.transaction(async (tx) => {
      await tx
      .delete(productTable)
      .where(
          eq(productTable.productID, productId)
      )
      .execute()
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }

  return new NextResponse("OK", { status: 200 });
}
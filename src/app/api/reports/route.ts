import { NextResponse, type NextRequest } from "next/server";

import { z } from "zod";

import { db } from "@/db";
import { reportTable } from "@/db/schema";

const postReportRequestSchema = z.object({
  reporterID: z.string().length(9),
  suspectID: z.string().length(9),
  reportDescription: z.string().max(100),
});

type PostTweetRequest = z.infer<typeof postReportRequestSchema>;

export async function POST(request: NextRequest) {
  const data = await request.json();
  try {
    postReportRequestSchema.parse(data);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Invalid Input" }, { status: 400 });
  }

  const { reporterID, suspectID, reportDescription} = data as PostTweetRequest;

  try {
    await db.transaction(async (tx) => {
      await tx
        .insert(reportTable)
        .values({
          reporterID,
          suspectID,
          reportDescription,
        })
        .execute();
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }

  return new NextResponse("OK", { status: 200 });
}

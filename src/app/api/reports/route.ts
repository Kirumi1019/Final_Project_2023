import { NextResponse, type NextRequest } from "next/server";

import { z } from "zod";

import { db } from "@/db";
import { reportTable } from "@/db/schema";

// zod is a library that helps us validate data at runtime
// it's useful for validating data coming from the client,
// since typescript only validates data at compile time.
// zod's schema syntax is pretty intuitive,
// read more about zod here: https://zod.dev/
const postReportRequestSchema = z.object({
  reporterID: z.string(),
  suspectID: z.string(),
  reportDescription: z.string(),
});

// you can use z.infer to get the typescript type from a zod schema
type PostTweetRequest = z.infer<typeof postReportRequestSchema>;

// This API handler file would be trigger by http requests to /api/likes
// POST requests would be handled by the POST function
// GET requests would be handled by the GET function
// etc.
// read more about Next.js API routes here:
// https://nextjs.org/docs/app/building-your-application/routing/route-handlers
export async function POST(request: NextRequest) {
  const data = await request.json();
  try {
    // parse will throw an error if the data doesn't match the schema
    postReportRequestSchema.parse(data);
  } catch (error) {
    // in case of an error, we return a 400 response
    console.log(error);
    return NextResponse.json({ error: "Invalid Input" }, { status: 400 });
  }

  // Now we can safely use the data from the request body
  // the `as` keyword is a type assertion, this tells typescript
  // that we know what we're doing and that the data is of type LikeTweetRequest.
  // This is safe now because we've already validated the data with zod.
  const { reporterID, suspectID, reportDescription} = data as PostTweetRequest;

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
    const newRepId = await db.transaction(async (tx) => {
      const [newRep] = await tx
        .insert(reportTable)
        .values({
          reporterID,
          suspectID,
          reportDescription,
        })
        .returning();
      return newRep.reportID;
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

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/connect";
import messageModel from "@/lib/db/models/Message";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const userId = (await params).userId;
  const limit = Number(request.nextUrl.searchParams.get("limit")) || 10;
  const skip = Number(request.nextUrl.searchParams.get("skip")) || 0;
  try {
    await dbConnect();
    const messages = await messageModel
      .find({
        recipientId: userId,
      })
      .limit(limit)
      .skip(skip)
      .sort("-createdAt");

    return NextResponse.json(messages, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json("Oops! Something went wrong.", {
      status: 500,
    });
  }
}

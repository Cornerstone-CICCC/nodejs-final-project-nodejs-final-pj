import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/connect";
import messageModel from "@/lib/db/models/Message";
import mongoose from "mongoose";
import { cookies } from "next/headers";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ recipientId: string }> }
) {
  const recipientId = (await params).recipientId;
  const limit = Number(request.nextUrl.searchParams.get("limit")) || 10;
  const skip = Number(request.nextUrl.searchParams.get("skip")) || 0;
  const lastMessageTimestamp = request.nextUrl.searchParams.get("timestamp");

  try {
    await dbConnect();
    const cookiesStore = await cookies();

    if (!cookiesStore.get("user-id")?.value) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    const userId = cookiesStore.get("user-id")?.value;
    const conditionals = lastMessageTimestamp
      ? {
          updatedAt: {
            $gt: lastMessageTimestamp ? new Date(lastMessageTimestamp) : null,
          },
        }
      : {};
    const messages = await messageModel
      .find({
        $or: [
          {
            senderId: new mongoose.Types.ObjectId(userId),
            recipientId: new mongoose.Types.ObjectId(recipientId),
          },
          {
            senderId: new mongoose.Types.ObjectId(recipientId),
            recipientId: new mongoose.Types.ObjectId(userId),
          },
        ],
      })
      .where({ ...conditionals })
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        data: messages,
      },
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      {
        status: 500,
      }
    );
  }
}

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import mongoose from "mongoose";
import dbConnect from "@/lib/db/connect";
import User from "@/lib/db/models/User";

// Get Users
export async function GET() {
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

    const users = await User.aggregate([
      { $match: { _id: { $ne: new mongoose.Types.ObjectId(userId) } } },
      {
        $lookup: {
          from: "messages",
          localField: "_id",
          foreignField: "recipientId",
          as: "receivedMessages",
        },
      },
      {
        $addFields: {
          unreadCount: {
            $size: {
              $filter: {
                input: "$receivedMessages",
                as: "msg",
                cond: { $eq: ["$$msg.read", false] },
              },
            },
          },
          lastMessageTimestamp: {
            $max: "$receivedMessages.createdAt",
          },
          lastMessage: {
            $max: "$receivedMessages.text",
          },
        },
      },
      {
        $project: {
          name: 1,
          userName: 1,
          email: 1,
          fileId: 1,
          unreadCount: 1,
          lastMessage: 1,
          lastMessageTimestamp: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    return NextResponse.json({ success: true, data: users }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error },
      { status: 400 }
    );
  }
}

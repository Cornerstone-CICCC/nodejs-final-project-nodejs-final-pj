import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/connect";
import messageModel from "@/lib/db/models/Message";
import { cookies } from "next/headers";

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { id } = body;

  const cookiesStore = await cookies();

  if (!cookiesStore.get("user-id")?.value) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }
  const userId = cookiesStore.get("user-id")?.value;

  await dbConnect();
  const newMessage = await messageModel.updateOne(
    {
      _id: id,
      recipientId: userId,
    },
    {
      $set: {
        read: true,
      },
    }
  );

  return NextResponse.json(newMessage, {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "../../../lib/db/connect";
import messageModel from "../../../lib/db/models/Message";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { senderId, recipientId, text } = body;

  const cookiesStore = await cookies();
  if (!cookiesStore.get("user-id")?.value) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }
  // const userId = cookiesStore.get("user-id")?.value;

  await dbConnect();
  const newMessage = await messageModel.create({
    senderId,
    recipientId,
    text,
  });

  return NextResponse.json(newMessage, {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

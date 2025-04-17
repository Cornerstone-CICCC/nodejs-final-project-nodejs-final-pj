import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../lib/db/connect";
import messageModel from "../../../lib/db/models/Message";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { senderId, recipientId, text } = body;

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

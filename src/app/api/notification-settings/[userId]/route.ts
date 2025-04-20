import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/connect";
import { NotificationSettings } from "@/lib/db/models/NotificationSettings";

// Get notification settings for a user
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const id = (await params).userId;

  try {
    await dbConnect();

    const settings = await NotificationSettings.findOne({ userId: id });
    if (!settings) {
      return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

// Update notification settings for a user
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const id = (await params).userId;
    const { notificationsEnabled, notificationTypes } = await req.json();

    await dbConnect();

    const settings = await NotificationSettings.findOneAndUpdate(
      { userId: id },
      { $set: { notificationsEnabled, notificationTypes } },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

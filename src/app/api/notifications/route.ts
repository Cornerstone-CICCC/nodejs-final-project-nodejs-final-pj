import dbConnect from "@/lib/db/connect";
import { NextRequest, NextResponse } from "next/server";
import { PushToken } from "@/lib/db/models/PushToken";
import { sendNotification } from "@/lib/firebase/sendNotification";

// Register token
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.type === "registerToken") {
      const { userId, token, device } = body;

      if (!userId || !token || !device) {
        return NextResponse.json(
          { success: false, message: "Missing required fields" },
          { status: 400 }
        );
      }

      await dbConnect();

      const existingUser = await PushToken.findOne({ userId });

      if (existingUser) {
        const tokenIndex = existingUser.tokens.findIndex(
          (t) => t.token === token
        );

        if (tokenIndex > -1) {
          existingUser.tokens[tokenIndex].updatedAt = new Date();
          existingUser.tokens[tokenIndex].isValid = true;
        } else {
          existingUser.tokens.push({
            token,
            device,
            createdAt: new Date(),
            updatedAt: new Date(),
            isValid: true,
          });
        }

        await existingUser.save();
      } else {
        const newPushToken = new PushToken({
          userId,
          tokens: [
            {
              token,
              device,
              createdAt: new Date(),
              updatedAt: new Date(),
              isValid: true,
            },
          ],
        });

        await newPushToken.save();
      }

      return NextResponse.json({ success: true });
    }

    // Send notification
    if (body.type === "sendNotification") {
      const { recipientId, title, body: notificationBody } = body;

      if (!recipientId || !title || !notificationBody) {
        return NextResponse.json(
          { success: false, message: "Missing required fields" },
          { status: 400 }
        );
      }

      await dbConnect();

      const userTokens = await PushToken.findOne({ userId: recipientId });
      if (!userTokens || userTokens.tokens.length === 0) {
        return NextResponse.json(
          { success: false, message: "Recipient not found or no tokens" },
          { status: 404 }
        );
      }

      const validTokens = userTokens.tokens
        .filter((token) => token.isValid)
        .map((token) => ({ endpoint: token.token }));

      if (validTokens.length === 0) {
        return NextResponse.json(
          { success: false, message: "No valid tokens available" },
          { status: 404 }
        );
      }

      await sendNotification(title, notificationBody, validTokens);

      return NextResponse.json({ success: true });
    }
    return NextResponse.json(
      { success: false, message: "Invalid type" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error handling request:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

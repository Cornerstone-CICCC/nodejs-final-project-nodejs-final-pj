// server.ts
import express from "express";
import { createServer } from "http";
import cors from "cors";
import { Server } from "socket.io";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

import userModel from "./src/lib/db/models/User";
import messageModel from "./src/lib/db/models/Message";
import dbConnect from "./src/lib/db/connect";
import { sendNotificationAPI } from "./src/lib/firebase/notifications";

const app = express();
const httpServer = createServer(app);
const frontendUrl = "http://localhost:3000"; // Better to place URLs in an env file for flexibility

app.use(express.json());

app.use(cors({ origin: frontendUrl, credentials: true }));

const io = new Server(httpServer, {
  cors: {
    origin: frontendUrl,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  },
});

const PORT = process.env.PORT || 3001;

io.on("connection", async (socket) => {
  console.log("Socket connected:", socket.id);
  await dbConnect(); // You are connecting to the database for every new connection/client. It's better to put this outside to minimize the number of calls

  // Better to move socket events to a separate file to avoid cluttering the server file
  socket.on(
    "send_message",
    async (data: {
      message: string;
      recipientId: string;
      senderId: string;
    }) => {
      // TODO: GET SENDER ID FROM NEXT SESSION
      if (!data.message || !data.recipientId || !data.senderId) {
        console.log("Invalid data:", data);
        return;
      }
      const newMessage = await messageModel.create({
        senderId: data.senderId,
        recipientId: data.recipientId,
        text: data.message,
        read: false,
      });

      // Send notification
      try {
        const payload = {
          type: "sendNotification",
          recipientId: data.recipientId,
          title: "New Message",
          body: data.message,
          notificationType: "messages",
        };

        const success = await sendNotificationAPI(payload);

        if (success) {
          console.log("Notification sent successfully");
        } else {
          console.error("Failed to send notification.");
        }
      } catch (err) {
        console.error("Error sending notification:", err);
      }

      io.emit("received_message", { message: newMessage });
    }
  );

  socket.on("user-connected", (userId) => {
    console.log(`User ${userId} connected`);
    userModel
      .updateOne(
        { _id: new mongoose.Types.ObjectId(userId) },
        { lastLogin: new Date(), isLoggedIn: true }
      )
      .then((updatedUser) => {
        console.log("User last login updated:", updatedUser);
      })
      .catch((error) => {
        console.error("Error updating user last login:", error);
      });
    socket.emit("user-login", userId);
  });

  socket.on("user-disconnected", (userId) => {
    console.log(`User ${userId} disconnected`);
    userModel
      .updateOne(
        { _id: new mongoose.Types.ObjectId(userId) },
        { lastLogin: new Date(), isLoggedIn: false }
      )
      .then((updatedUser) => {
        console.log("User last login updated:", updatedUser);
      })
      .catch((error) => {
        console.error("Error updating user last login:", error);
      });
    socket.emit("user-logout", userId);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

httpServer.listen(PORT, () => {
  console.log(`ws-server running on http://localhost:${PORT}`);
});

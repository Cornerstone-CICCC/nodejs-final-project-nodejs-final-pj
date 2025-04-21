// server.ts
import express from "express";
import { createServer } from "http";
import cors from "cors";
import { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

import messageModel from "./src/lib/db/models/Message";
import dbConnect from "./src/lib/db/connect";

const app = express();
const httpServer = createServer(app);
const frontendUrl = "http://localhost:3000";

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
  await dbConnect();

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

      socket.emit("recieved_message", { message: newMessage });
    }
  );

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

httpServer.listen(PORT, () => {
  console.log(`ws-server running on http://localhost:${PORT}`);
});

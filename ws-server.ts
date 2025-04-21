// server.ts
import express from "express";
import { createServer } from "http";
import cors from "cors";
import { Server } from "socket.io";
import { sendNotificationAPI } from "./src/lib/firebase/notifications";

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

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("send_message", async (data) => {
    console.log("Message received:", data);
    socket.broadcast.emit("receive_message", data); // Send to others

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
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

httpServer.listen(PORT, () => {
  console.log(`ws-server running on http://localhost:${PORT}`);
});

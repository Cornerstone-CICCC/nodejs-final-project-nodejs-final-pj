import mongoose, { Schema, Document, Model } from "mongoose";

interface NotificationSettingsDocument extends Document {
  userId: string;
  notificationsEnabled: boolean;
  notificationTypes: {
    messages: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSettingsSchema = new Schema<NotificationSettingsDocument>(
  {
    userId: { type: String, required: true, unique: true },
    notificationsEnabled: { type: Boolean, default: true },
    notificationTypes: {
      messages: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform: (_, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.createdAt;
        delete ret.updatedAt;
      },
    },
  }
);

export const NotificationSettings: Model<NotificationSettingsDocument> =
  mongoose.models.NotificationSettings ||
  mongoose.model(
    "NotificationSettings",
    NotificationSettingsSchema,
    "notification_settings"
  );

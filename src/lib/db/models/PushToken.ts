import mongoose, { Schema, Document, Model } from "mongoose";

interface Token {
  token: string;
  device: string;
  createdAt: Date;
  updatedAt: Date;
  isValid: boolean;
}

export interface PushTokenDocument extends Document {
  userId: string;
  tokens: Token[];
}

const TokenSchema = new Schema<Token>({
  token: { type: String, required: true },
  device: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isValid: { type: Boolean, default: true },
});

const PushTokenSchema = new Schema<PushTokenDocument>(
  {
    userId: { type: String, required: true },
    tokens: [TokenSchema],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const PushToken: Model<PushTokenDocument> =
  mongoose.models.PushToken ||
  mongoose.model("PushToken", PushTokenSchema, "push_tokens");

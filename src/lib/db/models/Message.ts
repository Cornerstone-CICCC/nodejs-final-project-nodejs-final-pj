import mongoose, { Document, Model, Schema } from "mongoose";

export interface IMessage extends Document {
  senderId: Schema.Types.ObjectId;
  recipientId: Schema.Types.ObjectId;
  read: boolean;
  text: string;
  createdAt: Date;
}

export const messageSchema = new Schema<IMessage>(
  {
    senderId: { type: Schema.Types.ObjectId, required: true, ref: "users" },
    recipientId: { type: Schema.Types.ObjectId, required: true, ref: "users" },
    read: { type: Boolean, required: true, default: false },
    text: { type: String, required: true },
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

const Message: Model<IMessage> =
  mongoose.models.Message || mongoose.model<IMessage>("Message", messageSchema);

export default Message;

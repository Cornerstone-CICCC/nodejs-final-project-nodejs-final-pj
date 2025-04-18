import mongoose, { Document, Schema, Model } from "mongoose";

interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  userName: string;
  email: string;
  bio: string;
  fileId: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true },
    userName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    bio: { type: String, default: "" },
    fileId: { type: String, required: true, unique: true },
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

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;

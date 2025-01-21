import mongoose, { Model, Schema } from "mongoose";

export interface INotifInfo{
    _id: mongoose.Types.ObjectId;
    To: string;
    From: string;
    Title: string;
    Text: string;
    IsRead: boolean;
    Timestamp: Date;
}

const Notification = new Schema<INotifInfo>({
    _id: mongoose.Schema.Types.ObjectId,
    To: String,
    From: String,
    Title: String,
    Text: String,
    IsRead: {
        type: Boolean,
        default: false
    },
    Timestamp: {
        type: Date,
        default: Date.now
    }
});

let NotifModel: Model<INotifInfo>;
try {
    NotifModel = mongoose.model<INotifInfo>("notification");
} catch {
    NotifModel = mongoose.model<INotifInfo>("notification", Notification, "Notification");
}

export default NotifModel
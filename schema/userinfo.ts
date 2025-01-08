import mongoose, { Model, Schema } from "mongoose";

export interface IUserInfo {
    _id: mongoose.Types.ObjectId;
    Name: string;
    Email: string;
    Image: string;
    Role: string; //teacher student parent owner
    SchoolName: string;
    Gender: string;
    Password: string;
    Phone: string;
    AccountType: string; //free or special
    CNIC: string;
    Address: string;
}

const Users = new Schema<IUserInfo>({
    _id: mongoose.Schema.Types.ObjectId,
    Name: String,
    Email: String,
    Image: {
        Type: String,
        default: 'default'
    },
    AccountType: {
        Type: String,
        default: 'Basic'
    },
    Address: String,
    CNIC: String,
    Gender: String,
    Password: String,
    Phone: String,
    Role: String,
    SchoolName: String
});

let UserModel: Model<IUserInfo>;
try {
    UserModel = mongoose.model<IUserInfo>("userInfo");
} catch {
    UserModel = mongoose.model<IUserInfo>("userInfo", Users, "UserInfo");
}

export default UserModel
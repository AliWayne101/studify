import mongoose, { Model, Schema } from "mongoose";

export interface IUserInfo {
    _id: mongoose.Types.ObjectId;
    UID: string;
    Name: string;
    Email: string;
    Image: string;
    Role: string; //teacher parent owner
    SchoolName: string;
    Gender: string;
    Password: string;
    Phone: string;
    AccountType: string; //free or special
    CNIC: string;
    Address: string;
    ParentUID: string[];
    DOB: Date;
    JoinedOn: Date;
    isActive: boolean;
    Subjects: string[];
}

const Users = new Schema<IUserInfo>({
    _id: mongoose.Schema.Types.ObjectId,
    UID: String,
    Name: String,
    Email: String,
    Image: {
        type: String,
        default: 'default'
    },
    AccountType: {
        type: String,
        default: 'Basic'
    },
    Address: String,
    CNIC: String,
    Gender: String,
    Password: String,
    Phone: String,
    Role: String,
    SchoolName: String,
    ParentUID: [String],
    DOB: Date,
    JoinedOn: {
        type: Date,
        default: Date.now()
    },
    isActive: {
        type: Boolean,
        default: true
    },
    Subjects: [String],
});

let UserModel: Model<IUserInfo>;
try {
    UserModel = mongoose.model<IUserInfo>("userInfo");
} catch {
    UserModel = mongoose.model<IUserInfo>("userInfo", Users, "UserInfo");
}

export default UserModel
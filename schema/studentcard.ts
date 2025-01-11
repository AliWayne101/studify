import mongoose, { Model, Schema } from "mongoose";

export interface IStudentCard {
    _id: mongoose.Types.ObjectId;
    UID: string;
    Name: string;
    Grade: string;
    ProfileImage: string;
    Gender: string;
    Password: string;
    SchoolName: string;
    ParentUID: string;
}

const Students = new Schema<IStudentCard>({
    _id: mongoose.Schema.Types.ObjectId,
    UID: String,
    Name: String,
    Grade: String,
    ProfileImage: {
        type: String,
        default: 'default'
    },
    Gender: String,
    Password: String,
    SchoolName: String,
    ParentUID: String
});

let AttendanceModel: Model<IStudentCard>;
try {
    AttendanceModel = mongoose.model<IStudentCard>("studentcard");
} catch {
    AttendanceModel = mongoose.model<IStudentCard>("studentcard", Students, "StudentCard");
}

export default AttendanceModel
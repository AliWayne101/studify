import mongoose, { Model, Schema } from "mongoose";

export interface IClassInfo {
    _id: mongoose.Types.ObjectId;
    UID: string;
    TeacherUID: string;
    StudentUIDs: string[];
    SchoolName: string;
    Name: string;
}

const Class =  new Schema<IClassInfo>({
    _id: mongoose.Schema.Types.ObjectId,
    UID: String,
    TeacherUID: {
        type: String,
        default: "unassigned"
    },
    StudentUIDs: {
        type: [String],
        default: []
    },
    SchoolName: String,
    Name: String
});

let ClassModel: Model<IClassInfo>;

try {
    ClassModel = mongoose.model<IClassInfo>("class");
} catch {
    ClassModel = mongoose.model<IClassInfo>("class", Class, "Class");
}

export default ClassModel
import mongoose, { Model, Schema } from "mongoose";

export interface IClassInfo {
    _id: mongoose.Types.ObjectId;
    TeacherUID: string;
    StudentUIDs: string[];
    Name: string;
}

const Class =  new Schema<IClassInfo>({
    _id: mongoose.Schema.Types.ObjectId,
    TeacherUID: String,
    StudentUIDs: [String],
    Name: String
});

let ClassModel: Model<IClassInfo>;

try {
    ClassModel = mongoose.model<IClassInfo>("class");
} catch {
    ClassModel = mongoose.model<IClassInfo>("class", Class, "Class");
}

export default ClassModel
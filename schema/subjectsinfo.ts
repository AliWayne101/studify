import { SubjectList } from "@/interfaces";
import mongoose, { Model, Schema } from "mongoose";

export interface ISubjectsInfo {
    _id: mongoose.Types.ObjectId;
    UID: string;
    SubjectList: SubjectList[];
    SchoolName: string;
}

const Subjects = new Schema<ISubjectsInfo>({
    _id: mongoose.Schema.Types.ObjectId,
    UID: String,
    SubjectList: {
        type: [{
            SubjectName: String,
            SubjectTeacherUID: String,
        }],
        default: []
    },
    SchoolName: String
})

let SubjectsModel = Model<ISubjectsInfo>;
try {
    SubjectsModel = mongoose.model<ISubjectsInfo>("subjects");
} catch {
    SubjectsModel = mongoose.model<ISubjectsInfo>("subjects", Subjects, "Subjects");
}

export default SubjectsModel
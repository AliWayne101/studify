import { SubjectList } from "@/interfaces";
import mongoose, { Model, Schema } from "mongoose";

export interface ISubjectsInfo {
    _id: mongoose.Types.ObjectId;
    UID: string;
    SchoolName: string;
    SubjectList: SubjectList[];
}

const Subjects = new Schema<ISubjectsInfo>({
    _id: mongoose.Schema.Types.ObjectId,
    UID: String,
    SchoolName: String,
    SubjectList: {
        type: [{
            SubjectName: String,
            SubjectTeacherUID: String,
        }],
        default: []
    },
})

let SubjectsModel = Model<ISubjectsInfo>;
try {
    SubjectsModel = mongoose.model<ISubjectsInfo>("subjects");
} catch {
    SubjectsModel = mongoose.model<ISubjectsInfo>("subjects", Subjects, "Subjects");
}

export default SubjectsModel
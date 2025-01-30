import { DiaryDetail } from "@/interfaces";
import mongoose, { Model, Schema } from "mongoose";

export interface IDiaryInfo {
    _id: mongoose.Types.ObjectId;
    ClassName: string;
    SchoolName: string;
    DiaryFor: Date,
    IsAuthorized: boolean,
    AuthorizedBy: string,
    Diaries: DiaryDetail[],
}

const Diary = new Schema<IDiaryInfo>({
    _id: mongoose.Schema.Types.ObjectId,
    ClassName: String,
    SchoolName: String,
    DiaryFor: Date,
    IsAuthorized: Boolean,
    AuthorizedBy: String,
    Diaries: [{ 
        Subject: String, 
        Diary: String 
    }]
})

let DiaryModel: Model<IDiaryInfo>;

try {
    DiaryModel = mongoose.model<IDiaryInfo>("diary");
} catch {
    DiaryModel = mongoose.model<IDiaryInfo>("diary", Diary, "Diary");
}

export default DiaryModel
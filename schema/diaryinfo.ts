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
    DiaryFor: {
        type: Date,
        default: () => {
            const date = new Date();
            date.setDate(date.getDate() + 1);
            return date;
        }
    },
    IsAuthorized: {
        type: Boolean,
        default: false
    },
    AuthorizedBy: {
        type: String,
        default: 'none'
    },
    Diaries: {
        type: [{
            Subject: String,
            Diary: String
        }],
        default: []
    }
})

let DiaryModel: Model<IDiaryInfo>;

try {
    DiaryModel = mongoose.model<IDiaryInfo>("diary");
} catch {
    DiaryModel = mongoose.model<IDiaryInfo>("diary", Diary, "Diary");
}

export default DiaryModel
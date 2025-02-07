import { ISubjectItem } from "@/interfaces";
import mongoose, { Model, Schema } from "mongoose";

export interface IMonthlyTestInfo {
    _id: mongoose.Types.ObjectId;
    UID: string;
    Month: string;
    Year: string;
    Subjects: {
        [key: string]: ISubjectItem[];
    };
}

const MonthlyTest = new Schema<IMonthlyTestInfo>({
    _id: mongoose.Schema.Types.ObjectId,
    UID: String,
    Month: String,
    Year: String,
    Subjects: {
        type: Map, 
        of: [{
            ObtainedMarks: Number,
            TotalMarks: Number,
            Date: Date,
            Position: Number
        }]
    }
})

let MonthlyTestModel: Model<IMonthlyTestInfo>;
try {
    MonthlyTestModel = mongoose.model<IMonthlyTestInfo>("monthlyTest");
} catch {
    MonthlyTestModel = mongoose.model<IMonthlyTestInfo>("monthlyTest", MonthlyTest, "MonthlyTest");
}

export default MonthlyTestModel
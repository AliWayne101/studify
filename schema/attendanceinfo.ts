import { AttendanceStructProps } from "@/interfaces";
import mongoose, { Model, Schema } from "mongoose";

export interface IAttendanceInfo {
    _id: mongoose.Types.ObjectId;
    Month: string;
    Year: number;
    UID: string;
    Attendance: AttendanceStructProps[];
}

const Attendance = new Schema<IAttendanceInfo>({
    _id: mongoose.Schema.Types.ObjectId,
    Month: String,
    Year: Number,
    UID: String,
    Attendance: [{
        Day: Number,
        Status: String
    }]
});

let AttendanceModel: Model<IAttendanceInfo>;

try {
    AttendanceModel = mongoose.model<IAttendanceInfo>("attendanceInfo");
} catch {
    AttendanceModel = mongoose.model<IAttendanceInfo>("attendanceInfo", Attendance, "AttendanceInfo");
}

export default AttendanceModel
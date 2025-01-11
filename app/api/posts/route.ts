import UserModel from "@/schema/userinfo";
import AttendanceModel from "@/schema/attendanceinfo";
import { Connect, hashPassword, UniqueID } from "@/utils";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (request: NextRequest) => {
    await Connect();

    const body = await request.json();
    const { Request } = body;

    switch (Request) {
        case "login":
            var { Email } = body;
            try {
                const doc = await UserModel.findOne({ Email: Email }).exec();
                return NextResponse.json({ message: "OK", doc: doc }, { status: 200 });
            } catch (err) {
                return NextResponse.json({ message: "ERROR", error: err }, { status: 200 });
            }
        case "signup":
            var { Name, Email, Role, SchoolName, Gender, Password, Phone, CNIC, Address } = body;
            try {
                const existingUser = await UserModel.findOne({ Email: Email }).exec();
                if (existingUser !== null)
                    return NextResponse.json({ message: "ERROR", error: "User already exists with the same Email" }, { status: 200 });
                const newPassword = await hashPassword(Password);
                console.log(newPassword);
                const uniqueID = UniqueID(8);
                const doc = await UserModel.create({
                    _id: new mongoose.Types.ObjectId(),
                    UID: uniqueID,
                    Name,
                    Email,
                    Role,
                    SchoolName,
                    Gender,
                    Phone,
                    CNIC,
                    Address,
                    Password: newPassword
                });
                return NextResponse.json({ message: "OK", doc: doc }, { status: 200 });
            } catch (err) {
                return NextResponse.json({ message: "ERROR", error: err }, { status: 200 });
            }
        case "fillAttendance":
            var { StudentId, Status } = body;
            const currentDate = new Date();
            const currentDay = currentDate.getDate();
            const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
            const currentYear = currentDate.getFullYear();

            try {
                let attendance = await AttendanceModel.findOne({
                    StudentId,
                    Month: currentMonth,
                    Year: currentYear
                });

                if (!attendance) {
                    attendance = await AttendanceModel.create({
                        _id: new mongoose.Types.ObjectId(),
                        StudentId,
                        Month: currentMonth,
                        Year: currentYear,
                        Attendace: [{ Day: currentDay, Status }]
                    });
                } else {
                    const dayIndex = attendance.Attendace.findIndex(a => a.Day === currentDay);
                    if (dayIndex > -1) {
                        attendance.Attendace[dayIndex].Status = Status;
                    } else {
                        attendance.Attendace.push({ Day: currentDay, Status });
                    }
                    await attendance.save();
                }

                return NextResponse.json({ message: "OK", attendance: attendance }, { status: 200 });
            } catch (err) {
                return NextResponse.json({ message: "ERROR", error: err }, { status: 200 });
            }
        default:
            return NextResponse.json({ message: "Invalid Request", body: body }, { status: 200 });
    }
}

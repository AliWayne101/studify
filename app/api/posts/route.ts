import UserModel, { IUserInfo } from "@/schema/userinfo";
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
        case "getdashboarduinfo":
            var { uid, clause, targetRoll, schoolName } = body;
            if (clause === "all") {
                var searchParams = {};
                if (targetRoll === "Employees") {
                    searchParams = { Role: { $in: ["Teacher", "Admin"] }, SchoolName: schoolName };
                } else if (targetRoll === "Student") {
                    searchParams = { Role: "Student", SchoolName: schoolName }
                }
                const docs = await UserModel.find(searchParams);
                return NextResponse.json({ message: "OK", data: docs }, { status: 200 });
            } else if (clause === "class") {
                const teacherCard = await UserModel.findOne({ UID: uid });
                if (teacherCard) {
                    const students = await UserModel.find({ AssignedClass: teacherCard.AssignedClass });
                    return NextResponse.json({ message: "OK", data: students });
                } else {
                    return NextResponse.json({ message: "ERROR", error: "No user with such data" }, { status: 200 });
                }
            } else {
                return NextResponse.json({ message: "ERROR" }, { status: 200 });
            }
            break;
        case "signup":
            var { Name, Email, Role, SchoolName, Gender, Password, Phone, CNIC, Address } = body;
            const newPassword = await hashPassword(Password);
            const uniqueID = UniqueID(8);
            try {
                const existingUser = await UserModel.findOne({ Email: Email }).exec();
                if (existingUser !== null)
                    return NextResponse.json({ message: "ERROR", error: "User already exists with the same Email" }, { status: 200 });
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
                    Password: newPassword,

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

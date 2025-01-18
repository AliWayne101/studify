import UserModel, { IUserInfo } from "@/schema/userinfo";
import AttendanceModel from "@/schema/attendanceinfo";
import { Connect, hashPassword, UniqueID } from "@/utils";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from 'next/server';
import { BasicInfoProps } from "@/interfaces";

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
            break;
        case "getuserbyid":
            var { uid } = body;
            const doc = await UserModel.findOne({ UID: uid }).exec();
            return NextResponse.json({ message: "OK", doc: doc });
            break;
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
            } else if (clause === "children") {
                const docs = await UserModel.find({ ParentUID: uid });
                return NextResponse.json({ message: "OK", data: docs });
            } else {
                return NextResponse.json({ message: "ERROR", error: "Invalid request.." }, { status: 200 });
            }
            break;
        case "basic": {
            const { Role, SchoolName, uID } = body;
            const returnData: BasicInfoProps[] = [];
            if (Role === "Owner" || Role === "Admin") {
                const currentDate = new Date();
                const currentMonth = currentDate.getMonth();
                const currentYear = currentDate.getFullYear();

                const students = await UserModel.find({ isActive: true, SchoolName: SchoolName, Role: "Student" });
                const teachers = await UserModel.find({ isActive: true, SchoolName: SchoolName, Role: "Teacher" });
                const newAdmissions = await UserModel.find({
                    isActive: true,
                    SchoolName: SchoolName,
                    Role: "Student",
                    JoinedOn: {
                        $gte: new Date(currentYear, currentMonth, 1),
                        $lt: new Date(currentYear, currentMonth + 1, 1)
                    }
                });
                returnData.push({ Title: "Students", Info: students.length.toString() });
                returnData.push({ Title: "Teachers", Info: teachers.length.toString() });
                returnData.push({ Title: "Adm. month", Info: newAdmissions.length.toString() });
                returnData.push({ Title: "Present Teachers", Info: "000/000" });
            }

            return NextResponse.json({ message: "OK", data: returnData }, { status: 200 });
            break;
        }
        case "signup":
            var { Name, Email, Role, SchoolName, Gender, Password, Phone, CNIC, Address, DOB } = body;
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
                    DOB
                });
                return NextResponse.json({ message: "OK", doc: doc }, { status: 200 });
            } catch (err) {
                return NextResponse.json({ message: "ERROR", error: err }, { status: 200 });
            }
            break;
        case "getusers":
            var { Case, SchoolName, CasterRole, Class } = body;
            var roleArray: string[] = ["Student"];

            //Under Development
            //Create an array of StudentParentInterface and fill the data accordingly
            //Also add the attendance data of each filled employee
            if (Case === "staff") {
                if (CasterRole === "Owner") {
                    roleArray = ["Teacher", "Admin", "General"];
                } else if (CasterRole === "Admin") {
                    roleArray = ["Teacher", "General"];
                }
                const docs = await UserModel.find({ Role: { $in: roleArray }, SchoolName: SchoolName });
                return NextResponse.json({ message: "OK", docs: docs }, { status: 200 });
            } else if (Case === "students") {
                var docs: IUserInfo[] = [];
                if (CasterRole === "Admin") {
                    docs = await UserModel.find({ SchoolName: SchoolName, Role: "Student" });
                } else if (CasterRole === "Teacher") {
                    docs = await UserModel.find({ SchoolName: SchoolName, Role: "Student", AssignedClass: Class });
                }
                return NextResponse.json({ message: "OK", docs: docs }, { status: 200 });
            }
            break;
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
                    const dayIndex = attendance.Attendance.findIndex(a => a.Day === currentDay);
                    if (dayIndex > -1) {
                        attendance.Attendance[dayIndex].Status = Status;
                    } else {
                        attendance.Attendance.push({ Day: currentDay, Status });
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

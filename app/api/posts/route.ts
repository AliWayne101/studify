import UserModel, { IUserInfo } from "@/schema/userinfo";
import AttendanceModel from "@/schema/attendanceinfo";
import { Connect, getDate, hashPassword, UniqueID } from "@/utils";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from 'next/server';
import { BasicInfoProps, ProperUserInterface } from "@/interfaces";
import ClassModel from "@/schema/classinfo";

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
                const classData = await ClassModel.findOne({ TeacherUID: uid });
                var students: IUserInfo[] = [];
                if (classData)
                    students = await UserModel.find({ UID: { $in: classData.StudentUIDs } });

                return NextResponse.json({ message: "OK", data: students }, { status: 200 });
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

                const docs = await UserModel.find({ Role: { $in: ["Teacher", "Admin", "General"] }, SchoolName: SchoolName });
                const _date = getDate();
                var presents = 0;
                await Promise.all(docs.map(async (doc) => {
                    const attendance = await AttendanceModel.findOne({ UID: doc.UID, Month: _date.Month, Year: _date.Year }).exec();
                    if (attendance) {
                        const dailyAtt = attendance.Attendance[attendance.Attendance.length - 1];
                        if (dailyAtt.Day === _date.Day) {
                            if (dailyAtt.Status === "present") presents++;
                        }
                    }
                }));

                returnData.push({ Title: "Students", Info: students.length.toString() });
                returnData.push({ Title: "Teachers", Info: teachers.length.toString() });
                returnData.push({ Title: "Adm. month", Info: newAdmissions.length.toString() });
                returnData.push({ Title: "Present Teachers", Info: presents + "/" + docs.length });
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
            var { Case, SchoolName, CasterRole, Class, uID } = body;
            var roleArray: string[] = ["Student"];
            if (Case === "staff") {
                var proper: ProperUserInterface[] = [];
                if (CasterRole === "Owner") {
                    roleArray = ["Teacher", "Admin", "General"];
                } else if (CasterRole === "Admin") {
                    roleArray = ["Teacher", "General"];
                }
                const docs = await UserModel.find({ Role: { $in: roleArray }, SchoolName: SchoolName });
                const currentDate = getDate();
                await Promise.all(docs.map(async (doc) => {
                    const attendance = await AttendanceModel.findOne({ UID: doc.UID, Month: currentDate.Month, Year: currentDate.Year }).exec();
                    const _class = await ClassModel.findOne({ TeacherUID: doc.UID }).exec();
                    proper.push({
                        User: doc,
                        Attendance: attendance,
                        Class: _class
                    });
                }));

                return NextResponse.json({ message: "OK", docs: proper }, { status: 200 });
            } else if (Case === "students") {
                var docs: IUserInfo[] = [];
                var proper: ProperUserInterface[] = [];
                if (CasterRole === "Admin") {
                    docs = await UserModel.find({ SchoolName: SchoolName, Role: "Student" });
                } else if (CasterRole === "Teacher") {
                    const _class = await ClassModel.findOne({ TeacherUID: uID }).exec();
                    if (_class)
                        docs = await UserModel.find({ UID: { $in: _class.StudentUIDs } });
                }
                const currentDate = getDate();
                await Promise.all(docs.map(async (doc) => {
                    const parent = await UserModel.findOne({ UID: doc.ParentUID }).exec();
                    const attendance = await AttendanceModel.findOne({ UID: doc.UID, Month: currentDate.Month, Year: currentDate.Year }).exec();
                    proper.push({
                        User: doc,
                        Parent: parent,
                        Attendance: attendance
                    })
                }));
                return NextResponse.json({ message: "OK", docs: proper }, { status: 200 });
            }
            break;
        case "fillAttendance":
            var { uID, Status, Day, Month, Year } = body;
            try {
                let attendance = await AttendanceModel.findOne({ UID: uID, Month: Month, Year: Year });
                if (!attendance) {
                    attendance = await AttendanceModel.create({
                        _id: new mongoose.Types.ObjectId(),
                        UID: uID,
                        Month: Month,
                        Year: Year,
                        Attendance: [{ Day: Day, Status: Status }]
                    });
                } else {
                    const dayIndex = attendance.Attendance.findIndex(a => a.Day === Day);
                    if (dayIndex > -1) {
                        attendance.Attendance[dayIndex].Status = Status;
                    } else {
                        attendance.Attendance.push({ Day: Day, Status: Status });
                    }
                    await attendance.save();
                }

                return NextResponse.json({ message: "OK", doc: attendance }, { status: 200 });
            } catch (err) {
                return NextResponse.json({ message: "ERROR", error: err }, { status: 200 });
            }
        default:
            return NextResponse.json({ message: "Invalid Request", body: body }, { status: 200 });
    }
}

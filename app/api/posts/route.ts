import UserModel, { IUserInfo } from "@/schema/userinfo";
import AttendanceModel from "@/schema/attendanceinfo";
import { AttStatusDay, Connect, getDate, hashPassword, isPasswordValid, UniqueID } from "@/utils";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from 'next/server';
import { BasicInfoProps, ProperUserInterface, SubjectDetail } from "@/interfaces";
import ClassModel from "@/schema/classinfo";
import NotifModel from "@/schema/notifinfo";
import SubjectsModel from "@/schema/subjectsinfo";

interface getUsersByRoleInterface {
    Role: string;
    SchoolName: string;
    isActive?: boolean
}

export const POST = async (request: NextRequest) => {
    await Connect();

    const body = await request.json();
    const { Request } = body;

    switch (Request) {
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

                const dbdata: IUserInfo[] = await UserModel.find({
                    isActive: true,
                    SchoolName: SchoolName,
                    Role: { $in: ["Teacher", "Student", "Admin", "General"] }
                });
                const students: IUserInfo[] = dbdata.filter(x => x.Role === "Student");
                const teachers: IUserInfo[] = dbdata.filter(x => x.Role === "Teacher");

                const newAdmissions = students.filter(student =>
                    new Date(student.JoinedOn) >= new Date(currentYear, currentMonth, 1) &&
                    new Date(student.JoinedOn) < new Date(currentYear, currentMonth + 1, 1)
                );
                const docs = dbdata.filter(user => user.Role === "Teacher" || user.Role === "Admin" || user.Role === "General");
                const listOfIds = [];
                for (const user of docs) {
                    listOfIds.push(user.UID);
                }
                const _date = getDate();
                const allAttendance = await AttendanceModel.find({
                    UID: { $in: listOfIds },
                    Month: _date.Month,
                    Year: _date.Year
                });
                var presents = 0;
                for (const att of allAttendance) {
                    const attStatus = AttStatusDay(att.Attendance, _date.Day, "present");
                    if (attStatus === true) presents++;
                }

                returnData.push({ Title: "Students", Info: students.length.toString() });
                returnData.push({ Title: "Teachers", Info: teachers.length.toString() });
                returnData.push({ Title: "Adm. month", Info: newAdmissions.length.toString() });
                returnData.push({ Title: "Present Teachers", Info: presents + "/" + docs.length });
            } else if (Role === "Teacher") {
                const classInfo = await ClassModel.findOne({ TeacherUID: uID }).exec();
                var studentsLength, presentStudents = 0, absentStudents = 0, leaveStudents = 0;
                if (classInfo) {
                    studentsLength = classInfo.StudentUIDs.length;
                    const studentsData = await AttendanceModel.find({ UID: { $in: classInfo.StudentUIDs } })
                    const _date = getDate();
                    for (const student of studentsData) {
                        var _present: boolean | null = AttStatusDay(student.Attendance, _date.Day, "present");
                        if (_present !== null && _present === true) presentStudents++;

                        var _absent: boolean | null = AttStatusDay(student.Attendance, _date.Day, "absent");
                        if (_absent !== null && _absent === true) absentStudents++;

                        var _leave: boolean | null = AttStatusDay(student.Attendance, _date.Day, "leave");
                        if (_leave !== null && _leave === true) leaveStudents++;

                    }
                    returnData.push({ Title: "Students", Info: studentsLength.toString() });
                    returnData.push({ Title: "Present", Info: presentStudents.toString() });
                    returnData.push({ Title: "Absent", Info: absentStudents.toString() });
                    returnData.push({ Title: "Leave", Info: leaveStudents.toString() });
                }
            } else if (Role === "Parent") {

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
            var { Case, SchoolName, CasterRole, uID } = body;
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
                const atids = [];
                const tids = [];
                for (const user of docs) {
                    if (user.Role === "Teacher") tids.push(user.UID);
                    atids.push(user.UID);
                }
                const classes = await ClassModel.find({ TeacherUID: { $in: tids } });
                const attendances = await AttendanceModel.find({ UID: { $in: atids }, Month: currentDate.Month, Year: currentDate.Year });
                for (const user of docs) {
                    proper.push({
                        User: user,
                        Attendance: attendances.find(x => x.UID == user.UID),
                        Class: classes.find(x => x.TeacherUID === user.UID)
                    })
                }

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
            break;
        case "createclass":
            var { SchoolName, ClassName } = body;
            const nuid = UniqueID(8);
            const ndoc = await ClassModel.create({
                _id: new mongoose.Types.ObjectId(),
                SchoolName: SchoolName,
                Name: ClassName,
                UID: nuid
            });
            return NextResponse.json({ message: "OK", doc: ndoc }, { status: 200 });
            break;
        case "getclass":
            var { SchoolName } = body;
            var cdocs = await ClassModel.find({ SchoolName: SchoolName });
            return NextResponse.json({ message: "OK", docs: cdocs }, { status: 200 });
            break;
        case "getusersbyrole":
            var { Role, SchoolName, All } = body;
            var query: getUsersByRoleInterface = { Role: Role, SchoolName: SchoolName };
            if (All === false)
                query = { Role: Role, SchoolName: SchoolName, isActive: true }
            const userDocs = await UserModel.find(query);
            return NextResponse.json({ message: "OK", docs: userDocs }, { status: 200 });
            break;
        case "assignclass":
            var { TeacherUID, ClassUID, Caster } = body;
            try {
                const _class = await ClassModel.findOne({ UID: ClassUID });
                if (_class) {
                    _class.TeacherUID = TeacherUID;
                    await _class.save();

                    //create notificaiton
                    const message = "You have been assigned to class " + _class.Name;
                    var isNotified = false;
                    if (TeacherUID !== "unassigned") {
                        const cf = await NotifModel.create({
                            _id: new mongoose.Types.ObjectId(),
                            From: Caster,
                            Text: message,
                            Title: "Class Assignment",
                            To: TeacherUID
                        });
                        if (cf) isNotified = true;
                    }
                    return NextResponse.json({ message: "OK", isNotified: isNotified }, { status: 200 });
                } else {
                    return NextResponse.json({ message: "ERROR", error: "Class does not exists, please refresh the page.." }, { status: 200 });
                }
            } catch (err) {
                console.log(err);
                return NextResponse.json({ message: "ERROR", error: "There was an error trying to connect to server, please refresh the page.." }, { status: 200 });
            }
            break;
        case "createnotif":
            var { Title, Text, From, To } = body;
            try {
                const cnotif = await NotifModel.create({
                    _id: new mongoose.Types.ObjectId(),
                    Title: Title,
                    Text: Text,
                    From: From,
                    To: To
                });
                if (!cnotif)
                    return NextResponse.json({ message: "ERROR", error: "Unable to create the notification" }, { status: 200 });
                else
                    return NextResponse.json({ message: "OK", doc: cnotif }, { status: 200 });

            } catch (error) {
                return NextResponse.json({ message: "ERROR", error: "There seems to be an error on server side, unable to create the notification" }, { status: 200 });
            }
            break;
        case "getclasses":
            var { SchoolName } = body;
            var subs = await SubjectsModel.findOne({ SchoolName: SchoolName });
            return NextResponse.json({ message: "OK", doc: subs }, { status: 200 });
            break;
        case "createsubject":
            var { SchoolName, SubjectName } = body;
            var subs = await SubjectsModel.findOne({ SchoolName: SchoolName });
            if (!subs) {
                var uuid = UniqueID(8);
                const subject: SubjectDetail = {
                    SubjectName: SubjectName,
                    SubjectTeacherUID: "unassigned"
                }
                const subjects: SubjectDetail[] = [];
                subjects.push(subject);
                const created = await SubjectsModel.create({
                    _id: new mongoose.Types.ObjectId(),
                    UID: uuid,
                    SchoolName: SchoolName,
                    SubjectList: subjects
                });
            } else {
                subs.SubjectList.push({
                    SubjectName: SubjectName,
                    SubjectTeacherUID: "unassigned"
                });
                await subs.save();
            }
            return NextResponse.json({ message: "OK" }, { status: 200 });
            break;
        case "deletesubject":
            try {
                var { SchoolName, SubjectName } = body;
                const subinfo = await SubjectsModel.findOne({ SchoolName: SchoolName });
                var rVal = {
                    message: "ERROR",
                    error: "",
                    doc: subinfo
                }
                if (subinfo) {
                    const newList: SubjectDetail[] = [];
                    for (const subDetail of subinfo.SubjectList) {
                        if (subDetail.SubjectName !== SubjectName)
                            newList.push(subDetail);
                    }
                    subinfo.SubjectList = newList;
                    await subinfo.save();
                    rVal.message = "OK";
                } else {
                    rVal.error = "Subjects model does not exists in the database, please contact the developer";
                }
                return NextResponse.json(rVal, { status: 200 });
            } catch {
                return NextResponse.json({ message: "ERROR", error: "There was an error attempting to alter subject table, please contact the developer" }, { status: 200 });
            }
            break;
        case "assignsubject":
            try {
                var { SchoolName, SubjectName, SubjectTeacherUID, Caster } = body;
                const subject = await SubjectsModel.findOne({ SchoolName: SchoolName });
                var rVal = {
                    message: "ERROR",
                    doc: subject,
                    error: ""
                }
                if (subject) {
                    for (const sub of subject.SubjectList) {
                        if (sub.SubjectName === SubjectName)
                            sub.SubjectTeacherUID = SubjectTeacherUID;
                    }
                    await subject.save();
                    if (SubjectTeacherUID !== "unassigned") {
                        const message = SubjectName + " has been assigned as your primary subject";
                        var isNotified = false;
                        if (TeacherUID !== "unassigned") {
                            const cf = await NotifModel.create({
                                _id: new mongoose.Types.ObjectId(),
                                From: Caster,
                                Text: message,
                                Title: "Subject Assignment",
                                To: SubjectTeacherUID
                            });
                            if (cf) isNotified = true;
                        }
                        console.log(isNotified);
                    }
                    rVal.message = "OK";
                } else {
                    rVal.error = "Unable to locate the school information, please contact the developer!";
                }
                return NextResponse.json(rVal, { status: 200 });
            } catch (error) {
                return NextResponse.json({ message: "ERROR", error: "Unknown Server Error, please contact the developer" }, { status: 200 });
            }
            break;
        case "deleteclass":
            try {
                var { UID, SchoolName } = body;
                const result = await ClassModel.deleteOne({ UID: UID, SchoolName: SchoolName });
                if (result.deletedCount > 0) {
                    return NextResponse.json({ message: "OK", count: result.deletedCount }, { status: 200 });
                } else {
                    return NextResponse.json({ message: "ERROR", error: "Unable to delete the class, please try again or contact the developer" }, { status: 200 });
                }
            } catch (error) {
                return NextResponse.json({ message: "ERROR", error: "Seems to be an error on server side, please contact the developer" });
            }
            break;
        case "getnotifs":
            try {
                var { To } = body;
                const notifs = await NotifModel.find({ To: To, IsRead: false });
                const deletedRows = await NotifModel.deleteMany({ To: To, IsRead: false });
                return NextResponse.json({ message: "OK", docs: notifs, deletedRows: deletedRows.deletedCount });
            } catch (error) {
                return NextResponse.json({ message: "ERROR", error: "Seems to be an error on server side, please contact the developer!" }, { status: 200 });
            }
            break;
        case "edituser":
            var { uid, Name, Email, Gender, Phone, DOB, Password, ProfilePhoto } = body;
            try {
                const user = await UserModel.findOne({ UID: uid }).exec();
                if (user) {
                    user.Name = Name;
                    user.Email = Email;
                    user.Gender = Gender;
                    user.Phone = Phone;
                    user.DOB = DOB;
                    if (ProfilePhoto !== null)
                        user.Image = ProfilePhoto;
                    
                    const isValid = await isPasswordValid(Password, user.Password);
                    if (isValid) {
                        await user.save();
                        return NextResponse.json({ message: "OK", doc: user }, { status: 200 });
                    } else {
                        return NextResponse.json({ message: "ERROR", error: "Incorrect Password, please type in the correct password" }, { status: 200 });
                    }
                } else {
                    return NextResponse.json({ message: "ERROR", error: "There seems to be an issue on server side, please try again or contact the developer" }, { status: 200 });
                }
            } catch (err) {
                return NextResponse.json({ message: "ERROR", error: err }, { status: 200 });
            }
            break;
        default:
            return NextResponse.json({ message: "Invalid Request", body: body }, { status: 200 });
    }
}

import mongoose from "mongoose";

export interface IStudentCard {
    _id: mongoose.Types.ObjectId;
    UID: string;
    Name: string;
    Grade: string;
    ProfileImage: string;
    Gender: string;
    Password: string;
    SchoolName: string;
    ParentId: mongoose.Types.ObjectId;
}
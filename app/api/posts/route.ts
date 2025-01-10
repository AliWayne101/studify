import UserModel from "@/schema/userinfo";
import { Connect } from "@/utils";
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
            console.log("Initiating Signup Process");
            try {
                const doc = await UserModel.create({
                    _id: new mongoose.Types.ObjectId(),
                    Name,
                    Email,
                    Role,
                    SchoolName,
                    Gender,
                    Password,
                    Phone,
                    CNIC,
                    Address
                });
                return NextResponse.json({ message: "OK", doc: doc }, { status: 200 });
            } catch (err) {
                return NextResponse.json({ message: "ERROR", error: err }, { status: 200 });
            }
        default:
            return NextResponse.json({ message: "Invalid Request", body: body }, { status: 200 });
    }
}

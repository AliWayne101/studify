import UserModel from "@/schema/userinfo";
import { Connect } from "@/utils";
import { NextResponse } from "next/server";

export const GET = async () => {
    try {
        await Connect();
        return NextResponse.json({ message: "Hello, this is your response!" });
    } catch (error) {
        console.error('Error in GET request:', error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 200 });
    }
}
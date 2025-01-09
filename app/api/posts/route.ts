import UserModel from "@/schema/userinfo";
import { Connect } from "@/utils";
import { NextApiRequest, NextApiResponse } from "next";

export const POST = async (req: NextApiRequest, res: NextApiResponse) => {
    await Connect();

    const { Request } = req.body;
    switch (Request) {
        case "login":
            const { Email } = req.body;
            UserModel.findOne({ Email: Email })
                .exec()
                .then((doc) => {
                    res.status(200).json({
                        message: "OK",
                        doc: doc
                    });
                }).catch((err) => {
                    res.status(200).json({
                        message: "ERROR",
                        error: err
                    });
                })
            break;
        case "signup":
            break;
        default:
            res.status(200).json({ message: "Invalid request" });
    }
}
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { AuthStatus, User } from "@/types/interface";
import { Request, Response } from "express";
import { JWT_SIGN_KEY } from "@/types/utils";
import usersModel from '@/models/usersModel';
import connectToMongodb from '@/db/mongodb'
export default async function handler(req: Request, res: Response) {
    connectToMongodb();
    let authStatus: AuthStatus = "NONE";
    const { email, password } = req.body;
    try {
        if (req.method === 'POST') {
            const results: User[] = await usersModel.find({ email });
            if (results.length === 0) {
                authStatus = "UNREGISTER_USER"
            } else {
                const hashedPassword = results[0].password;
                const match = await bcrypt.compare(password, hashedPassword as string);
                if (match) {
                    authStatus = "PASSED";
                    // const { name, given_name, family_name, picture, ACN, phone_number, address } = results[0]
                    const token = jwt.sign({ email }, JWT_SIGN_KEY);
                    res.setHeader(
                        "Set-Cookie",
                        `token=${token};  Path=/; Max-Age=${60 * 60//HttpOnly;SameSite=Strict; 
                        }`
                    )
                } else {
                    authStatus = "INVALID_PASSWORD"
                }
            }
            res.status(200).json({ authStatus })
        } else {
            res.status(405).json({ message: 'Method not allowed' })
        }
    } catch (error) {
        console.log("API error", error);
        if (!res.headersSent) {
            res.send(500).json({
                success: false,
                data: "Server error",
            });
        }
    }

}
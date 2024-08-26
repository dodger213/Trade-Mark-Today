import usersModel from "@/models/usersModel";
import { Request, Response } from "express";

export const find = async (req: Request, res: Response) => {
    const list = await usersModel.find();
    res.status(200).json({
        success: true,
        data: list,
    });
}
export const insert = async (req: Request, res: Response) => {
    const user = await usersModel.create(req.body);
    res.status(201).json([user])
}
export const findByEmail = async ({ req, res }: { req: Request, res: Response }, email: string) => {
    const list = await usersModel.find({email});
    res.status(200).json({
        success: true,
        data: list,
    });
}
export const update = async (req: Request, res: Response) => {
    const { email } = req.body
    const users = await usersModel.updateOne(
        { email: email },
        {
            $set: {
                ...req.body
            }
        }
    );
    res.status(201).json({
        success: true,
        data: users,
    });
}
export const remove = async (req: Request, res: Response) => {
    try {
        const result = await usersModel.deleteOne({ email: req.body.email });
        console.log('Model deleted successfully');
    } catch (err) {
        console.error('Error deleting model:', err);
    }
}
import { Request, Response } from "express";
import productsModel from '@/models/productsModel'
export const find = async (req: Request, res: Response) => {
    const list = await productsModel.find();
    res.status(200).json({
        success: true,
        data: list,
    });
}
export const insert = async (req: Request, res: Response) => {
    const user = await productsModel.create(req.body);
    res.status(201).json([user])
}
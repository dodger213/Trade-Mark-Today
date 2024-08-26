
import ClassesModel from "@/models/classesModel";
import { Request, Response } from "express";
import connectToMongodb from '@/db/mongodb'
export default async function handler(req: Request, res: Response) {
  connectToMongodb();
  const { keywords } = req.body;
  try {
    if (req.method === 'GET') {
      const classes = await ClassesModel.find().sort({"class":1});
      res.status(200).json({
        success: true,
        data: classes
      })
    } else {
      res.status(405).json({
        success: false,
        data: "Method not allowed."
      })
    }
  } catch (error) {
    console.log("API error", error);
    if (!res.headersSent) {
      res.status(200).json({
        success: false,
        data: "Server error",
      });
    }
  }
}
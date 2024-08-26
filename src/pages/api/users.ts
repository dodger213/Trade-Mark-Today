import { Request, Response } from "express";
import { find, findByEmail, insert, remove, update } from "@/controllers/users";
import connectToMongodb from '@/db/mongodb'
export default function handler(req: Request, res: Response) {
  connectToMongodb();
  try {
    if (req.method === 'GET') {
      const { email } = req.query;
      const emailAsString = email?.toString() ?? '';
      if (emailAsString === '') {
        find(req, res);
        // res.status(304).json("Fetching user data not allowed.")
      } else {
        findByEmail({ req, res }, emailAsString);
      }
    } 
    else if (req.method === 'POST') {
      insert(req, res);
    } else if (req.method === 'PUT') {
      update(req, res);
    } else if (req.method === 'DELETE') {
      remove(req, res);
    } else {
      res.status(405).json({
        success: false,
        data: "Method not allowed."
      })
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
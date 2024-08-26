import { getSynonyms, searchSimilarWordsFromKeywords } from "@/types/searchs";
import { Request, Response } from "express";
import connectToMongodb from '@/db/mongodb'
export default async function handler(req: Request, res: Response) {
  connectToMongodb();
  const { id, keyword } = req.query;
  try {
    if (req.method === 'GET') {
      let result;
      switch (id as string) {
        case '1':
          result = await searchSimilarWordsFromKeywords(keyword as string);
          break;
        case '2':
          result = await getSynonyms(keyword as string);
          break;
        default:
          break;
      }
      res.status(200).json(result)
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

import { Request, Response } from "express";
export default function handler(req: Request, res: Response) {
    // res.clearCookie('token').redirect('/')
    res.setHeader('Set-Cookie', 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;').redirect('/')
}
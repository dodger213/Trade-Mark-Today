import { Request, Response } from 'express';
import multer from 'multer';
import { NextApiRequest, NextApiResponse } from 'next';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Specify the directory where uploaded files will be stored
        cb(null, 'public/uploads/');
    },
    filename: async function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const originalExtension = file.originalname.split('.').pop();
        const newFileName = file.fieldname + '-' + uniqueSuffix + '.' + originalExtension;
        cb(null, newFileName);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10 MB in bytes
    },
});

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            await new Promise<void>((resolve, reject) => {
                upload.single('image')(req as any, res as any, (err: any) => {
                    console.log(err)
                    if (err instanceof multer.MulterError) {
                        return reject(err);
                    } else if (err) {
                        return reject(err);
                    }
                    if (!(req as any).file) {
                        return reject(new Error('No file was uploaded.'));
                    }

                    resolve();
                });
            });

            res.status(200).json({ filename: (req as any).file.filename });
        } catch (error:any) {
            res.status(400).json({ error: error.message });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}

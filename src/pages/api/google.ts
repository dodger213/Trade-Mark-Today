import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import axios from 'axios'
import jwt from 'jsonwebtoken'
import { JWT_SIGN_KEY } from '@/types/utils';
import usersModel from '@/models/usersModel';
import connectToMongodb from '@/db/mongodb'
export default async function handler(req: Request, res: Response): Promise<void> {
  connectToMongodb();
  const { code } = req.query;
  const codeAsString: string = code?.toString() ?? '';
  // Create a new OAuth client instance
  const oauth2Client = new OAuth2Client(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI);

  try {
    // Verify the authorization code with Google
    const { tokens } = await oauth2Client.getToken(codeAsString);

    // Use the access token to get the user's email address
    const { data: { given_name, family_name, picture, email, name } } = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    // let { data } = await axios.get(`/api/users/${encodeURIComponent(email)}`);
    const data = await usersModel.find({ email });
    if (data.length === 0) {
      // const {data:_data} = await axios.post('/api/users', { given_name, family_name, picture, email, name })
      const _data = await usersModel.create({ given_name, family_name, picture, email, name, ACN: '', phone_number: '', address: '' });
    }
    const token = jwt.sign({ email }, JWT_SIGN_KEY);
    res.setHeader(
      "Set-Cookie",
      `token=${token};  Path=/; Max-Age=${60 * 60//HttpOnly;SameSite=Strict; 
      }`
    ).redirect('/dashboard');

    // res.status(200).json(data).redirect('/summary');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}
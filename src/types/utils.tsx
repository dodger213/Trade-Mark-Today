import axios from 'axios';
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import QueryString from 'qs';
import { v4 as uuidv4 } from 'uuid';

export const JWT_SIGN_KEY = 'de98hw9ew0hbmj6v8sd9w';
export const ADMIN_LIST = ['milkyway464203@gmail.com', 'syedmosawi@gmail.com'];
export function generateNonce() {
  return uuidv4();
}
export const hash = async (password: string) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}
export const validateEmail = (email: string) => {
  const pattern = /^[\w\.-]+@[\w\.-]+\.\w+$/;
  return pattern.test(email);
}
export const generateRandomKey = (length: number) => {
  return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
}
export const getTokenIPAustralia = async () => {
  const data = {
    grant_type: "client_credentials",
    client_id: "P6XvOnJn6FCAjyM1JDYB2Sr5UMGbb5Ob",
    client_secret: "L8lIpwQcqliOkyjGF9Nbie-fw3N_v-K-xh-eQlsmATvf2S-O_Pk0-GEZFOdbVvId"
  }
  const { data: { access_token } } = await axios.post('https://test.api.ipaustralia.gov.au/public/external-token-api/v1/access_token', data, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  return access_token;
}
export const quickSearchIPAustralia = async (query: string, token: string) => {
  const data = {
    changedSinceDate: "2012-01-01",
    filters: {
      quickSearchType: [
        "WORD"
      ],
      status: [
        "REGISTERED"
      ]
    },
    query,
    sort: {
      direction: "ASCENDING",
      field: "NUMBER"
    }
  }
  const { data: { count, trademarkIds } } = await axios.post('https://test.api.ipaustralia.gov.au/public/australian-trade-mark-search-api/v1/search/quick', data, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  return { count, trademarkIds }
}
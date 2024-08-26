import Cookies from 'cookies';
import jwt from 'jsonwebtoken'
import { JWT_SIGN_KEY } from '@/types/utils';
import { Context, User } from '@/types/interface';
const ServerSidePropsAuthorized = (context: Context) => {
  const cookies = new Cookies(context.req, context.res);
  const token = cookies.get('token');
  const tokenAsString = token?.toString() ?? '';
  try {
    const decodedToken = jwt.verify(tokenAsString, JWT_SIGN_KEY) as { email: string };
    // const user: User = decodedToken.user; // Extract the user object from the decoded token
    return { props: { email: decodedToken?.email } };
  } catch (error) {
    return {
      redirect: {
        destination: '/auth',
        permanent: false,
      },
    };
  }


}
export default ServerSidePropsAuthorized;
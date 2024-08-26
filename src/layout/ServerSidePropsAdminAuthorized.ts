import Cookies from 'cookies';
import jwt from 'jsonwebtoken'
import { ADMIN_LIST, JWT_SIGN_KEY } from '@/types/utils';
import { Context, User } from '@/types/interface';
const ServerSidePropsAdminAuthorized = (context: Context) => {
  const cookies = new Cookies(context.req, context.res);
  const token = cookies.get('token');
  const tokenAsString = token?.toString() ?? '';
  try {
    const decodedToken = jwt.verify(tokenAsString, JWT_SIGN_KEY) as { email: string };
    // const user: User = decodedToken.user; // Extract the user object from the decoded token

    if (ADMIN_LIST.some(em => em === decodedToken?.email)) {
      return { props: { email: decodedToken?.email } };
    } else {
      return {
        redirect: {
          destination: '/auth',
          permanent: false,
        },
      };
    }
  } catch (error) {
    return {
      redirect: {
        destination: '/auth',
        permanent: false,
      },
    };
  }


}
export default ServerSidePropsAdminAuthorized;
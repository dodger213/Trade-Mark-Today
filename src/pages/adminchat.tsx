import TMCheckLayout from '../layout/TMCheckLayout';
import ChatAdmin from '@/components/ChatAdmin';
import ServerSidePropsAdminAuthorized from '@/layout/ServerSidePropsAdminAuthorized';
const AdminChat = ({ email }: { email: string }) => {
  return (
    <>
      <ChatAdmin />
    </>
  )
}
AdminChat.getLayout = TMCheckLayout;
export const getServerSideProps = ServerSidePropsAdminAuthorized;
export default AdminChat;
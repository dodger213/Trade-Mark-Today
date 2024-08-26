import TMCheckLayout from '../layout/TMCheckLayout';
import { User } from '@/types/interface';
import ChatAdmin from '@/components/ChatAdmin';
import ServerSidePropsAdminAuthorized from '@/layout/ServerSidePropsAdminAuthorized';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
const AdminChat = ({ email }: { email: string }) => {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  useEffect(() => {
    (async () => {
      const { data: { data } } = await axios.get(`/api/users`);
      setAllUsers(data)
    })()
  }, [])
  return (
    <>
      <div className='mx-auto w-9/12'>
        <style jsx> {`
            div.grid>div {display: flex;justify-content: center;align-items: center;cursor:pointer;}
            div.grid:nth-child(even) {background-color:#f1f1f1;}
            div.grid {
              transition-property: all;
              transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
              transition-duration: 150ms;
              transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
              transition-duration: 700ms;
              // border-radius: 0.5rem
            }
            div.grid:hover {background-color:#ccf2fc}
        `} </style>
        <div className='grid grid-cols-12 gap-4 w-full px-3 h-12 font-bold text-md'>
          <div className='col-span-1'> </div>
          <div className='col-span-1'>Applicant(s)</div>
          <div className='col-span-3'>Email</div>
          <div className='col-span-2'>Phone Number</div>
          <div className='col-span-2'>Address</div>
          <div className='col-span-1'>ACN</div>
          <div className='col-span-1'>Given Name</div>
          <div className='col-span-1'>Family Name</div>
        </div>
        <div className='w-full text-center'>
          {allUsers.map((item, i) =>
            <div className='grid grid-cols-12 w-full py-2 border-t border-gray-300 px-3' key={i}>
              <div className='col-span-1'>
                <Image className='rounded-full mr-2 p-3' src={item?.picture as string} alt="logo" loading='lazy' onError={(e) => e.currentTarget.src = "/no-avatar.png"} width={100} height={150} />
              </div>
              <div className='col-span-1'>{item.name}</div>
              <div className='col-span-3'>{item.email}</div>
              <div className='col-span-2'>{item.phone_number}</div>
              <div className='col-span-2'>{item.address}</div>
              <div className='col-span-1'>{item.ACN}</div>
              <div className='col-span-1'>{item.given_name}</div>
              <div className='col-span-1'>{item.family_name}</div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
AdminChat.getLayout = TMCheckLayout;
export const getServerSideProps = ServerSidePropsAdminAuthorized;
export default AdminChat;
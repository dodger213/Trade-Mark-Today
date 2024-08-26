import TMCheckLayout from '../layout/TMCheckLayout';
import ServerSidePropsAuthorized from '@/layout/ServerSidePropsAuthorized';
import Chat from '@/components/Chat';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { User } from '@/types/interface';
import axios from 'axios';
const Profile = ({ email }: { email: string }) => {
  const [user, setUser] = useState<User>()
  useEffect(() => {
    (async () => {
      if (!email) return;
      const { data: { data } } = await axios.get(`/api/users?email=${encodeURIComponent(email)}`);
      setUser(data[0])
    })()
  }, [email])
  return (
    <>
      <main className='max-w-7xl mx-auto px-6 py-4'>
        <h1 className='font-mont text-3xl pb-6'>My profile</h1>
        <div className='grid grid-cols-3 w-full gap-8'>
          <div className='flex flex-col gap-2 items-center justify-center rounded-xl shadow-[0_2px_10px_#00000040] '>
            <Image className='rounded-full mr-2' src={user?.picture as string} alt="logo" loading='lazy' onError={(e) => e.currentTarget.src = "/no-avatar.png"} width={150} height={150} />
            <button className='flex justify-center items-center w-36 h-8 font-semibold rounded-md border border-[#ccc]'>Edit Profile</button>
            <h3 className='text-[24px] font-bold'>{user?.name}</h3>
            <h4>{user?.address}</h4>
          </div>
          <div className='col-span-2 flex flex-col gap-2 p-6 rounded-xl shadow-[0_2px_10px_#00000040] '>
            <div className='flex border-b border-[#ccc] py-4'>
              <h5 className='w-1/4'>Applicants</h5>
              <h5 className='text-[#777]'>{user?.name}</h5>
            </div>
            <div className='flex border-b border-[#ccc] py-4'>
              <h5 className='w-1/4'>Email</h5>
              <h5 className='text-[#777]'>{user?.email}</h5>
            </div>
            <div className='flex border-b border-[#ccc] py-4'>
              <h5 className='w-1/4'>Phone Number</h5>
              <h5 className='text-[#777]'>{user?.phone_number}</h5>
            </div>
            <div className='flex border-b border-[#ccc] py-4'>
              <h5 className='w-1/4'>Address</h5>
              <h5 className='text-[#777]'>{user?.address}</h5>
            </div>
            <div className='flex border-b border-[#ccc] py-4'>
              <h5 className='w-1/4'>ACN</h5>
              <h5 className='text-[#777]'>{user?.ACN}</h5>
            </div>
          </div>
        </div>
      </main>
      <Chat />
    </>
  )
}
Profile.getLayout = TMCheckLayout;
export const getServerSideProps = ServerSidePropsAuthorized;
export default Profile;
import TMCheckLayout from '../layout/TMCheckLayout';
import { Alert3 } from '@/components/AlertContainers';
import ServerSidePropsAuthorized from '@/layout/ServerSidePropsAuthorized';
import Link from 'next/link';
import Image from 'next/image';
import Chat from '@/components/Chat';
import { useContext, useEffect } from 'react';
import { PiniaStore } from '@/store/store';
import { useRouter } from 'next/router';
const Dashboard = ({ email }: { email: string }) => {
  const { pinia, setPinia } = useContext(PiniaStore);
  const router = useRouter();
  // useEffect(() => {
  //     if (Object.keys(pinia).length === 0 && pinia.constructor === Object) {
  //         // router.push('/consider')
  //         return;
  //     }      
  // }, [pinia])
  useEffect(()=>{
    router.push('/checkout')
  },[])
  return (
    <>
      <main className='max-w-7xl mx-auto px-6 py-4'>
        <div className="grid gap-y-6">
          <h1 className='font-mont text-3xl'>Dashboard Test</h1>

          <Alert3 msg={
            <>
              This page is only for testing purpose. <strong>You can see this page because you have logged in.</strong>
            </>
          } />
          <Chat/>
        </div>
      </main>
    </>
  )
}
Dashboard.getLayout = TMCheckLayout;
export const getServerSideProps = ServerSidePropsAuthorized;
export default Dashboard;
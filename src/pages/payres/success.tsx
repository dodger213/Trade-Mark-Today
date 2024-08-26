import ServerSidePropsAuthorized from '@/layout/ServerSidePropsAuthorized';
import Chat from '@/components/Chat';
import bcrypt from 'bcryptjs'
import TMCheckLayout from '@/layout/TMCheckLayout';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Image from 'next/image';
const Paysuccess = ({ email }: { email: string }) => {
  const router = useRouter();
  const transactionKey = router.query.transactionKey as string;
  const [waiting, setWaiting] = useState(true);
  useEffect(() => {
    const hashedTransactionKey = sessionStorage.getItem('transactionKey');
    if (!transactionKey || !hashedTransactionKey) {
      router.push('/payres/fail?reason=1')
    }

    bcrypt.compare(transactionKey, hashedTransactionKey as string).then((match) => {
      if (match) {
        //! Add in database here.
        //! And then redirect after await.
        setWaiting(false);
        sessionStorage.removeItem('transactionKey');
        setTimeout(() => {
          router.push('/profile')
        }, 10000)
      } else {
        router.push('/payres/fail?reason=2')
      }
    }).catch((err: any) => {
      router.push('/payres/fail?reason=3')
    });
  }, [])
  return (
    <>
      {waiting ?
        <>Processing</> :
        <main className='max-w-7xl mx-auto px-6 py-4'>
          <div className="grid gap-y-6">
            <h1 className='font-mont text-3xl'> Payment Succeed</h1>
            <h3>transactionKey:{transactionKey}</h3>
            <h3>Processing...</h3>
            <Image src={`/loading${Math.floor(Math.random() * 9)}.gif`} alt="logo" priority width={440} height={232} />
            <Chat />
          </div>
        </main>}
    </>
  )
}
Paysuccess.getLayout = TMCheckLayout;
export const getServerSideProps = ServerSidePropsAuthorized;
export default Paysuccess;
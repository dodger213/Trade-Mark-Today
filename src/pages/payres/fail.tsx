import ServerSidePropsAuthorized from '@/layout/ServerSidePropsAuthorized';
import Chat from '@/components/Chat';
import TMCheckLayout from '@/layout/TMCheckLayout';
import { useRouter } from 'next/router';
const Payfail = ({ email }: { email: string }) => {
  const router = useRouter();
  const reasonNumber = router.query.reason as string;
  return (
    <>
      <main className='max-w-7xl mx-auto px-6 py-4'>
        <div className="grid gap-y-6">
          <h1 className='font-mont text-3xl'> Payment Failed (reasonNumber: {reasonNumber}) </h1>
          <p>Tell me why I failed to pay.</p>
          <Chat />
        </div>
      </main>
    </>
  )
}
Payfail.getLayout = TMCheckLayout;
export const getServerSideProps = ServerSidePropsAuthorized;
export default Payfail;
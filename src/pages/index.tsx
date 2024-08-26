import { useRouter } from 'next/router';
import { useEffect, type ReactElement } from 'react'
import TMCheckLayout from '../layout/TMCheckLayout';
const Index = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/start');
  }, []);

  return <p>This page will be redirected...</p>;
}
Index.getLayout = TMCheckLayout;
export default Index;
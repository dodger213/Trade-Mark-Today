import TMCheckLayout from '../layout/TMCheckLayout';
import ServerSidePropsAuthorized from '@/layout/ServerSidePropsAuthorized';
import Chat from '@/components/Chat';
import Image from 'next/image';
import dotenv from 'dotenv'
dotenv.config({ path: "./.env" });
import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

import { useContext, useEffect, useState } from 'react';
import { PiniaStore } from '@/store/store';
import axios from 'axios';
import { ClassBadge } from './classify';
import { useRouter } from 'next/router';
import { generateRandomKey, hash } from '@/types/utils';

const ChecoutItemA = ({ title, msg }: { title: string, msg: string }) => {
  return (
    <>
      <h4 className='flex gap-2 items-start'>
        <span className='bg-green-600 inline-block p-1 py-0 mx-1 text-white'>&#10003;</span>
        <div className='flex justify-between w-full gap-10'>
          <p> {title} </p>
          <p> {msg} </p>
        </div>
      </h4>
    </>
  )
}
const Checkout = ({ email }: { email: string }) => {
  const { pinia, setPinia } = useContext(PiniaStore);
  const [price, setPrice] = useState(0)
  const router = useRouter();
  useEffect(() => {
    if ((pinia?.classes !== undefined && !(Object.keys(pinia.classes).length === 0 && pinia.classes.constructor === Object))) {
      const price_value = (Object.keys(pinia.classes).length * 590 - (Object.keys(pinia.classes).length - 1) * 100);
      if (price_value === 0) {
        router.push('/apply');
      } else {
        setPrice(price_value)
      }
    } else {
      if (pinia?.initiated) {
        router.push('/apply');
      }
    }
  }, [pinia])
  const handlePay = async () => {
    if (!price || price === 0) {
      // router.push('/apply');
      return;
    }
    const stripe = await stripePromise;
    const transactionKey = generateRandomKey(16);
    sessionStorage.setItem('transactionKey', await hash(transactionKey));
    const { data: { id } } = await axios.post('/api/create-checkout-session', { price: price + 200, transactionKey }); console.log(id)
    // const session = await response.json(); console.log(session)
    const result = await stripe?.redirectToCheckout({ sessionId: id });

    if (result?.error) {
      // Handle error
      console.error(result.error.message);
    }
  };
  return (
    <>
      <main className='max-w-7xl mx-auto px-6 py-4'>
        <div className="grid gap-y-6">
          <div className='flex w-full justify-center gap-1 relative pt-10'>
            <Image alt="img" src='/see-this.png' className=' rounded-2xl absolute bottom-0 transition-all ease-in-out duration-500 -left-[10px] w-[300px] lg:w-[500px]' loading="lazy" onError={(e) => e.currentTarget.src = "/no-avatar.png"} width={600} height={200} />
            <div className='flex flex-col gap-6 w-[500px] p-10 font-mont rounded-2xl bg-white shadow-[0_2px_10px_#00000040]  justify-center items-center'>
              <h1 className='text-7xl text-red-500'>{(price + 200).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</h1>
              <h2 className='text-2xl'>For Trade Mark Filing</h2>
              <div className='flex flex-col justify-start w-96 gap-4 '>
                <ChecoutItemA title='For basic cost' msg={price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} />
                <div>
                  <div id="pricingCard" className="flex flex-col w-full pl-20 ">
                    {pinia?.classes !== undefined && Object.keys(pinia.classes).map((classKey: string, index: number) => (
                      <div key={index} className="flex flex-col gap-6 ">
                        <div className="flex justify-between w-full pr-2 text-xs [font-family:Arial]">
                          Class {classKey}
                          {index > 0 ? <div><span className="line-through decoration-2 decoration-black text-red-500 font-bold pr-4">$590</span>$490</div> : <span>$590</span>}
                        </div>
                        {/* <div className="flex flex-wrap gap-2">
                          {pinia?.classes !== undefined && pinia.classes[classKey] && pinia.classes[classKey].map((item, index_inner) => (
                            <button key={index_inner} className="flex gap-2 text-[12px] leading-6 items-center bg-[#F9F9F9] py-1 px-2 box-border outline-1 rounded-md outline-black">
                              <span>{item.description}</span>
                            </button>
                          ))}
                        </div> 
                        <hr />
                        */}
                      </div>
                    ))}
                    <div className="flex justify-between w-full px-2 py-4 mt-4 bg-[#f2f2f6] text-[16px] font-bold">
                      <span>Sub Total</span>
                      <span>${(pinia?.classes !== undefined && !(Object.keys(pinia.classes).length === 0 && pinia.classes.constructor === Object)) ? (Object.keys(pinia.classes).length * 590 - (Object.keys(pinia.classes).length - 1) * 100) : 0}</span>
                    </div>
                  </div>
                </div>
                <ChecoutItemA title='Expedite Examination' msg='$90.00' />
                <ChecoutItemA title='Use Trade Mark Today&apos;s address as Owner&apos;s address' msg='$20.00' />
                <ChecoutItemA title='Pre-filing review by an Australia Registered Trade Mark Attorney' msg='$90.00' />
              </div>
              <button onClick={handlePay} className='flex justify-center items-center text-white font-mont w-48 h-16 text-2xl rounded-md shadow-[0_2px_10px_#00000040] [text-shadow:_1px_3px_5px_rgb(0_0_0_/_100%)] transition-all ease-in-out duration-1000 bg-gradient-to-t from-amber-400 to-amber-700 border hover:border-black'>Checkout</button>
            </div>
          </div>
        </div>
      </main>
      <Chat />
    </>
  )
}
Checkout.getLayout = TMCheckLayout;
export const getServerSideProps = ServerSidePropsAuthorized;
export default Checkout;
import Image from "next/image";
import { useRouter } from "next/router";
import Link from "next/link";
import TMCheckLayout from "../layout/TMCheckLayout";
import Chat from "@/components/Chat";
import { useContext, useEffect } from "react";
import { PiniaStore } from "@/store/store";

const Start = () => {
  const { pinia, setPinia } = useContext(PiniaStore);
  const router = useRouter();
  useEffect(() => {
    setPinia({ ...pinia, initiated: true })
  }, [])
  const handleClick = () => {
    router.push('/consider');
  }
  return (
    <main className='max-w-7xl mx-auto px-10 md:px-6 py-4 h-[900px]'>
      <section className='grid gap-12 justify-end'>
        <div className='pt-8 flex gap-4'>
          <h1 className='font-mont leading-[40px] md:leading-[80px] text-[24px] md:text-[50px] text-white [text-shadow:_1px_3px_5px_rgb(0_0_0_/_100%)] pt-20 text-right w-full cursor-pointer hover:scale-110 lg:hover:scale-125 ease-in-out duration-1000'>Don&apos;t let copycats hijack <br /> your brand&apos;s identity</h1>
          {/* <div className='flex justify-center items-center bg-[#E0F3F4] px-4 py-2 rounded-sm font-bold'><span>TM</span></div> */}
        </div>
        <div className="flex flex-col gap-4 items-end text-white [text-shadow:_1px_3px_5px_rgb(0_0_0_/_100%)]">
          <div className="flex flex-col md:flex-row gap-4 md:gap-0 font-mont text-xs md:text-[20px] text-center items-end md:items-center rounded-full w-fit">{/*  bg-white/60 shadow-[0_0_8px_8px_rgba(255,255,255,0.6)] */}
            <p className="px-2">Let&apos;s kick off the process of</p>
            <div className="badge-container leading-[45px] text-[30px] inline-block overflow-y-clip w-[250px] px-3 py-6 h-[32px] mx-2 bg-red-500/90 text-blue-100 rounded-xl relative  hover:shadow-[0px_0px_3px_3px_#333] hover:scale-150 transition-all ease-in-out duration-1000 cursor-pointer">{/*  shadow-[0_0_8px_8px_#ccc] */}
              <style jsx>{`
                  div.badge-content {
                    animation-name: badgeflowing;
                    animation-duration: 10s;
                    animation-iteration-count: infinite;
                  }
            `}</style>
              <div className="badge-content flex flex-col text-center absolute w-full -left-[2px] -top-[8px] gap-3 py-2 cursor-pointer">
                <h2>Protecting</h2>
                <h2>Registering</h2>
                <h2>Creating</h2>
                <h2>Protecting</h2>
              </div>
            </div>
          </div>
          <div className="px-2 font-mont text-xs md:text-[20px] flex items-center rounded-full w-fit">{/*  bg-white/60 shadow-[0_0_8px_8px_rgba(255,255,255,0.6)] */}
            your brand
            and have some fun while doing it!
          </div>
        </div>
        <div className="flex w-full justify-end">
          <div className="max-w-xl flex flex-col gap-16 text-right text-white [text-shadow:_1px_3px_5px_rgb(0_0_0_/_100%)]">
            <div className=" flex flex-col gap-8 transition-all ease-in-out duration-1000 cursor-pointer hover:scale-125">
              <div className='flex gap-4 items-center'>{/*  bg-white/60 shadow-[0_0_8px_8px_rgba(255,255,255,0.6)] rounded-full */}
                <div className='w-11 h-11 py-1 flex items-center text-center'>
                  <Image className='max-h-screen hover:scale-150 transition-all ease-in-out duration-300 cursor-pointer' alt="image" loading='lazy' src="/clock.png" width={50} height={50} />
                </div>
                <p className='text-[14px] rounded-full'>Minutes matter! Get free initial trade mark check done <strong>in minutes</strong>!</p>
              </div>
              <div className='flex gap-4 items-center'>{/*  bg-white/60 shadow-[0_0_8px_8px_rgba(255,255,255,0.6)] rounded-full */}
                <div className='w-11 h-11 py-1 flex items-center text-center'>
                  <Image className='max-h-screen hover:scale-150 transition-all ease-in-out duration-300 cursor-pointer' alt="image" loading='lazy' src="/dollar.png" width={50} height={50} />
                </div>
                <p className='text-[14px] rounded-full'>Register your trade mark in <strong>Australia</strong> for as little as $590.</p>
              </div>
            </div>
            <div className='flex justify-between gap-4 items-center transition-all ease-in-out duration-1000 cursor-pointer hover:scale-125'>
              <Link className='text-[22px] underline hover:no-underline text-white font-bold rounded-md transition-all ease-in-out p-2' href="#"> More about trade marks</Link>
              <button onClick={handleClick} className='rounded-md font-semibold hover:bg-blue-500 transition-all ease-in-out bg-pink-500 w-48 h-12 text-white'>Start</button>
            </div>
          </div>
        </div>
      </section>
      <Chat />
      <div id="start-back-image" className='flex fixed transition-all ease-in-out duration-500 right-40 md:right-0 top-0 w-full items-end justify-start -z-10'>
        <Image className='min-w-[1500px]' alt="image" priority layout='responsive' src="/back-image.avif" width={1250} height={10} placeholder="blur"
          blurDataURL="data:image/avif;base64,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" />
        {/* https://images.unsplash.com/photo-1497215842964-222b430dc094?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGJ1c2luZXNzJTIwYmFja2dyb3VuZHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=1700&q=60 
        https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8d29ya3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=1700&q=60
        */}
        <div
          className="absolute w-[200%] inset-0 bg-white/10  from-white/95  to-white/25 ltr:sm:bg-gradient-to-r rtl:sm:bg-gradient-to-l "
        ></div>
      </div>
    </main>
  )
}
Start.getLayout = TMCheckLayout;
export default Start;
import Image from "next/image"
import Link from "next/link";
import UserInfoAvatar from "./UserInfoAvatar";
import { useRouter } from "next/router";
import jwt from 'jsonwebtoken'
import { useEffect, useState } from "react";
import { User } from "@/types/interface";
import { parseCookies } from "nookies";
import { ADMIN_LIST, JWT_SIGN_KEY } from "@/types/utils";
export const verifyToken = () => {
    let _user_: { email: string } | undefined;
    const cookies = parseCookies();
    const token = cookies.token;
    try {
        _user_ = jwt.verify(token, JWT_SIGN_KEY) as { email: string }
    } catch (error) {
        _user_ = undefined;
    }
    return _user_;
}
const Header = () => {
    const [userEmail, setUserEmail] = useState('');
    const router = useRouter();
    const setUseremailFromToken = () => {
        const email = verifyToken()?.email;
        setUserEmail(email as string)
    }
    useEffect(() => setUseremailFromToken(), [])
    useEffect(() => {
        const handleRouteChange = (url: string) => {
            setTimeout(() => { setUseremailFromToken() }, 1000);
        };

        router.events.on('routeChangeStart', handleRouteChange);

        return () => {
            router.events.off('routeChangeStart', handleRouteChange);
        };
    }, []);

    return (
        <>
            <UserInfoAvatar email={userEmail} />
            <header className='bg-white/90 text-black shadow-[0_0_1px_1px_#ccc] fixed top-0 w-full z-50'>
                {/* 373f86  border-b-[5px] border-[#DE4326] */}
                <div className='max-w-7xl min-w-[400px] px-6 flex mx-auto items-center justify-between'>
                    <div className="flex items-center gap-2">

                        <Link href='/' className='py-[10px] gap-4 flex-row flex md:scale-80 scale-75'>
                            <button>
                                <div className="flex h-14 items-center hover:scale-125 transition-all ease-in-out duration-1000 ">
                                    <Image src="/trademarktoday_logo.png" alt="Logo" width={150} height={48} priority style={{ visibility: 'visible' }} />
                                </div>
                            </button>
                            <div className='w-0 border-r hidden md:block border-black'></div>
                            {/* <button className=' hidden md:block font-mont text-2xl italic text-red-500'>Trade Mark Today</button> */}
                        </Link>
                        <ul className="md:flex hidden gap-y-0 gap-x-4 sm:gap-4 pl-4 cursor-pointer flex-wrap text-xs md:text-[16px]">
                            <li>About Us</li>
                            <li>Services</li>
                            <li>Pricing</li>
                            <li>Resources</li>
                            <li onClick={() => router.push('/checkout')} className="hover:border-b border-black">Apply Filing</li>
                            {ADMIN_LIST.some(em => em === userEmail) && <>
                                <li onClick={() => router.push('/adminchat')} className="hover:border-b border-black text-red-600 font-mont">Chat with users</li>
                                <li onClick={() => router.push('/adminusers')} className="hover:border-b border-black text-red-600 font-mont">User manangement</li>
                            </>}
                        </ul>
                    </div>
                    <nav className="mr-36 md:mr-36 flex 2xl:mr-0">
                        <button className='px-1 md:px-3 '>
                            <div className='flex flex-row gap-1 text-xs md:text-sm items-center'>
                                <div className='w-6 h-6 md:w-8 md:h-8 py-1 flex items-center text-center'><Image width={36} height={36} src='/icons8-help-94.png' alt="help" loading="lazy" /></div> <span className="hidden md:block">Help</span>
                            </div>
                        </button>
                        <button className='px-1 md:px-3 '>
                            <div className='flex flex-row gap-1 text-xs md:text-sm items-center'>
                                <div className='w-6 h-6 md:w-8 md:h-8 py-1 flex items-center text-center'><Image width={36} height={36} src='/icons8-popular-94.png' alt="help" loading="lazy" /></div> <span className="hidden md:block">Feedback</span>
                            </div>
                        </button>
                    </nav>
                </div>
            </header>
        </>
    )
}
export default Header;
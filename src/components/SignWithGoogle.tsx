import Image from "next/image";
import Link from "next/link";
const SignWithGoogle = () => {

    const GOOGLE_AUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}&response_type=code&scope=https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile&redirect_uri=${process.env.NEXT_PUBLIC_REDIRECT_URI}`;
    return (
        <Link href={GOOGLE_AUTH_URL}>
            <button className="w-60 p-2 rounded-md border border-black hover:bg-slate-100 transition-all ease-in-out duration-500 flex justify-center gap-3 items-center font-bold">
                <Image alt="google" src="/google.png" width={30} height={30} loading="lazy" />
                Sign with Google
            </button>
        </Link>
    )
}
export default SignWithGoogle;
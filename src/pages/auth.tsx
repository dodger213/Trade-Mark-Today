import Image from "next/image";
import MyTab from "../components/MyTab";
import { useContext, useReducer, useState } from "react";
import Login from "@/components/Login";
import SignUp from "@/components/SignUp";
import SignWithGoogle from "@/components/SignWithGoogle";
import { MessageBoxModal, OTPModal } from "@/components/Modal";
import { OTPStore, initialState } from "@/store/store";
import reducer from "@/store/reducer";
import WaitingLocker from "@/components/WaitingLocker";
import { useRouter } from "next/router";
import { verifyToken } from "@/components/Header";

const Auth = () => {
    const router = useRouter();
    if(verifyToken()){
        router.push('/dashboard')
    }
    const [otpState, dispatchOtpState] = useReducer(reducer, initialState);
    const [value, setValue] = useState(0);
    const [msg, setMsg] = useState("Already registered user");
    const [open, setOpen] = useState(false);
    return (
        <OTPStore.Provider value={{ otpState, dispatchOtpState }}>
            <div id="login-body" className="bg-[#f2f2f6] w-screen h-screen flex justify-center items-center">

                <OTPModal openState={{ open, setOpen }} setMsg={setMsg} />
                <div className="flex flex-col justify-center items-center gap-4 w-96 p-5 pt-12 rounded-md bg-white shadow-[0px_1px_2px_#000]">
                    <Image onClick={() => router.push('/')} className="cursor-pointer hover:scale-150 transition-all ease-in-out duration-700" src="/trademarktoday_logo.png" alt="logo" priority width={188} height={58} />
                    <h2 className="text-[22px] leading-[30px] font-mont">Login to your account</h2>
                    <SignWithGoogle />
                    <MyTab props={{ value, setValue }} titles={["Log In", "Sign Up"]}>
                        <Login openState={{ open, setOpen }} setMsg={setMsg} />
                        <SignUp value={value} openState={{ open, setOpen }} setMsg={setMsg} />
                    </MyTab>
                </div>
            </div>

            <MessageBoxModal openState={{ open, setOpen }} title="Warning" msg={msg} />
            <WaitingLocker msg="Confirming your credential" waiting={otpState.waiting} />
        </OTPStore.Provider>
    )
}
export default Auth;
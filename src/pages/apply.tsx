import { useContext, useEffect, useState } from "react";
import WaitingLocker from "../components/WaitingLocker";
import { TMCheckerElement } from "../components/ProgressIndicator";
import Link from "next/link";
import { TimeBarAs } from "../components/PortalSummaryA";
import { Checkbox } from "@mui/material";
import { useRouter } from "next/router";
import { AlertErr } from "../components/AlertContainers";
import { ConfirmSignForApplyModal } from "../components/Modal";
import TMCheckLayout from "../layout/TMCheckLayout";
import Chat from "@/components/Chat";
import { PiniaStore } from "@/store/store";
import { verifyConsider } from "./select";
import { verifySelect } from "./classify";
import { verifyClassify } from "./summary";
import { verifyToken } from "@/components/Header";

const Apply = () => {
    const { pinia, setPinia } = useContext(PiniaStore);
    useEffect(() => {
        if (Object.keys(pinia).length === 0 && pinia.constructor === Object) {
            // router.push('/consider')
            return;
        }
        if (!verifyConsider(pinia)) {
            router.push('/consider')
        } else if (!verifySelect(pinia)) {
            router.push('/select')
        } else if (!verifyClassify(pinia)) {
            router.push('/classify')
        }
    }, [pinia])
    const [waiting, setWaiting] = useState(false);
    const [checked, setChecked] = useState(false);
    const [open, setOpen] = useState(false);
    const [showAlertForCheck, setShowAlertForCheck] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const router = useRouter();
    const handleClick = () => {
        if (!checked) {
            setShowAlertForCheck(true)
            setShowAlert(true);
            window.scrollTo(0, 0)
        } else {
            if (verifyToken()) {
                router.push('/checkout')
            } else {
                setOpen(true)
            }            
        }
    }
    const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(e.target.checked)
        setShowAlertForCheck(!e.target.checked);
    }
    return (
        <>
            <main className='max-w-7xl mx-auto px-6 py-4'>
                <div className="grid gap-y-6">
                    <TMCheckerElement />
                    <AlertErr showAlert={showAlert} msg="You must acknowledge your understanding to continue." />
                    <section id="contentMain" className="flex flex-col gap-6">
                        <h1 className="font-mont text-[32px] leading-10">Trade mark application</h1>
                        <p>This process should take a couple of minutes to complete.</p>
                        <div className="flex flex-col gap-6 py-5 px-6 border border-[#C8CAD0] border-t-[5px] border-t-[#040C13] rounded-md">
                            <h2 className="text-[24px] leading-9 font-mont">What you&apos;ll need</h2>
                            <div className="flex flex-col gap-4 text-[16px] leading-6 text-[#72757e]">
                                <div className="flex gap-4">
                                    <svg className='self-center w-[18px] h-[18px] align-baseline inline-block stroke-current fill-none'><use href="#individual"></use></svg>
                                    <p>Sign up with Trade Mark Today</p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-4 text-[16px] leading-6 text-[#72757e]">
                                <div className="flex gap-4">
                                    <svg className='self-center w-[18px] h-[18px] align-baseline inline-block stroke-current fill-none'><use href="#checklist"></use></svg>
                                    <p>Trade mark owner details</p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-4 text-[16px] leading-6 text-[#72757e]">
                                <div className="flex gap-4">
                                    <svg className='self-center w-[18px] h-[18px] align-baseline inline-block stroke-current fill-none'><use href="#credit-card"></use></svg>
                                    <p>Payment method</p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-4 text-[16px] leading-6 text-[#72757e]">
                                <div className="flex gap-4">
                                    <svg className='self-center w-[18px] h-[18px] align-baseline inline-block stroke-current fill-none'><use href="#info-circle"></use></svg>
                                    <p>
                                        For more information, read our
                                        <Link href="#" className="underline p-1 hover:no-underline hover:bg-[#F2F2F6] font-bold" >
                                            FAQ on applying.
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <h2 className="font-mont text-[24px] leading-9">Application Process and Costs</h2>
                        <TimeBarAs />
                        <div className=" flex flex-col">
                            <div className="flex gap-2 items-center">
                                <Checkbox size="small" checked={checked} onChange={handleCheck} />
                                <p className="text-[16px] leading-6">I acknowledge that the outcome of this application will be determined by the Examiner at IP Australia</p>
                            </div>
                            {showAlertForCheck && <p id="alert-check" className="pl-2 text-[14px] leading-6 text-[#c12]">You must acknowledge your understanding to continue.</p>}
                        </div>
                    </section>
                </div>
                <WaitingLocker waiting={waiting} />
            </main>
            <Chat />
            <div className="col-span-12 py-4 sticky w-full bottom-0 bg-white shadow-[0_-1px_2px_#000]">
                <div className="max-w-7xl mx-auto px-6 flex gap-5 ">
                    <button onClick={() => router.back()} className='rounded-md font-semibold hover:bg-[#72757E] transition-all flex justify-start gap-4 items-center px-4 ease-in-out text-[#1D252C] w-[140px] h-[46px] bg-white border border-black hover:text-white'>
                        <svg className='w-[17px] h-[17px] align-baseline inline-block stroke-current'><use href="#arrow-left"></use></svg>
                        Back
                    </button>
                    <ConfirmSignForApplyModal openState={{ open, setOpen }}>
                        <button onClick={handleClick} className='rounded-md font-semibold hover:bg-[#72757E] transition-all flex justify-between gap-4 items-center px-4 ease-in-out bg-[#373f86] w-[140px] h-[46px] text-white'>
                            Apply
                            <svg className='w-[17px] h-[17px] align-baseline inline-block stroke-white'><use href="#arrow-right"></use></svg>
                        </button>
                    </ConfirmSignForApplyModal>

                </div>
            </div>
        </>
    )
}
Apply.getLayout = TMCheckLayout;
export default Apply;
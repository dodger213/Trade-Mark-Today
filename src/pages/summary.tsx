import { ReactNode, useContext, useEffect, useState } from "react";
import WaitingLocker from "../components/WaitingLocker";
import { useRouter } from "next/router";
import ProgressIndicator from "../components/ProgressIndicator";
import Link from "next/link";
import Image from "next/image";
import PortalSummaryA from "../components/PortalSummaryA";
import PortalSummaryB from "../components/PortalSummaryB";
import { ConfirmStartAgainModal } from "../components/Modal";
import { Alert2, Alert4 } from "../components/AlertContainers";
import TMCheckLayout from "../layout/TMCheckLayout";
import { PiniaStore } from "@/store/store";
import Chat from "@/components/Chat";
import { verifyConsider } from "./select";
import { verifySelect } from "./classify";
import { PiniaType } from "@/types/interface";

const CardContainer = ({ children }: { children: ReactNode }) => {
    return (
        <a target="_blank" href="#" className="flex flex-col justify-center w-full h-[120px] shadow-[1px_1px_4px_#00000040] border border-[#c8cad0] rounded-md py-1 px-2">
            <div className="flex justify-between w-full">
                <span className="text-[#72757e] text-[14px]">#1</span>
                <div className="flex gap-2">
                    <strong className="underline text-[14px]">Details</strong>
                    <svg className='w-4 h-4 align-baseline inline-block stroke-black fill-none'><use href="#external-link"></use></svg>
                </div>
            </div>
            {children}
        </a>
    )
}
const CardWord = () => {
    return (
        <CardContainer>
            <div className="flex flex-col h-[82px] justify-center items-center">
                <span className="block leading-[55px] w-full h-[55px] text-[16px] font-bold bg-[#F9F9F9] rounded-lg border border-[#C8CAD0] text-center">Word MonkeyB</span>
            </div>
        </CardContainer>
    )
}
const CardLogo = () => {
    return (
        <CardContainer>
            <div className="flex flex-col h-[82px] justify-center items-center">
                <Image alt="img" src="/code_developer.jpg" loading="lazy" width={82} height={82} />
            </div>
        </CardContainer>
    )
}
const CardARow = () => {
    return (
        <div className="flex gap-6 min-w-full">
            <CardWord />
            <CardLogo />
            <CardWord />
            <CardLogo />
            <CardWord />
        </div>
    )
}
export const verifyClassify = (pinia: PiniaType): boolean => {
    return !(pinia?.classes === undefined ||
        (Object.keys(pinia?.classes).length === 0 && pinia?.classes.constructor === Object));
}
const Summary = () => {
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
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [waiting, setWaiting] = useState(false);
    const [portfolX, setPortfolX] = useState(0);

    return (
        <>
            <main className='max-w-7xl mx-auto px-6 py-4'>
                <div className="grid gap-y-6">
                    <ProgressIndicator stage={4} />
                    <section id="contentMain" className="grid grid-cols-12 gap-6">
                        <h1 className="col-span-12 text-[32px] leading-10 font-mont">Review results</h1>
                        <Alert4 />
                        <section id="pleaseReview1" className={`col-span-12 shadow-[1px_1px_4px_#00000040] ${pinia?.markType === 'Logo' ? '' : 'hidden'} border border-[#c8cad0] rounded-md p-6`}>
                            <strong className="text-[#f56600]">Please review</strong>
                            <h2 className="font-mont text-[24px] left-9 mb-6">Check for distinctiveness</h2>
                            <div className="border border-[#C8CAD0] w-fit rounded-md p-4 relative">
                                <Image alt="img" src={`/uploads/${pinia?.logo as string}`} onError={(e) => e.currentTarget.src = "/no-avatar.png"} loading="lazy" width={200} height={200} />
                            </div>
                            <div className="flex flex-col gap-4 p-6 mt-4 border-t border-[#C8CAD0] bg-[#F9F9F9]">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-[16px] leading-7 font-mont">What to do</h4>
                                    <button onClick={() => router.push('/select')} className="flex gap-4 px-4 justify-center items-center hover:bg-[#72757E] hover:text-white transition-all ease-in-out h-[46px] w-fit rounded-sm bg-white border border-black">
                                        <h4 className="text-[16px] leading-6 font-bold"> Edit my trademark </h4>
                                    </button>
                                </div>
                                <p className="text-[16px] leading-6">Your trade mark may contain some of the following:</p>
                                <div>
                                    <li>Descriptive words</li>
                                    <li>Geographic places</li>
                                    <li>Common surnames</li>
                                </div>
                                <p><strong>Make sure</strong> your trade mark contains something unique that other people in your industry would not need to use. You can still apply if you feel like your trade mark is distinctive enough.
                                    <Link href="#" className="underline p-1 hover:no-underline hover:bg-[#F2F2F6] font-bold" >
                                        Read more about distinctiveness.
                                    </Link>
                                </p>
                                <hr />
                                <div className="flex flex-col gap-3">
                                    <p className="uppercase text-[16px] leading-6">Help video</p>
                                    <button onClick={() => router.push('/select')} className="flex gap-4 p-3 h-[46px] w-fit rounded-sm bg-white border border-black">
                                        <Image alt="img" src="/play-video.svg" loading="lazy" width={24} height={20} />
                                        <h4 className="text-[14px] leading-6"> <strong>Distinctiveness</strong> (90 seconds)</h4>
                                    </button>
                                </div>
                            </div>
                        </section>
                        <section id="pleaseReview2" className="col-span-12 shadow-[1px_1px_4px_#00000040] border border-[#c8cad0] rounded-md p-6">
                            <strong className="text-[#f56600]">Please review</strong>
                            <h2 className="font-mont text-[24px] left-9 mb-6">Check for similarity</h2>
                            <div className="flex flex-col gap-6 overflow-hidden">
                                <div className="flex flex-row gap-4 ease-in-out transition-all relative min-w-[900px] " style={{ left: `calc(-${portfolX * 100}% - ${portfolX * 16}px)` }}>
                                    <CardARow />
                                    <CardARow />
                                    <CardARow />
                                    <CardARow />
                                </div>
                                <div className="flex justify-between py-2">
                                    <p className="text-[16px] leading-6">We found <strong>20 matches</strong> that may be similar to yours.</p>
                                    <div className="flex gap-3">
                                        <button className="underline p-1 hover:no-underline hover:bg-[#F2F2F6] font-bold rounded-md">Shows all 20</button>
                                        <div className="flex gap-3  items-center">
                                            <button disabled={portfolX === 0} onClick={() => setPortfolX(prev => prev - 1)} className="w-[46px] h-[46px] flex justify-center items-center border border-black rounded-sm text-[#1D252C] hover:text-white hover:bg-[#72757E] disabled:bg-[#F2F2F6] disabled:text-[#1010104d] disabled:border-0 transition-all ease-in-out">
                                                <svg className='w-[17px] h-[17px] align-baseline inline-block stroke-current'><use href="#arrow-left"></use></svg>
                                            </button>
                                            <strong>11-15</strong>
                                            <button disabled={portfolX === 3} onClick={() => setPortfolX(prev => prev + 1)} className="w-[46px] h-[46px] flex justify-center items-center border border-black rounded-sm text-[#1D252C] hover:text-white hover:bg-[#72757E] disabled:bg-[#F2F2F6] disabled:text-[#1010104d] disabled:border-0 transition-all ease-in-out">
                                                <svg className='w-[17px] h-[17px] align-baseline inline-block stroke-current'><use href="#arrow-right"></use></svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-4 p-6 mt-4 border-t border-[#C8CAD0] bg-[#F9F9F9]">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-[16px] leading-7 font-mont">What to do</h4>
                                    <button onClick={() => router.push('/select')} className="flex gap-4 px-4 justify-center items-center hover:bg-[#72757E] hover:text-white transition-all ease-in-out h-[46px] w-fit rounded-sm bg-white border border-black">
                                        <h4 className="text-[16px] leading-6 font-bold"> Edit my trademark </h4>
                                    </button>
                                </div>
                                <p className="text-[16px] leading-6">Check if these are similar in terms of:</p>
                                <div>
                                    <li>The way they look</li>
                                    <li>Sound or pronunciation</li>
                                    <li>Goods or services</li>
                                </div>
                                <p>You can still apply if you believe your trade mark and your goods and or services are distinguishable from those identified in the search result.
                                    <br /><br />
                                    <Link href="#" className="underline p-1 hover:no-underline hover:bg-[#F2F2F6] font-bold" >
                                        Read more about similarity.
                                    </Link>
                                </p>
                                <hr />
                                <div className="flex flex-col gap-3">
                                    <p className="uppercase text-[16px] leading-6">Help video</p>
                                    <button onClick={() => alert()} className="flex gap-4 p-3 h-[46px] w-fit rounded-sm bg-white border border-black">
                                        <Image alt="img" src="/play-video.svg" loading="lazy" width={24} height={20} />
                                        <h4 className="text-[14px] leading-6"> <strong>Similarity</strong> (90 seconds)</h4>
                                    </button>
                                </div>
                            </div>
                        </section>
                    </section>
                    <h2 className="text-[24px] leading-9 font-mont">Applying for this trade mark</h2>
                    <section>
                        <Alert2 msg={
                            <div className="text-[14px] leading-6">
                                <li>These results are generated by our automated checking service to help inform your decision.</li>
                                <li>If you decide to apply, the next step is a detailed human check, see fees and timeline below.</li>
                            </div>
                        } />
                    </section>
                    <PortalSummaryA />
                    <PortalSummaryB />
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
                    <ConfirmStartAgainModal openState={{ open, setOpen }}>
                        <button onClick={() => setOpen(true)} className='rounded-md font-semibold hover:bg-[#72757E] transition-all flex justify-start gap-4 items-center px-4 ease-in-out text-[#1D252C] w-[150px] h-[46px] bg-white border border-black hover:text-white'>
                            <svg className='w-[17px] h-[17px] align-baseline inline-block stroke-current fill-none'><use href="#restart"></use></svg>
                            Start again
                        </button>
                    </ConfirmStartAgainModal>
                    <button onClick={() => router.push('/apply')} className='rounded-md font-semibold hover:bg-[#72757E] transition-all flex justify-between gap-4 items-center px-4 ease-in-out bg-[#373f86] w-[140px] h-[46px] text-white'>
                        Apply
                        <svg className='w-[17px] h-[17px] align-baseline inline-block stroke-white'><use href="#arrow-right"></use></svg>
                    </button>
                </div>
            </div>
        </>
    )
}
Summary.getLayout = TMCheckLayout;
export default Summary;
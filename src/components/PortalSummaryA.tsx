import { ReactNode, useContext, useEffect, useRef, useState } from "react";
import { BootstrapTooltip } from "../pages/classify";
import { PiniaStore } from "@/store/store";
import Image from "next/image";

const WrapTimeBar = ({ showBar = true, children }: { showBar?: boolean, children: ReactNode }) => {

    return (
        <>
            <div className="flex gap-6">
                <div className="flex flex-col items-center relative">
                    {/* <div className="w-6 h-6 leading-6 rounded-full border-2 border-[#805357] bg-[#d1d1ff]"></div> */}
                    <Image alt="image" loading='lazy' src='/down-circle.png' width={40} height={40} />
                    {showBar && <div className="w-[2px] h-full absolute top-9 ml-[2px] bg-[#C8CAD0]"></div>}
                </div>
                <div className="flex flex-col w-full">
                    {children}
                </div>
            </div>
        </>
    )
}
const TimeBarA = ({ title, description, feeType, fee, tooltip, showBar = true }: { title: string, description: string, feeType?: string, fee?: string, tooltip: ReactNode, showBar?: boolean }) => {
    return (
        <WrapTimeBar showBar={showBar}>
            <h4 className="text-[16px] leading-7 font-mont">{title}</h4>
            <div className="flex justify-between gap-16 pt-4">
                <p>{description}</p>
                <BootstrapTooltip placement="bottom" sx={{ "& .MuiTooltip-tooltip": { backgroundColor: "black" } }} title={tooltip} arrow>
                    <div className="h-fit">
                        <svg className='w-6 h-6 align-baseline inline-block stroke-black cursor-pointer'><use href="#question"></use></svg>
                    </div>
                </BootstrapTooltip>
            </div>
            {feeType && <p className="text-[#248289]">{feeType}</p>}
            {fee && <p><strong>{fee}</strong></p>}
        </WrapTimeBar>
    )
}
export const TimeBarAs = () => {
    const { pinia, setPinia } = useContext(PiniaStore);
    return (
        <div className="flex flex-col gap-4 p-8 max-w-[920px]">
            <TimeBarA title="Submit Application Today"
                description="Takes 4-6 Months"
                feeType="Total cost"
                fee={`$${(pinia?.classes !== undefined && !(Object.keys(pinia.classes).length === 0 && pinia.classes.constructor === Object)) ? (Object.keys(pinia.classes).length * 590 - (Object.keys(pinia.classes).length - 1) * 100) : 0}`}
                tooltip={
                    <>
                        <style>{`div.MuiTooltip-tooltip {width:240px; padding:16px;} p {font-size:16px; line-height:24px;}`}</style>
                        <p>The results of your free check need to be reviewed by an examiner to assess whether your request meets certain legal requirements that are described in the <i>Trade Marks Act 1995</i>.</p>
                        <br />
                        <p>They&apos;ll reach out within 5 working days. If there are issues, the examiner will let you know your options for fixing them.</p>
                    </>
                }
            />
            <TimeBarA title="Examination"
                description="An Examiner from IP Australia will examiner your trade mark in accordance with Trade Marks Act 1995 (Cth).* "
                tooltip={
                    <>
                        <style>{`div.MuiTooltip-tooltip {width:240px; padding:16px;} p {font-size:16px; line-height:24px;}`}</style>
                        <p> *Examination <br/>
                            During the Examination period, the Examiner may issue an Adverse Examination Report. If an Adverse Report is issued, further costs will be incurred for reporting and filing a response. The costs can vary, depending on the type and number of objections.
                        </p>
                    </>
                }
            />
            <TimeBarA title="Acceptance"
                description="After trade mark is placed for Acceptance, it will be published in the Australian Register of Trade Marks where it enters the Opposition period for two months."
                tooltip={
                    <>
                        <style>{`div.MuiTooltip-tooltip {width:240px; padding:16px;} p {font-size:16px; line-height:24px;}`}</style>
                        <p> International agreements require us to ensure people who file a trade mark in participating countries have six months to apply in Australia. While it is rare for a similar trade mark to be filed during the same time period, the agreements help protect business operators from potential IP Rights conflicts.  </p>
                        <br />
                        <p> Each trade mark undergoes a two-month opposition period where others can challenge its registration. Refer to frequently asked questions for additional details. </p>
                    </>
                }
            />
            <TimeBarA title="Registration" showBar={false}
                description="If your trade mark is not opposed by a third party within the opposition period your trade mark proceeds to Registration. Your trade mark is registered for 10 years."
                tooltip={
                    <>
                        <style>{`div.MuiTooltip-tooltip {width:240px; padding:16px;} p {font-size:16px; line-height:24px;}`}</style>
                        <p> Once registered you can add the registered symbol to all instances of your trade mark. You can legally challenge comparable marks with similar goods and services. It is your responsibility to enforce your rights and use your trade mark correctly on the goods and services you listed for registration. </p>
                    </>
                }
            />
        </div>
    )
}
const PortalSummaryA = () => {
    const [divHeight, setDivHeight] = useState(0);
    const contentRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (contentRef.current) {
            setDivHeight(contentRef.current.scrollHeight);
        }
    }, []);
    const [collapsed, setCollapsed] = useState(true);
    const handleCollapse = () => {
        setCollapsed(pre => (!pre));
    }
    return (
        <section className="flex flex-col gap-5">
            <div className="flex flex-col shadow-[0_2px_10px_#00000040] rounded-lg">
                <button onClick={handleCollapse} className="flex justify-between px-6 py-8">
                    <h5 className="text-[18px] leading-7 font-mont">Fees and timeline if I apply?</h5>
                    <svg className={`w-[25px] h-[25px] align-baseline inline-block stroke-black fill-[#30aeb6] transition-all ease-in-out ${collapsed ? "rotate-[0deg]" : "rotate-[360deg]"}`}><use href={`#${collapsed ? "add" : "subtract"}`}></use></svg>
                </button>
                <div ref={contentRef} className={`overflow-hidden transition-all ease-in-out duration-1000`} style={{ height: collapsed ? 0 : divHeight }}>
                    <hr />
                    <TimeBarAs />
                </div>
            </div>
        </section>
    )
}
export default PortalSummaryA;
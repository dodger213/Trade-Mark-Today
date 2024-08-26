import Link from "next/link";
import { ReactNode, useContext, useEffect, useRef, useState } from "react";
import { ClassBadge } from "../pages/classify";
import Image from "next/image";
import { PiniaStore } from "@/store/store";
const PortalSummaryB = () => {
    const { pinia, setPinia } = useContext(PiniaStore);
    const [divHeight, setDivHeight] = useState(0);
    const contentRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (contentRef.current) {
            setDivHeight(contentRef.current.scrollHeight);
        }
    }, [pinia]);
    const [collapsed, setCollapsed] = useState(true);
    const handleCollapse = () => {
        setCollapsed(pre => (!pre));
    }
    return (
        <section className="flex flex-col gap-5">
            <div className="flex flex-col shadow-[0_2px_10px_#00000040] rounded-lg">
                <button onClick={handleCollapse} className="flex justify-between px-6 py-8">
                    <div className="flex gap-4 justify-center items-center">
                        <span className="w-6 h-6 rounded-full bg-[#E0F3F4] text-[14px] leading-6 font-semibold">{pinia.classes ? Object.keys(pinia.classes).length : 0}</span>
                        <h5 className="text-[18px] leading-7 font-mont">My trademark details</h5>
                    </div>
                    <svg className={`w-[25px] h-[25px] align-baseline inline-block stroke-black fill-[#30aeb6] transition-all ease-in-out ${collapsed ? "rotate-[0deg]" : "rotate-[360deg]"}`}><use href={`#${collapsed ? "add" : "subtract"}`}></use></svg>
                </button>
                <div ref={contentRef} className={`overflow-hidden transition-all ease-in-out duration-1000`} style={{ height: collapsed ? 0 : divHeight }}>
                    <hr />
                    <div className="p-8 flex flex-col gap-8">
                        <div className="flex justify-between items-center gap-1">
                            {
                                pinia?.markType === 'Word' ?
                                    <span className="inline-block min-w-[170px] max-w-[300px] text-center text-[16px] leading-6 py-3 px-4 font-bold bg-[#F9F9F9] rounded-lg border border-[#C8CAD0]">{pinia.word}</span> :
                                    <div className="border border-[#C8CAD0] rounded-md p-4 relative">
                                        <Image alt="img" src={`/uploads/${pinia.logo as string}`} loading="lazy" onError={(e) => e.currentTarget.src = "/no-avatar.png"} width={200} height={200} />
                                    </div>
                            }
                            <Link className="inline-block text-[16px] leading-8 font-semibold px-4 py-2 border border-black rounded-md hover:text-white hover:bg-[#72757E] transition-all ease-in-out" href="/select">Edit</Link>
                        </div>
                        <hr />
                        <div className="flex flex-col">
                            <div className="flex justify-between">
                                <div>
                                    <h4 className="font-mont text-[16px] leading-6 mb-4">Goods or services</h4>
                                    <span className="text-[14px] inline-block">Total cost is based on how many classes your trade mark contains.</span>
                                </div>
                                <Link className="inline-block h-fit text-[16px] leading-8 font-semibold px-4 py-2 border border-black rounded-md hover:text-white hover:bg-[#72757E] transition-all ease-in-out" href="/classify">Edit</Link>
                            </div>
                            {pinia?.classes !== undefined && Object.keys(pinia.classes).map((classKey: string, index: number) => (
                                <div key={index} className="flex gap-4 pt-6 flex-wrap">
                                    {pinia.classes && pinia.classes[classKey] && pinia.classes[classKey].map((item, index) => (
                                        <span key={index} className="flex gap-2 text-[12px] leading-6 items-center bg-[#F2F2F6] py-1 px-2 box-border rounded-md ">
                                            {item.description}
                                        </span>
                                    ))}
                                    <div className="flex justify-between w-full pt-4 pr-2">
                                        <ClassBadge text={classKey} />
                                        {index > 0 ? <div><span className="line-through decoration-2 decoration-black text-red-500 font-bold pr-4">$590</span>$490</div> : <span>$590</span>}
                                    </div>
                                    <hr className="w-full" />
                                </div>
                            ))}
                            <div className="flex justify-between w-full mt-6 px-2 py-4 pr-2 uppercase font-bold bg-[#f2f2f6]">
                                <span>Total</span>
                                <span>${(pinia?.classes !== undefined && !(Object.keys(pinia.classes).length === 0 && pinia.classes.constructor === Object)) ? (Object.keys(pinia.classes).length * 590 - (Object.keys(pinia.classes).length - 1) * 100) : 0}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section >
    )
}
export default PortalSummaryB;
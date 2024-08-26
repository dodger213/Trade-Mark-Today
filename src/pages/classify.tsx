import ProgressIndicator from "../components/ProgressIndicator";
import Image from "next/image";
import { ChangeEvent, useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import WaitingLocker from "../components/WaitingLocker";
import { Checkbox, CircularProgress, FormControlLabel, FormGroup, Tooltip, TooltipProps, styled, tooltipClasses } from "@mui/material";
import PortalClass from "../components/PortalClass";
import { AlertErr, Alert2 } from "../components/AlertContainers";
import TMCheckLayout from "../layout/TMCheckLayout";
import { PiniaStore } from "@/store/store";
import { PiniaType } from "@/types/interface";
import { verifyConsider } from "./select";
import axios from "axios";
import Chat from "@/components/Chat";
import { getTokenIPAustralia, quickSearchIPAustralia } from "@/types/utils";

export const ClassBadge = ({ text }: { text: string }) => {
    return (
        <div className="w-[64px] whitespace-nowrap bg-[#E0F3F4] text-[12px] leading-[18px] font-bold px-2 py-1 text-center rounded-sm">Class {text}</div>
    )
}
export const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
        color: theme.palette.common.black,
    },
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.common.black,
    },
}));

const BottomCostBar = ({ show, near, setShowBottomCostBar }: { show: boolean, near: boolean, setShowBottomCostBar: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const { pinia, setPinia } = useContext(PiniaStore);
    return (
        <>
            <div className={`z-10 transition-all ease-in-out duration-500 w-full flex items-center fixed ${show ? (near ? "-bottom-[78px]" : "bottom-0") : "-bottom-[200px]"} border-t-[5px] border-[#DE4326] bg-[#040818]`}>
                <div className="w-full mt-4 mb-24 max-w-7xl mx-auto px-6 flex justify-between">
                    <div className="flex gap-4 items-center">
                        <h3 className="flex items-center justify-center font-mont text-[18px] leading-7 bg-[#30AEB6] rounded-full text-black w-11 h-11">{pinia.classes && Object.keys(pinia.classes).length}</h3>
                        <div className="flex flex-col text-white">
                            <h2 className="font-mont text-[24px] leading-9">classes selected</h2>
                            <span className="text-[16px] leading-6">Total cost: <strong>${pinia.classes ? (Object.keys(pinia.classes).length * 590 - (Object.keys(pinia.classes).length - 1) * 100) : 0}</strong></span>
                        </div>
                    </div>
                    <button onClick={() => setShowBottomCostBar(false)} className="text-[16px] transition-all ease-in-out leading-6 text-white bg-[#1D252C] h-12 px-4 rounded-lg hover:bg-[#72757E]">Ok</button>
                </div>
            </div>
        </>
    )
}
export const verifySelect = (pinia: PiniaType): boolean => {
    return !(pinia?.markType === undefined ||
        (pinia?.markType === 'Word' && pinia?.word === undefined) ||
        (pinia?.markType === 'Logo' && pinia?.logo === undefined) ||
        (pinia?.markType === 'Logo' && pinia?.wordContained && (pinia?.containedWord === undefined || pinia?.containedWord.trim() === '')));
}
const Classify = () => {
    const { pinia, setPinia } = useContext(PiniaStore);
    const router = useRouter();
    const [waiting, setWaiting] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [showWaiting, setShowWaiting] = useState(false);
    const [showBottomCostBar, setShowBottomCostBar] = useState(false);
    const [keyword, setKeyword] = useState('');
    const [isNearBottom, setIsNearBottom] = useState(false);
    const [classProducts, setClassProducts] = useState<any>(null)
    const [titles, setTitles] = useState<string[]>([])
    const [tokenIPAustralia, setTokenIPAustralia] = useState('')
    useEffect(() => {
        (async () => {
            const { data: { data } } = await axios.get('/api/classes');
            setTitles(Object.keys(data).map(key => data[key].title));
        })();
    }, [])
    useEffect(() => {
        if (Object.keys(pinia).length === 0 && pinia.constructor === Object) {
            // router.push('/consider')
            return;
        }
        setShowBottomCostBar(pinia.classes !== undefined && Object.keys(pinia.classes).length > 0)
        if (!verifyConsider(pinia)) {
            router.push('/consider')
        } else if (!verifySelect(pinia)) {
            router.push('/select')
        }
    }, [pinia])
    useEffect(() => {
        const handleScroll = () => {
            const windowHeight = window.innerHeight;
            const pageHeight = document.body.scrollHeight;
            const currentPosition = window.pageYOffset + windowHeight;
            setIsNearBottom(currentPosition >= pageHeight - 224);
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    const handleTimeOut = async () => {
        setShowWaiting(true);
        if (keyword.trim() !== '') {
            const { data: _data } = await axios.get(`/api/searchkeywords?id=1&keyword=${keyword}`);
            const keyword1 = _data.map((d: string) => d.replace('\r\n', ''))
            const { data: keyword2 } = await axios.get(`/api/searchkeywords?id=2&keyword=${keyword}`);
            const keywords = [...keyword1, ...keyword2, keyword];
            const { data: { success, data: products } } = await axios.post(`/api/products`, { keywords });
            if (success) {
                setClassProducts(products);
            }
        }
        setShowWaiting(false);
    }
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    useEffect(() => {
        if (keyword?.trim() === undefined) return;
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(handleTimeOut, 1000);
    }, [keyword])
    const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
        setClassProducts(null)
        setKeyword(e.target.value);
    }
    const handleRemoveClass = (id: string, classNo: string) => {
        const p_classes = pinia.classes ? (pinia.classes[classNo] ? pinia.classes[classNo] : []) : [];
        const tem_removeClasses = {
            ...pinia.classes,
            [classNo]: p_classes.filter(elem => elem.id !== id)
        }
        const tem_removeArr = Object.values(tem_removeClasses).filter(value => value.length > 0);
        let removedClasses: any = {}
        tem_removeArr.forEach(item => {
            removedClasses[item[0].tmClass] = item;
        })
        setPinia({
            ...pinia, classes: removedClasses
        })
    }

    const handleNextClick = async () => {
        if (pinia.classes !== undefined && Object.keys(pinia.classes).length > 0) {
            setWaiting(true);
            //! here
            // const query = pinia?.markType === 'Word' ? pinia?.word : (pinia?.wordContained ? pinia?.containedWord : 'Trade');
            // const accessToken: string = await getTokenIPAustralia();
            // const { count, trademarkIds }: { count: number, trademarkIds: string[] } = await quickSearchIPAustralia(query as string, accessToken)
            // const searchRes = await Promise.all(trademarkIds.slice(0, 20).map(async tId => {
            //     const { data: { number, words, images } }: { data: { number: string, words: string[], images: { description: string, images: string[] } } } = await axios.get(`https://test.api.ipaustralia.gov.au/public/australian-trade-mark-search-api/v1/trade-mark/${tId}`);
            //     return { number, words, images }
            // }))
            // console.log('here', searchRes)
            //! here
            setWaiting(false);
            router.push('/summary');
            // setTimeout(() => {}, 5000);
        } else {
            setShowAlert(true)
            window.scrollTo(0, 0)
        }
    }

    return (
        <>
            <main className='max-w-7xl mx-auto px-6 py-4'>
                <div className="grid gap-y-6">
                    <ProgressIndicator stage={3} />
                    <section id="contentMain" className="grid grid-cols-12 gap-6">
                        <AlertErr showAlert={showAlert} msg="Select at least one good or service to continue." />
                        <h1 className="font-mont text-[24px] md:text-[32px] font-bold col-span-12">What goods and or services are associated with your trade mark?</h1>
                        <Alert2 msg={
                            <>
                                <h4 className="text-[14px] leading-6">Goods or services relate to how your trade mark is protected.</h4>
                                <button onClick={() => alert()} className="flex gap-4 p-3 h-[46px] w-fit rounded-sm bg-white border border-black">
                                    <Image alt="img" src="/play-video.svg" loading="lazy" width={24} height={20} />
                                    <h4 className="text-[14px] leading-6"> <strong>Help video</strong> (90 seconds)</h4>
                                </button>
                            </>
                        } />
                        <section className="col-span-12 md:col-span-8 flex flex-col gap-4">
                            <section className="col-span-6 flex flex-col gap-2">
                                <div className="flex">
                                    <h3 className="text-[18px] font-mont leading-6 flex-grow">Search for your goods or services</h3>
                                    <BootstrapTooltip placement="bottom" sx={
                                        {
                                            "& .MuiTooltip-tooltip": { backgroundColor: "black" }
                                        }
                                    } title={
                                        <>
                                            <style>{`p {font-size:16px; line-height:24px;}`}</style>
                                            <p>Goods or services relate to how your trade mark is protected.</p>
                                            <br />
                                            <p> Select what you offer now, or plan to in the near future. You may need to use the search multiple times. </p>
                                        </>
                                    } arrow>
                                        <svg className='w-6 h-6 align-baseline inline-block stroke-black cursor-pointer'><use href="#question"></use></svg>
                                    </BootstrapTooltip>

                                </div>
                                <span className="text-[14px] leading-6 text-[#72757e]">Broadly select from the list of goods and or services you provide currently and intend to provide in the future.</span>
                                <div className="flex gap-1 relative items-center">
                                    <input value={keyword} onChange={handleChange} placeholder="example: clothing for sports" className={`w-full h-16 px-5 py-3 bg-[#F5F6F7] border-b-2 "border-black"`} />
                                    {keyword?.trim() !== '' && <button onClick={() => setKeyword('')} className="flex flex-col justify-center absolute items-center right-0 w-12 h-12 hover:bg-[#C8CAD0] border-black hover:border rounded-md">
                                        <svg className='self-center w-[10px] h-[10px] align-baseline inline-block stroke-black'><use href="#x"></use></svg>
                                    </button>}
                                    <CircularProgress hidden={!showWaiting} className={`absolute right-14`} color="secondary" />
                                </div>

                            </section>
                            {classProducts && classProducts.map((classProduct: any, index: number) =>
                                (<PortalClass key={index} classNo={classProduct._class} title={titles[Number(classProduct._class) - 1]} setShowBottomCostBar={setShowBottomCostBar} products={classProduct.product} />))}

                        </section>
                        <section className="col-span-12 md:col-span-4 flex flex-col gap-4 p-4 border h-fit border-[#C8CAD0] rounded-md" >
                            <h5 className="font-mont text-[16px] leading-7">Your trade mark</h5>
                            <div className="flex justify-between items-center gap-1">
                                {
                                    pinia?.markType === 'Word' ?
                                        <span className="inline-block min-w-[170px] max-w-[300px] text-center text-[16px] leading-6 py-3 px-4 font-bold bg-[#F9F9F9] rounded-lg border border-[#C8CAD0]">{pinia.word}</span> :
                                        <div className="border border-[#C8CAD0] rounded-md p-4 relative">
                                            <Image alt="img" src={`/uploads/${pinia.logo as string}`} loading="lazy" onError={(e) => e.currentTarget.src = "/no-avatar.png"} width={200} height={200} />
                                        </div>
                                }
                                <Link className="inline-block h-fit text-[16px] leading-8 font-bold px-4 py-2 border border-black rounded-md" href="/select">Edit</Link>
                            </div>
                            <hr />
                            <div id="pricingCard" className="flex flex-col ">
                                <div>
                                    <h4 className="text-[16px] leading-7 font-mont">Goods or services</h4>
                                    <span className="text-[14px] leading-5">The cost is only payable if you apply.</span>
                                </div>
                                {pinia?.classes !== undefined && Object.keys(pinia.classes).map((classKey: string, index: number) => (
                                    <div key={index} className="flex flex-col gap-6 pt-4">
                                        <div className="flex flex-wrap gap-2">
                                            {pinia.classes && pinia.classes[classKey] && pinia.classes[classKey].map((item, index_inner) => (
                                                <button onClick={() => handleRemoveClass(item.id, item.tmClass)} key={index_inner} className="flex gap-2 text-[12px] leading-6 items-center bg-[#F9F9F9] py-1 px-2 box-border outline-1 rounded-md hover:outline outline-black">
                                                    <span>{item.description}</span>
                                                    <svg className='w-[10px] h-[10px] inline-block stroke-[#040c13] fill-none'><use href="#x"></use></svg>
                                                </button>
                                            ))}
                                        </div>
                                        <div className="flex justify-between w-full pt-4 pr-2">
                                            <ClassBadge text={classKey} />
                                            {index > 0 ? <div><span className="line-through decoration-2 decoration-black text-red-500 font-bold pr-4">$590</span>$490</div> : <span>$590</span>}
                                        </div>
                                        <hr />
                                    </div>
                                ))}
                                <div className="flex justify-between w-full px-2 py-4 mt-4 bg-[#f2f2f6] text-[16px] font-bold">
                                    <span>Total</span>
                                    <span>${(pinia?.classes !== undefined && !(Object.keys(pinia.classes).length === 0 && pinia.classes.constructor === Object)) ? (Object.keys(pinia.classes).length * 590 - (Object.keys(pinia.classes).length - 1) * 100) : 0}</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-4 bg-[#e0f3f4] p-4">
                                <div className="flex gap-2 items-center">
                                    <svg className='w-6 h-6 inline-block stroke-[#040c13] fill-none'><use href="#money"></use></svg>
                                    <h3 className="font-mont text-[18px] leading-7">This check is free</h3>
                                </div>
                                <p className="text-[14px] leading-5">It doesn&apos;t cost anything to check your trade mark using our automated tool.</p>
                                <p className="text-[14px] leading-5">If you decide to apply, the cost of a trade mark is based on the number of classes your chosen items are in.</p>
                            </div>
                            <button onClick={() => alert()} className="flex flex-col bg-[#248289] px-4 py-2 ">
                                <p className="text-[14px] leading-6 text-white"> <strong> Help video </strong> (90 seconds) </p>
                                <div className="flex justify-between w-full">
                                    <h4 className="text-[16px] leading-7 font-mont text-white">Selecting goods and services</h4>
                                    <Image alt="img" src="/play-video.svg" loading="lazy" width={24} height={20} />
                                </div>
                            </button>
                        </section>
                    </section>
                </div>
                <WaitingLocker waiting={waiting} />
            </main>
            <Chat />
            <div className="z-20 col-span-12 p-4 sticky w-full bottom-0 bg-white shadow-[0_-1px_2px_#000]">
                <div className="max-w-7xl mx-auto px-6 flex gap-5">
                    <button onClick={() => router.back()} className='rounded-md font-semibold hover:bg-[#72757E] transition-all flex justify-start gap-4 items-center px-4 ease-in-out text-[#1D252C] w-[140px] h-[46px] bg-white border border-black'>
                        <svg className='w-[17px] h-[17px] align-baseline inline-block stroke-[#1D252C]'><use href="#arrow-left"></use></svg>
                        Back
                    </button>
                    <button onClick={handleNextClick} className='rounded-md font-semibold hover:bg-[#72757E] transition-all flex justify-between gap-4 items-center px-4 ease-in-out bg-[#373f86] w-[140px] h-[46px] text-white'>
                        Next
                        <svg className='w-[17px] h-[17px] align-baseline inline-block stroke-white'><use href="#arrow-right"></use></svg>
                    </button>
                </div>
            </div>
            <BottomCostBar near={isNearBottom} setShowBottomCostBar={setShowBottomCostBar} show={showBottomCostBar} />
        </>
    )
}
Classify.getLayout = TMCheckLayout;
export default Classify;
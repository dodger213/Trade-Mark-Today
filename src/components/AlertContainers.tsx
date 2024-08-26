import Image from "next/image"
import Link from "next/link"
import { ReactNode } from "react"

export const AlertErr = ({ showAlert, msg }: { showAlert: boolean, msg: string }) => {
    return (
        <section id="alert-container" className={`${showAlert ? "" : "hidden"} col-span-12`}>
            <div className="bg-[#F8E2E4] p-4 shadow-[4px_0_#c12_inset] flex gap-2">
                <svg className='w-6 h-6 align-baseline inline-block stroke-none fill-[#c12]'><use href="#error-circle"></use></svg>
                <div className="flex flex-col gap-2">
                    <h4 className="text-[16px] font-bold">There is a problem</h4>
                    <li>
                        <Link href="#alert-check" className="underline p-1 hover:no-underline hover:bg-[#F2F2F6] font-bold" >
                            {msg}
                        </Link>
                    </li>
                </div>
            </div>
        </section>
    )
}
export const Alert2 = ({ msg }: { msg: ReactNode }) => {
    return (
        <section id="alert-container" className="col-span-12">
            <div className="bg-[#E0F3F4] p-4 shadow-[4px_0_#30aeb6_inset] flex gap-2 items-center">
                <Image alt="image" loading='lazy' src='/alert.png' width={45} height={45} style={{ height: "45px" }} />
                <div className="flex flex-col gap-2">
                    <h2 className="text-[16px] leading-6 font-bold">What you need to know</h2>
                    {msg}
                </div>
            </div>
        </section>
    )
}
export const Alert3 = ({ msg }: { msg: ReactNode }) => {
    return (
        <section id="alert-container" className="col-span-12">
            <div className="bg-[#E0F3F4] p-4 shadow-[4px_0_#30aeb6_inset] flex gap-2 items-center">
                <Image alt="image" loading='lazy' src='/alert.png' width={45} height={45} style={{ height: "45px" }} />
                <h4 className="text-[14px] leading-6">{msg}</h4>
            </div>
        </section>
    )
}
export const Alert4 = () => {
    return (
        <section id="alert-container" className={`col-span-12`}>
            <div className="bg-[#FFF0E5] p-4 shadow-[4px_0_#ff832b_inset] flex gap-2 items-center">
                <Image alt="image" loading='lazy' src='/alert.png' width={45} height={45} style={{ height: "45px" }} />
                <div className="flex flex-col gap-2">
                    <h4 className="text-[16px] font-bold">Important</h4>
                    <p className="text-[14px] leading-6">Our automated search has found trade marks that you may consider before proceeding.</p>
                </div>
            </div>
        </section>
    )
}
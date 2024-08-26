import Image from "next/image"

const PortalConsider = ({ title, message, category, img = "" }: {
    title: string
    message: string
    category?: string
    img?: string
}) => {
    return (
        <div className="flex flex-col col-span-12 md:col-span-4 border-t-[1px] border-[#C8CAD0] bg-white pt-4 shadow-[0_0_8px_8px_#fff]">
            <div className="p-3 flex flex-col gap-1">
                <h3 className="text-[18px] leading-6 font-mont">{title}</h3>
                <p className="text-[14px] leading-5">{message}</p>
            </div>
            <div className="p-3 bg-[#f9f9f9] h-[72px]">
                <div className="flex gap-3">
                    <Image alt="image" loading='lazy' src='/alert.png' width={45} height={45} style={{height:"45px"}} />
                    <div className={`flex ${img == "" ? "flex-col" : "flex-row"}`}>
                        <p className="text-[12px] uppercase leading-5 text-[#72757e]">Example</p>
                        {img === "" ?
                            <h4 className="text-[16px] leading-7 font-mont text-[#373f46]">{category}</h4>
                            :
                            <Image alt="image" loading='lazy' src={img} width={80} height={60} />}

                    </div>
                </div>
            </div>
        </div>
    )
}
export default PortalConsider;
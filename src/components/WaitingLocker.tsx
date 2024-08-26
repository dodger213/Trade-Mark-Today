import { CircularProgress } from "@mui/material"
import Image from "next/image";

const WaitingLocker = ({ waiting, msg = "Waiting" }: { waiting: boolean, msg?: string }) => {
    return (
        <div
            style={{
                display: "flex",
                position: "fixed",
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0,0,0,0.5)",
                zIndex: waiting ? "5080" : "-1",
                opacity: waiting ? 1 : 0,
                top: "0",
                left: "0",
                right: "0",
                bottom: "0",
                alignItems: "center",
                justifyContent: "center",
                transition: "opacity .5s ease-in-out .2s",
            }}
        >
            <div className='w-2/3 md:w-1/4 min-h-[300px] bg-white rounded-md flex flex-col gap-2 justify-center items-center p-4'>
                <Image src="/trademarktoday_logo.png" alt="logo" loading="lazy" width={168} height={58} />
                <Image src={`/loading${Math.floor(Math.random() * 9)}.gif`} alt="logo" loading="lazy" width={108} height={58} />
                {/* <CircularProgress color="secondary" /> */}
                <p className='text-[18px] font-mont leading-7'>{msg}...</p>
            </div>
        </div>
    )
}
export default WaitingLocker;
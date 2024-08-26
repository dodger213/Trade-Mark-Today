import ProgressPane from "./ProgressPane";

export const TMCheckerElement = () => {
    return (
        <div id="page-header" className="flex gap-2 content-center">
            <h3 className='font-mont leading-[28px] text-[18px]'>Trade Mark Today</h3>
            <div className='flex justify-center items-center bg-[#E0F3F4] px-2 py-1 rounded-sm font-bold text-[12px] leading-[18px]'><span>TM</span></div>
        </div>
    )
}
const ProgressIndicator = ({ stage }: { stage: number }) => {
    return (
        <section id="progressIndicator">
            <TMCheckerElement />
            <div id="steps-container" className="flex flex-col md:flex-row justify-between items-start gap-x-6 bg-white rounded-xl pt-4 shadow-[0_0_8px_8px_#fff]">
                <ProgressPane className={`${stage >= 1 ? "state-active" : ""}`} title="Getting started" />
                <ProgressPane className={`${stage >= 2 ? "state-active" : ""}`} title="Choose trade mark" />
                <ProgressPane className={`${stage >= 3 ? "state-active" : ""}`} title="Select goods or services" />
                <ProgressPane className={`${stage >= 4 ? "state-active" : ""}`} title="Review results" />
            </div>
        </section>
    )
}
export default ProgressIndicator;
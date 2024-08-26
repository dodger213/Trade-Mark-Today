import { Checkbox, FormControlLabel, FormGroup } from "@mui/material"
import { useContext, useEffect, useRef, useState } from "react";
import { ClassBadge } from "../pages/classify";
import { PiniaStore } from "@/store/store";
const MyCheckbox = ({ label, handleClick, id, checkedItems }: { label: string, handleClick: (_: { name: string, value: boolean, id: string }) => void, id: string, checkedItems: any[] }) => {
    
    return (
        <FormControlLabel id={id} control={<Checkbox value={label} checked={checkedItems ? checkedItems.some(item => item.id === id) : false} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleClick({
            name: label,
            value: e.target.checked,
            id: id
        })} />} label={label} />
    )
}
const PortalClass = ({ classNo, products, title, setShowBottomCostBar }: { classNo: string, products: any[], title: string, setShowBottomCostBar: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const { pinia, setPinia } = useContext(PiniaStore);
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
    const handleCheckboxClick = ({ name, value, id }: { name: string, value: boolean, id: string }) => {
        const p_classes = pinia.classes ? (pinia.classes[classNo] ? pinia.classes[classNo] : []) : []; console.log(p_classes)
        setShowBottomCostBar(true)
        setPinia({
            ...pinia, classes: {
                ...pinia.classes,
                [classNo]: value ?
                    [...p_classes, {
                        id: id,
                        tmClass: classNo,
                        description: name,
                    }] :
                    p_classes.filter(elem => elem.id !== id)
            }
        })
    }
    return (
        <section className="flex flex-col gap-4 p-4 shadow-[0_2px_5px_#00000040] rounded-lg">
            <div className="flex gap-4 items-center justify-between">
                <h3 className="text-[16px] leading-7 font-bold">{title}</h3>
                <ClassBadge text={classNo} />
            </div>
            <FormGroup>
                {products && products.slice(0, 5).map((product, index) => <MyCheckbox checkedItems={pinia.classes ? pinia.classes[classNo] : []} id={product._id} key={index} label={product.product} handleClick={handleCheckboxClick} />)}
            </FormGroup>
            {products.length > 5 && (
                <>
                    <hr />
                    <button onClick={handleCollapse} className="flex justify-between px-6 py-1">
                        <h5 className="underline p-1 hover:no-underline hover:bg-[#F2F2F6] font-bold text-[16px]">Show more options</h5>
                        <svg className={`w-[25px] h-[25px] align-baseline inline-block stroke-black fill-white transition-all ease-in-out ${collapsed ? "rotate-[0deg]" : "rotate-[180deg]"}`}><use href={`#${collapsed ? "chevron-down" : "chevron-down"}`}></use></svg>
                    </button>
                    <div ref={contentRef} className={`overflow-hidden transition-all ease-in-out duration-200`} style={{ height: collapsed ? 0 : divHeight }}>
                        <FormGroup>
                            {products && products.slice(5).map((product, index) => <MyCheckbox checkedItems={pinia.classes ? pinia.classes[classNo] : []} id={product._id} key={index} label={product.product} handleClick={handleCheckboxClick} />)}
                        </FormGroup>
                    </div>
                </>
            )}
        </section>
    )
}
export default PortalClass;
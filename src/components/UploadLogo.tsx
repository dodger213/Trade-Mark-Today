import axios from "axios";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import ProgressLinearWithValueLabel from "./ProgressBar";

const UploadLogo = ({ image: { imageDataUrl, setImageDataUrl } }: { image: { imageDataUrl: string | undefined, setImageDataUrl: React.Dispatch<React.SetStateAction<string | undefined>> } }) => {
    const ref = useRef<HTMLInputElement>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    useEffect(() => {
        if (uploadProgress === 100) setUploadProgress(0)
    }, [uploadProgress])
    const handleFileInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        //! readAsDataUrl
        // if (file) {
        //     const reader = new FileReader();

        //     reader.onloadend = () => {
        //         const resultUrl: string = reader.result as string;
        //         setImageDataUrl(resultUrl);
        //     };

        //     reader.readAsDataURL(file);
        // }
        //! readAsDataUrl
        if (!file) {
            return;
        }
        const formData = new FormData();
        formData.append('image', file);
        try {
            const { data: { filename } } = await axios.post('/api/upload', formData, {
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round(
                        (progressEvent.loaded / (progressEvent.total ? progressEvent.total : 10000000000)) * 100
                    );
                    setUploadProgress(progress);
                },
            });
            setImageDataUrl(filename);
            // Handle success
        } catch (error) {
            // Handle error
        }
    }
    return (
        <section className="flex justify-center rounded-md min-h-[210px] border border-[#C8CAD0]">
            <div className="flex flex-col justify-center">
                {
                    imageDataUrl ?
                        <div className="border border-[#C8CAD0] rounded-md p-4 relative">
                            <Image alt="img" src={`/uploads/${imageDataUrl}`} loading="lazy" width={120} height={120} />
                            <button onClick={() => setImageDataUrl('')} className="absolute top-0 right-2 w-7 h-12 bg-white flex justify-center items-center px-1" style={{ borderRadius: "50%" }}><svg className='w-[10px] h-[10px] inline-block stroke-[#040c13] fill-none'><use href="#x"></use></svg></button>
                        </div> :
                        uploadProgress === 0 ?
                            <div onClick={() => { ref.current?.click() }} className="flex flex-col gap-4 items-center self-center cursor-pointer">
                                <div className="w-12 h-12 rounded-full border border-black flex justify-center items-center">
                                    <svg className='w-[22px] h-[17px] align-baseline inline-block stroke-black fill-none'><use href="#upload"></use></svg>
                                </div>
                                <div className="flex flex-col items-center">
                                    <p className="text-[16px] leading-6">Choose file or drag here</p>
                                    <p className="text-[14px] left-5 font-bold">Size limit: 10MB</p>
                                </div>
                            </div> :
                            <div>
                                <h3>Uploading logo file...</h3>
                                <ProgressLinearWithValueLabel setVar={{ uploadProgress, setUploadProgress }} />
                            </div>
                }
            </div>
            <input type="file" ref={ref} hidden accept="image/*" onChange={handleFileInputChange} />
        </section>
    )
}
export default UploadLogo;
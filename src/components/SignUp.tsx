import { Checkbox } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import GoogleAddress from "./GoogleAddress";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { MessageBoxModal, OTPModal } from "./Modal";
import WaitingLocker from "./WaitingLocker";
import { OTPStore } from "@/store/store";
import { validateEmail } from "@/types/utils";
interface MyObject {
    [key: string]: string | number;
}

export const queryBuilder = (data: MyObject) => Object.keys(data).map(key => `${key}=${encodeURIComponent(data[key])}`).join('&')
const genCode = () => {
    const randomNumber = Math.floor(Math.random() * 900000) + 100000;
    return randomNumber.toString();
}
const SignUp = ({ value, openState: { open, setOpen }, setMsg }: { value: number, openState: { open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>> }, setMsg: React.Dispatch<React.SetStateAction<string>> }) => {
    const { otpState, dispatchOtpState } = useContext(OTPStore);
    const [checked, setChecked] = useState(false);
    const router = useRouter();
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        dispatchOtpState({ type: 'CHANGE_FORMDATA', payload: { value: { [name]: value } } })//({ ...prev, [name]: value })
    }
    const handlePlaceChange = (place: any) => {console.log(place)
        const address = place.name ? place.name : place.formatted_address;
        dispatchOtpState({ type: 'CHANGE_FORMDATA', payload: { value: { address } } })
    }
    const handlePhoneChage = (phone: string, cc: any, __: any, phoneformat: string) => {
        dispatchOtpState({ type: 'CHANGE_FORMDATA', payload: { value: { phone_number: phoneformat } } })
    }
    //!  Validate
    const [validEmail, setValidEmail] = useState(true);
    const [validPassword, setValidPassword] = useState(true);
    const [validName, setValidName] = useState(true);
    const [validAddress, setValidAddress] = useState(true);
    const handleClick = async () => {
        const { email, name, password, ACN, address, phone_number } = otpState.formData;
        setValidEmail(validateEmail(email));
        setValidPassword(password.trim() !== "");
        setValidName(name.trim() !== "")
        setValidAddress(address.trim() !== "")
        if (!validateEmail(email)) return;
        if ([password, name, address, phone_number].some(item => item.trim() === "")) return;
        if (email.endsWith("@gmail.com")) {
            setMsg("Please use Google Sign above.");
            setOpen(true);
            return;
        }
        //!  Validate
        dispatchOtpState({ type: "SET_WAITING", payload: { value: true } })
        const { data: { data } } = await axios.get(`/api/users?email=${encodeURIComponent(email)}`);
        dispatchOtpState({ type: "SET_WAITING", payload: { value: false } })
        if (data.length > 0) {
            setMsg("Already registered user")
            setOpen(true);
        } else {
            const code = genCode()
            dispatchOtpState({ type: "SET_WAITING", payload: { value: true } })
            dispatchOtpState({ type: 'SET_OTPCODE', payload: { value: code } })
            const { data: { message: _msg } }: { data: { message: string | object } } = await axios.get(`/api/sendmail?${queryBuilder({ email: email, code: code })}`)

            dispatchOtpState({ type: "SET_WAITING", payload: { value: false } })
            if (typeof _msg === "string") {// && _msg.startsWith("250")
                dispatchOtpState({ type: "SET_WAITING", payload: { value: false } })
                dispatchOtpState({ type: "SHOW_OTPCODE", payload: { value: true } });
            } else {
                setMsg("Error occured while processing information")
                setOpen(true);
            }
        }
    }
    return (
        <div className={`flex flex-col gap-4 justify-center items-center ${value === 0 ? 'h-[200px]' : 'h-[500px]'} transition-all ease-in-out`}>
            <div className="flex flex-col">
                <div className="flex gap-0 justify-center items-center pl-10 text-[#888888] bg-[#f2f2f6] rounded-tr-md rounded-br-md overflow-hidden relative">
                    <svg className='w-4 h-4 absolute left-[14px] top-3 align-baseline inline-block stroke-current fill-none '><use href="#mail"></use></svg>
                    <input name='email' type="email" onChange={handleChange} className="w-[220px] h-10 border border-[#f2f2f6] px-4 text-[14px] leading-normal" placeholder="Email" />
                </div>
                {!validEmail && <h4 className="text-[12px] text-red-600">*Invalid email type. Please fill in correct type.</h4>}
            </div>
            <div className="flex flex-col">
                <div className="flex gap-0 justify-center items-center pl-10 text-[#888888] bg-[#f2f2f6] rounded-tr-md rounded-br-md overflow-hidden relative">
                    <svg className='w-4 h-4 absolute left-[14px] top-3 align-baseline inline-block stroke-current fill-none '><use href="#user"></use></svg>
                    <input name='name' onChange={handleChange} className="w-[220px] h-10 border border-[#f2f2f6] px-4 text-[14px] leading-normal" placeholder="Applicant(s)" />
                </div>
                {!validName && <h4 className="text-[12px] text-red-600">*Your applicant information is not valid.</h4>}
            </div>
            <div className="flex flex-col">
                <div className="flex gap-0 justify-center items-center pl-10 text-[#888888] bg-[#f2f2f6] rounded-tr-md rounded-br-md overflow-hidden relative">
                    <svg className='w-4 h-4 absolute left-[14px] top-3 align-baseline inline-block stroke-current fill-none '><use href="#lock"></use></svg>
                    <input name='password' onChange={handleChange} type="password" className="w-[220px] h-10 border border-[#f2f2f6] px-4 text-[14px] leading-normal" placeholder="Password" />
                </div>
                {!validPassword && <h4 className="text-[12px] text-red-600">*Please enter your password correctly.</h4>}
            </div>
            <div className="flex flex-col">
                <div className="flex gap-0 justify-center items-center pl-10 text-[#888888] bg-[#f2f2f6] rounded-tr-md rounded-br-md overflow-hidden relative">
                    <svg className='w-4 h-4 absolute left-[14px] top-3 align-baseline inline-block stroke-current fill-none '><use href="#code"></use></svg>
                    <input name='ACN' onChange={handleChange} className="w-[220px] h-10 border border-[#f2f2f6] px-4 text-[14px] leading-normal" placeholder="ACN(optional)" />
                </div>

            </div>
            <div className="flex flex-col">
                <div className="flex gap-0 justify-center items-center pl-10 text-[#888888] bg-[#f2f2f6] rounded-tr-md rounded-br-md overflow-hidden relative">
                    <svg className='w-4 h-4 absolute left-[14px] top-3 align-baseline inline-block stroke-current fill-[#888888] '><use href="#address"></use></svg>
                    <GoogleAddress onPlaceChange={handlePlaceChange} className="w-[220px] h-10 border border-[#f2f2f6] px-4 text-[14px] leading-normal" />
                </div>
                
                {!validAddress && <h4 className="text-[12px] text-red-600">*Please enter your address correctly.</h4>}
            </div>
            <div className="flex flex-col w-[260px]">
                <PhoneInput
                    isValid={(value, country) => {
                        if (value.length < 9) return 'Wrong number.'
                        if (value.match(/12345/)) {
                            const countryName = (country as { name: string }).name;
                            return 'Invalid number in ' /* + value  + ', '*/ + countryName;
                        } else if (value.match(/1234/)) {
                            return false;
                        } else {
                            return true;
                        }
                    }}
                    placeholder='+61 (12) 345 6789'
                    onChange={handlePhoneChage}
                    // onChange={e => setCustomer(prev => ({ ...prev, Phone: e }))}
                    // value={''}
                    inputStyle={{ width: "100%", }}
                    country={'au'}

                />
            </div>

            <div className="flex items-start">
                <Checkbox checked={checked} onChange={(e) => setChecked(e.target.checked)} size="small" />
                <span className="text-[12px] leading-4 text-[#888888]">I agree to Trade Mark Today&apos;s privacy notice and terms and conditions.</span>
            </div>

            <button onClick={handleClick} disabled={!checked} className="flex transition-all ease-in-out disabled:bg-[#9b9b9b] justify-center items-center rounded-md w-[300px] bg-[#5d2067] uppercase text-white leading-[42px]">Register</button>

        </div>
    )
}
export default SignUp;
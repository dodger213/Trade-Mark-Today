import * as React from 'react';
import Box from '@mui/material/Box';
import jwt from 'jsonwebtoken'
import { setCookie } from 'nookies';

import { JWT_SIGN_KEY, hash } from '@/types/utils';
import Modal from '@mui/material/Modal';
import { useRouter } from 'next/router';
import { OTPStore, PiniaStore } from '@/store/store';
import axios from 'axios';

type ModalType = {
    openState:
    {
        open: boolean,
        setOpen: React.Dispatch<React.SetStateAction<boolean>>
    },
    children?: React.ReactNode
}
const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
}
const ModalContainer = ({ openState: { open, setOpen }, children, title, msg }: ModalType & { title: string, msg: string }) => {
    return (
        <Modal
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box borderRadius={2} sx={style}>
                <div className='flex flex-col gap-4'>
                    <div className='flex justify-between'>
                        <h2 className='font-mont text-[24px] leading-9'>{title}</h2>
                        <button onClick={() => setOpen(false)} className="flex flex-col justify-center items-center w-12 h-12  border-[#040C13] hover:border rounded-md">
                            <svg className='self-center w-[22px] h-[22px] align-baseline inline-block stroke-black'><use href="#x"></use></svg>
                        </button>
                    </div>
                    <p>{msg}</p>
                    {children}
                </div>
            </Box>
        </Modal>
    )
}


export const ConfirmStartAgainModal = ({ openState: { open, setOpen }, children }: ModalType) => {
    const { pinia, setPinia } = React.useContext(PiniaStore);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const router = useRouter();
    const handleStartAgain = () => {
        setPinia({});
        router.push('/select')
    }
    return (
        <div>
            {children}
            <ModalContainer openState={{ open, setOpen }} title="Clear search details?" msg="Starting again will clear your current trade mark and class selections." >
                <div className='flex gap-4'>
                    <button onClick={handleStartAgain} className='rounded-md w-full font-semibold hover:bg-[#72757E] transition-all flex justify-center gap-4 items-center ease-in-out bg-[#373f86] h-[46px] text-white'>
                        Yes, start again
                    </button>
                    <button onClick={() => setOpen(false)} className='rounded-md w-full font-semibold hover:bg-[#72757E] transition-all flex justify-center gap-4 items-center ease-in-out text-[#373f86] h-[46px] bg-white border border-black hover:text-white'>
                        Cancel
                    </button>
                </div>
            </ModalContainer >
        </div >
    );
}
export const ConfirmSignForApplyModal = ({ openState: { open, setOpen }, children }: ModalType) => {
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const router = useRouter();
    return (
        <div>
            {children}
            <ModalContainer openState={{ open, setOpen }} title="Apply with your IP Australia account" msg="Doing so means you can manage your trade mark request and we can contact you later with any updates." >
                <div className='flex gap-4'>
                    <button onClick={() => router.push('/auth')} className='rounded-md w-full font-semibold hover:bg-[#72757E] transition-all flex justify-center gap-4 items-center ease-in-out bg-[#373f86] h-[46px] text-white'>
                        Login
                    </button>
                    <button onClick={() => router.push('/auth')} className='rounded-md w-full font-semibold hover:bg-[#72757E] transition-all flex justify-center gap-4 items-center ease-in-out text-[#1D252C] h-[46px] bg-white border border-black hover:text-white'>
                        Sign up
                    </button>
                </div>
            </ModalContainer >
        </div >
    );
}
export const OTPModal = ({ openState: { open, setOpen }, setMsg }: { openState: { open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>> }, setMsg: React.Dispatch<React.SetStateAction<string>> }) => {
    const { otpState, dispatchOtpState } = React.useContext(OTPStore);
    const [code, setCode] = React.useState('');
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setCode(e.target.value);
    const router = useRouter();
    const onConfirm = async (c: string) => {
        if (otpState.code === c) {
            const { email, name, password, ACN, address, phone_number } = otpState.formData;
            const token = jwt.sign({ email, name, picture: '', ACN, address, phone_number }, JWT_SIGN_KEY);
            const { data: _data } = await axios.post('/api/users', { email, name, picture: '', ACN, address, phone_number, password: await hash(password) })
            setCookie(null, 'token', token, {
                maxAge: 60 * 60,
                path: '/',
            });
            router.push('/dashboard');
        } else {
            setMsg("Verification code not matching")
            setOpen(true);
        }
    }
    return (
        <>
            <div className={`z-50 bg-black/25 w-screen h-screen absolute top-0 left-0 p-0 m-0 flex justify-center items-center ${otpState.otp ? "" : "hidden"} `}>
                <div className='w-[500px] h-[300px] rounded-md bg-white border border-[#f2f2f6] shadow-[0px_1px_2px_#000] flex flex-col justify-center items-center gap-12 relative'>
                    <button onClick={() => dispatchOtpState({ type: 'SHOW_OTPCODE', payload: { value: false } })} className=" flex flex-col justify-center absolute items-center right-0 top-0 w-8 h-8 m-4 hover:bg-[#C8CAD0] transition-all ease-in-out rounded-full">
                        <svg className='self-center w-[10px] h-[10px] align-baseline inline-block stroke-black'><use href="#x"></use></svg>
                    </button>
                    <h1 className='text-[24px] font-mont'>Enter verification code</h1>
                    <input value={code} onChange={handleChange} type="text" maxLength={6} minLength={6} placeholder='123456' className='w-[250px] h-10 border border-[#ababab] rounded-md text-[20px] font-mont text-center' />
                    <div className='flex gap-6'>
                        <button onClick={() => onConfirm(code)} className='w-32 h-10 bg-purple-700 hover:bg-purple-500 transition-all ease-in-out rounded-lg text-white text-[22px]'>Confirm</button>
                        <button onClick={() => dispatchOtpState({ type: 'SHOW_OTPCODE', payload: { value: false } })} className='w-32 h-10 bg-cyan-300 hover:bg-cyan-50 hover:text-black transition-all ease-in-out rounded-lg text-white text-[22px]'>Cancel</button>
                    </div>

                </div>
            </div >
        </>
    );
}
export const MessageBoxModal = ({ openState: { open, setOpen }, title, msg }: ModalType & { title: string, msg: string }) => {
    return (
        <Modal
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box borderRadius={2} sx={style}>
                <div className='flex flex-col gap-4'>
                    <div className='flex justify-between'>
                        <h2 className='font-mont text-[24px] leading-9'>{title}</h2>
                        <button onClick={() => setOpen(false)} className="flex flex-col justify-center items-center w-12 h-12  border-[#040C13] hover:border rounded-md">
                            <svg className='self-center w-[22px] h-[22px] align-baseline inline-block stroke-black'><use href="#x"></use></svg>
                        </button>
                    </div>
                    <p>{msg}</p>
                    <div className='flex gap-4 justify-center'>
                        <button onClick={() => setOpen(false)} className='rounded-md w-40 font-semibold hover:bg-[#72757E] transition-all flex justify-center gap-4 items-center ease-in-out bg-[#1D252C] h-[46px] text-white'>
                            OK
                        </button>
                    </div>
                </div>
            </Box>
        </Modal>
    )
}
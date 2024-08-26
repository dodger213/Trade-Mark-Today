import { AuthStatus } from "@/types/interface";
import { validateEmail } from "@/types/utils";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";

const Login = ({ openState: { open, setOpen }, setMsg }: { openState: { open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>> }, setMsg: React.Dispatch<React.SetStateAction<string>> }) => {
    const router = useRouter()
    const [validEmail, setValidEmail] = useState(true);
    const [validPassword, setValidPassword] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const handleClick = async () => {
        //!  Validate
        const { email, password } = formData;
        setValidEmail(validateEmail(email));
        if (!validateEmail(email)) return;
        setValidPassword(password.trim() !== "");
        if (password.trim() === "") return;
        if (email.endsWith("@gmail.com")) {
            setMsg("Please use Google Sign above.");
            setOpen(true);
            return;
        }
        //!  Validate
        const { data: { authStatus } }: { data: { authStatus: AuthStatus } } = await axios.post('/api/login', formData);
        switch (authStatus) {
            case "PASSED":
                router.push('dashboard');
                break;
            case "UNREGISTER_USER":
                setMsg("Your email is not registered. Please sign up first.")
                setOpen(true);
                break;
            case "INVALID_PASSWORD":
                setMsg("Password is not valid")
                setOpen(true);
            default:
                break;
        }
    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }))
    }
    return (
        <div className="flex flex-col h-full gap-4 justify-start items-center">
            <div className="flex flex-col">
                <div className="flex gap-0 justify-center items-center pl-10 text-[#888888] bg-[#f2f2f6] rounded-tr-md rounded-br-md overflow-hidden relative">
                    <svg className='w-4 h-4 absolute left-[14px] top-3 align-baseline inline-block stroke-current fill-none '><use href="#mail"></use></svg>
                    <input name='email' type="email" onChange={handleChange} className="w-[220px] h-10 border border-[#f2f2f6] px-4 text-[14px] leading-normal" placeholder="Email" />
                </div>
                {!validEmail && <h4 className="text-[12px] text-red-600">*Invalid email type. Please fill in correct type.</h4>}
            </div>
            <div className="flex flex-col">
                <div className="flex gap-0 justify-center items-center pl-10 text-[#888888] bg-[#f2f2f6] rounded-tr-md rounded-br-md overflow-hidden relative">
                    <svg className='w-4 h-4 absolute left-[14px] top-3 align-baseline inline-block stroke-current fill-none '><use href="#lock"></use></svg>
                    <input name='password' onChange={handleChange} type="password" className="w-[220px] h-10 border border-[#f2f2f6] px-4 text-[14px] leading-normal" placeholder="Password" />
                </div>
                {!validPassword && <h4 className="text-[12px] text-red-600">*Please enter your password correctly.</h4>}
            </div>
            <a href="#" className="cursor-pointer"><h6 className="text-[14px]">Forgot password?</h6></a>
            <button onClick={handleClick} className="flex justify-center items-center rounded-md w-[300px] bg-[#5d2067] uppercase text-white leading-[42px]">Log In</button>
        </div>
    )
}
export default Login;
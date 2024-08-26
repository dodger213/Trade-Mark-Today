import { ContextType, PiniaContextType, StateType } from '@/types/interface';
import { createContext } from 'react';
export const initialState: StateType = {
    otp: false,
    code: '',
    waiting: false,
    formData: {
        email: '',
        name: '',
        password: '',
        ACN: '',
        address: '',
        phone_number: ''
    }
}
export const OTPStore = createContext<ContextType>({
    otpState: initialState,
    dispatchOtpState: (_: {}) => { }
});
export const PiniaStore = createContext<PiniaContextType>({
    pinia: {},
    setPinia: (_: {}) => { }
})
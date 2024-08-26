import { ActionType, FormDataType, StateType } from "@/types/interface";

const reducer = (state: StateType, action: ActionType): StateType => {
    switch (action.type) {
        case "CHANGE_FORMDATA":
            return {
                ...state,
                formData: { ...state.formData, ...action.payload.value as { [key: string]: string; } }
            };
        case "SET_OTPCODE":
            return {
                ...state,
                code: action.payload.value as string
            };
        case "SHOW_OTPCODE":
            return {
                ...state,
                otp: action.payload.value as boolean
            };
        case "SET_WAITING":
            return {
                ...state,
                waiting: action.payload.value as boolean
            };
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}
export default reducer;
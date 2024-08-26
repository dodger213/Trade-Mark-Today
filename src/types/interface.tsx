import { IncomingMessage, ServerResponse } from "http"
export type AuthStatus = "NONE" | "PASSED" | "UNREGISTER_USER" | "INVALID_PASSWORD"
export type User = {
  email: string
  name: string
  password: string
  given_name: string
  family_name: string
  picture: string
  ACN: string
  phone_number: string
  address: string
}
export type Context = {
  req: IncomingMessage; // an HTTP incoming message object (e.g., from Node.js http.IncomingMessage)
  res: ServerResponse; // an HTTP server response object (e.g., from Node.js http.ServerResponse)
}
export type FormDataType = {
  email: string
  name: string
  password: string
  ACN: string
  phone_number: string
  address: string
}
export interface StateType {
  otp: boolean
  code: string
  waiting: boolean
  formData: FormDataType
}
type ClassPinia = {
  id: string;
  tmClass: string;
  description: string;
};
type ClassPinias = {
  [key: string]: ClassPinia[];
};
export interface PiniaType {
  initiated?: boolean
  acceptedTerms?: boolean
  markType?: 'Word' | 'Logo'
  word?: string
  wordContained?: boolean
  containedWord?: 'string'
  logo?: string
  classes?: ClassPinias
}
export interface ActionType {
  type: 'CHANGE_FORMDATA' | 'SET_OTPCODE' | 'SHOW_OTPCODE' | 'SET_WAITING';
  payload: {
    value: FormDataType | string | boolean | { [key: string]: string }
  }
}
export type DispatchType = (action: ActionType) => void;

export interface ContextType {
  otpState: StateType;
  dispatchOtpState: DispatchType;
}
export interface PiniaContextType {
  pinia: PiniaType;
  setPinia: (_: {}) => void;
}
export type Message = {
  time?: string
  key: string
  channel: string
  author: string;
  message: string;
  viewed?: boolean
  deliveredToServer?: boolean
  deliveredToClient?: boolean
};
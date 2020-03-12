import { Messages } from "./messages.interface";

export interface Display {
    index: number
    messages: Record<string, Messages>
    url: string
    width: string
    height: string
    actionIdentifier: string
}
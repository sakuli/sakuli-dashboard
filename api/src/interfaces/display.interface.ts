import { Messages } from "./messages.interface";

export interface Display {
    index: number
    messages: Record<string, Messages>
    description?: string
    url: string
    width: string
    height: string
    actionIdentifier: string
}
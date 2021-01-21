import {isMessages, Messages} from "./messages.interface";

export interface Display {
    index: number
    messages: Record<string, Messages>
    url: string
    width: string
    height: string
    actionIdentifier: string
}

export function isDisplay(json: any): json is Display {
    function validateMessages() {
        if (!json.messages || typeof json.messages !== "object") {
            return false;
        }
        for (let message of Object.values(json.messages)) {
            if (!isMessages(message)) {
                return false;
            }
        }
        return true;
    }

    if (!json) {
        return false;
    }

    return Object.keys(json).length === 6 &&
        json.index &&
        validateMessages() &&
        json.url &&
        json.width &&
        json.height &&
        json.actionIdentifier;
}
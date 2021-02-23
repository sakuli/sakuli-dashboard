import { isMessages, Messages } from "./messages.interface";

export interface Display {
    index: number
    messages?: Record<string, Messages>
    url: string
    width?: string
    height?: string
    actionIdentifier?: string
}

export function isDisplay(json: any): json is Display {
    function validateMessages() {
        if(!json.messages){
            return true
        }

        if (typeof json.messages !== "object") {
            return false;
        }

        for (let message of Object.values(json.messages)) {
            if (!isMessages(message)) {
                return false;
            }
        }
        return true;
    }

    function validateWidth(){
        return !json.width || typeof json.width === "string"
    }

    function validateHeight(){
        return !json.height || typeof json.height === "string"
    }

    function validateActionIdentifier(){
        return !json.actionIdentifier || typeof json.actionIdentifier === "string"
    }

    if (!json) {
        return false;
    }

    return typeof json.index === "number" &&
        typeof json.url === "string" &&
        validateMessages() &&
        validateWidth()  &&
        validateHeight() &&
        validateActionIdentifier()
}
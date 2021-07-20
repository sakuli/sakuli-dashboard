import { isMessages, Messages } from "./messages.interface";
import { DisplayType, isDisplayType } from "./displayType.interface";

export interface Display {
    index: number
    type?: DisplayType
    messages?: Record<string, Messages>
    url?: string
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

    function validateDisplayType() {
        if(isDisplayType(json.type) && json.type === "logs"){
            /**
             * If type is logs, we require an actionIdentifier to correlate
             * the logs from the pod performing the action
             */
            return typeof json.actionIdentifier === "string"
        } else{
            /**
             * if type is not set => default is "website"
             * In this case we require an url to display
             */
            return typeof json.url === "string"
        }
    }

    if (!json) {
        return false;
    }

    return typeof json.index === "number" &&
        validateDisplayType() &&
        validateMessages() &&
        validateWidth()  &&
        validateHeight() &&
        validateActionIdentifier()
}
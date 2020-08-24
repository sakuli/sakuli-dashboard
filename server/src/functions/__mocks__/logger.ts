import { mockPartial } from "sneer";
import { Logger } from "winston";

const debugLogger = jest.fn()
const infoLogger = jest.fn()
const errorLogger = jest.fn()

export function logger() {
    return mockPartial<Logger>({
        debug: debugLogger,
        info: infoLogger,
        error: errorLogger
    })
}
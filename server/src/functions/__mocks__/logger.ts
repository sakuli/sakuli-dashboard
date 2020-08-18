import { mockPartial } from "sneer";
import { Logger } from "winston";

export function logger() {
    return mockPartial<Logger>({
        debug: jest.fn()
    })
}
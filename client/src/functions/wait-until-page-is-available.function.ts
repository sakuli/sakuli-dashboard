import { sleep } from "./sleep.function";
import { urlAvailable } from "./url-available.function";

export async function waitUntilPageIsAvailable(newUrl: string, pollingInterval: number): Promise<void> {
    while (!await urlAvailable(newUrl)) {
        await sleep(pollingInterval);
    }
}
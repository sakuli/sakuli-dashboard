import { sleep } from "./sleep.function";
import { urlAvailable } from "./url-available.function";

export async function waitUntilPageIsAvailable(newUrl: string, pollingInterval: number, jwtToken?: string): Promise<void> {
    while (!await urlAvailable(newUrl, jwtToken)) {
        await sleep(pollingInterval);
    }
}
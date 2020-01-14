import { sleep } from "./sleep.function";
import { checkUrl } from "../services/dashboard-backend.service";

function urlNotAvailable(newUrl: string) : Promise<boolean>{
    return checkUrl({healthEndpoint: newUrl})
        .then(response => response.status !== 200)
        .catch(() => true);
}

export async function pageIsAvailable(newUrl: string, pollingInterval: number): Promise<void> {
    while (await urlNotAvailable(newUrl)) {
        await sleep(pollingInterval);
    }
}
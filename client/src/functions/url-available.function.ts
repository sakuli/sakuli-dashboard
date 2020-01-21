import { healthCheck } from "../services/dashboard-backend.service";

export function urlAvailable(url: string) : Promise<boolean>{
    return healthCheck({url: url})
        .then(response => response.status === 200)
        .catch(() => true);
}
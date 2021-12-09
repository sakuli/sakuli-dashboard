import { healthCheck } from "../services/dashboard-backend.service";

export function urlAvailable(url: string, jwtToken?: string) : Promise<boolean>{
    return healthCheck({url: url}, jwtToken)
        .then(response => response.status === 200)
        .catch(() => true);
}
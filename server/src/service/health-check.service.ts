import { HealthCheckRequest, HttpStatusCode } from "@sakuli-dashboard/api";
import fetch from "node-fetch";

export interface HealthCheckService {
    checkUrl: (checkUrlRequest: HealthCheckRequest) => Promise<number>
}
export function healthCheckService(): HealthCheckService{
    function checkUrl(checkUrlRequest: HealthCheckRequest): Promise<number>{
        const healthEndpoint = checkUrlRequest.url;
        console.debug(`fetching url. ${healthEndpoint}`);
        return fetch(healthEndpoint)
            .then(response => {
                console.debug(`Performing health check. Returned status code: ${response.status}`);
                return response.status
            })
            .catch((e) => {
                console.log("could not perform health check.", e);
                return HttpStatusCode.INTERNAL_SERVER_ERROR
            });
    }

    return ({
        checkUrl
    })
}
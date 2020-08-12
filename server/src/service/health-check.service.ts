import { HealthCheckRequest, HttpStatusCode } from "@sakuli-dashboard/api";
import fetch from "node-fetch";
import { logger } from "../functions/logger";

export interface HealthCheckService {
    checkUrl: (checkUrlRequest: HealthCheckRequest) => Promise<number>
}
export function healthCheckService(): HealthCheckService{
    function checkUrl(checkUrlRequest: HealthCheckRequest): Promise<number>{
        const healthEndpoint = checkUrlRequest.url;
        logger().debug(`fetching url. ${healthEndpoint}`);
        return fetch(healthEndpoint)
            .then(response => {
                logger().debug(`Performing health check. Returned status code: ${response.status}`);
                return response.status
            })
            .catch((e) => {
                logger().error(`could not perform health check on url ${healthEndpoint}: `, e);
                return HttpStatusCode.INTERNAL_SERVER_ERROR
            });
    }

    return ({
        checkUrl
    })
}
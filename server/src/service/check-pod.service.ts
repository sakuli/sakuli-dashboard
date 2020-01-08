import fetch from 'node-fetch';
import HttpStatusCode from "../api/HttpStatusCode";

export function checkPod(url: string): Promise<number>{
   return fetch(url)
           .then(response => {
              console.debug(`checked pod. Returned status code: ${response.status}`);
              return response.status
           })
           .catch((e) => {
              console.log("cloud not check pod", e);
              return HttpStatusCode.INTERNAL_SERVER_ERROR
           });
}
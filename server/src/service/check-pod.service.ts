import fetch from 'node-fetch';
import HttpStatusCode from "../api/HttpStatusCode";

export function checkPod(url: string): Promise<number>{
   return fetch(url)
           .then(response => response.status)
           .catch(() => HttpStatusCode.INTERNAL_SERVER_ERROR);
}
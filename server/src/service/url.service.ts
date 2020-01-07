import fetch from 'node-fetch';

export function checkUrl(url: string): Promise<number>{
  console.log(url)
   return fetch(url)
           .then(response => response.status)
           .catch(e => {
             console.log("catch", e);
             return 500
           });
}
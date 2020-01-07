export function checkUrl(url: string): Promise<number>{
   return new Promise<number>(resolve => {
       fetch(url)
           .then(response => resolve(response.status))
           .catch(() => resolve(500));
   });
}
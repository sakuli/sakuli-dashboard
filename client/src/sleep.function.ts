export function sleep(timeToSleep: number) : Promise<void>{
    return new Promise(resolve => setTimeout(resolve, timeToSleep));
}
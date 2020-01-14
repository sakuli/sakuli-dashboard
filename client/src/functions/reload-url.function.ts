export function reloadUrl(url: string) {
    if(url.endsWith("#")){
        return url.slice(0, -1);
    }
    return url.endsWith("/") ? url.concat("#") : url.concat("/#");
}
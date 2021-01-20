export type Messages = {
    description: string
    infoText: string
}

export function isMessages(json: any): json is Messages{
    return !!(
      Object.keys(json).length === 2 &&
      (json as Messages).description &&
      (json as Messages).infoText
    )
}
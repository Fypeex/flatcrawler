export interface Endpoint {
    sitename: string,
    "url": string,
    "type": "API-GET" | "API-POST" | "HTML",
    "arguments": EndpointArguments
    "result": EndpointResult
}

export type EndpointArguments = {
    [key: string]: string | number | boolean | any
}
export type EndpointResult = {
    "implicit": boolean,
    "resultType"?: "id" | "link",
    "resultPath"?: string[],
    "resultFormat": "array" | "object"
    "flatEndpoint": string
}
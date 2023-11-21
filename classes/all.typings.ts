

export type ASYNC_RESPONSE<T = any> = { success: boolean, description?: string, data?: T, errors?: string };

export type HOSTED_ZONE_DATA = {
    hostedZone: string,
    hostedZoneID: string
}


export type ASYNC_RESPONSE<T = any> = { success: boolean, description?: string, data?: T, errors?: string };

export type HOSTED_ZONE_DATA = {
    hostedZone: string,
    hostedZoneID: string
}

export type SUBDOMAIN_DATA = {
    hostedZone: string,
    subdomainName: string,
    recordType: string,
    recordValue: string,
    TTL: number
}
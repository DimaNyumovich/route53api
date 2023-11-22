

export type ASYNC_RESPONSE<T = any> = { success: boolean, description?: string, data?: T, errors?: string };

export type HOSTED_ZONE_DATA = {
    hostedZone: string,
    hostedZoneID: string
}

export type SUBDOMAIN_DATA = {
    hostedZone: string,
    subdomainName: string,
    recordValue: string,
    TTL: number
}

export type DOMAIN_NAME = {
    hostedZone: string
}


import {
    Route53Client,
    ListHostedZonesCommand,
    ChangeResourceRecordSetsCommand,
    Change
} from '@aws-sdk/client-route-53';
import { ASYNC_RESPONSE, SUBDOMAIN_DATA} from "../../classes/all.typings";

export class MyRoute53 {

    private static instance: MyRoute53 = new MyRoute53();
    private hostedZonesDataMap = new Map<string, string>()
    private credentials = {
        accessKeyId: '',
        secretAccessKey: ''
    };
    private route53Client = undefined

    constructor() {

    }

    private init = async (accessKeyId, secretAccessKey) => {
        this.credentials.accessKeyId = accessKeyId
        this.credentials.secretAccessKey = secretAccessKey
        const credentials = this.credentials
        this.route53Client = new Route53Client({credentials});
        await this.getAllDomainNames()
    }

    private getAllDomainNames = async (): Promise<ASYNC_RESPONSE> => {
        const res: ASYNC_RESPONSE = {
            success: false
        }
        try {
            const command = new ListHostedZonesCommand({});
            const result = await this.route53Client.send(command);

            if (result.HostedZones && result.HostedZones.length > 0) {
                result.HostedZones.map((zone) => {
                    // this.hostedZonesDataMap.push({hostedZone: zone.Name, hostedZoneID: zone.Id})
                    this.hostedZonesDataMap.set(zone.Name, zone.Id)
                });
                // console.log('List of domain names:', this.hostedZonesDataMap);
                res.success = true
                res.data = Array.from(this.hostedZonesDataMap.keys()).map(str => str.slice(0, -1));
                let a = 0
            } else {
                res.data = 'No hosted zones found.'
                // console.log('No hosted zones found.');
            }
        } catch (error) {
            res.data = error
            // console.error('Error listing hosted zones:', error);
        }
        return res
    };

    private createSubdomain = async (subdomainData: SUBDOMAIN_DATA): Promise<ASYNC_RESPONSE> => {
        const res: ASYNC_RESPONSE = {
            success: false
        }
        let hostedZoneId = ''
        const ifHostedZonesDataMapHasHostedZone = this.ifHostedZonesDataMapHasHostedZone(subdomainData.hostedZone)
        if(ifHostedZonesDataMapHasHostedZone){
            hostedZoneId = ifHostedZonesDataMapHasHostedZone as string
        }else {
            res.data = 'hostedZone doesn\'t exist'
            return res
        }


        const hostedZone = subdomainData.hostedZone
        const subdomainName = subdomainData.subdomainName
        const recordType = 'A'
        const recordValue = subdomainData.recordValue;
        const TTL = subdomainData.TTL;

        const changes: Change[] = [
            {
                Action: 'CREATE',
                ResourceRecordSet: {
                    Name: `${subdomainName}.${hostedZone}`, // Собираем полное имя поддомена
                    Type: recordType,
                    TTL: TTL,
                    ResourceRecords: [
                        {
                            Value: recordValue,
                        },
                    ],
                },
            },
        ];

        const params = {
            ChangeBatch: {
                Changes: changes,
            },
            HostedZoneId: hostedZoneId,
        };

        try {
            const command = new ChangeResourceRecordSetsCommand(params);
            const result = await this.route53Client.send(command);
            // console.log('Subdomain created successfully:', result);
            res.success = true
            res.data = result
        } catch (error) {
            console.error('Error creating subdomain:', error);
            error.reason = 'Subdomain already exists'
            res.data = error
        }
        return res
    };
    
    private ifHostedZonesDataMapHasHostedZone = (hostedZone: string): string | boolean => {
        let res: string | boolean = undefined
        if(this.hostedZonesDataMap.has(hostedZone + '.')){
            res = this.hostedZonesDataMap.get(hostedZone + '.').split('/')[2]
        }else {
            res = false
        }
        return res
    }

    public static init = MyRoute53.instance.init;
    public static createSubdomain = MyRoute53.instance.createSubdomain;
    public static getAllDomainNames = MyRoute53.instance.getAllDomainNames;

}

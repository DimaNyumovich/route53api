import {
    Route53Client,
    ListHostedZonesCommand,
    ChangeResourceRecordSetsCommand,
    Change
} from '@aws-sdk/client-route-53';
import {HOSTED_ZONE_DATA} from "../../classes/all.typings";

export class Route53 {

    private static instance: Route53 = new Route53();
    private hostedZonesDataMap: HOSTED_ZONE_DATA[] = []
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

        // await this.createSubdomain()
    }

    private getAllDomainNames = async () => {
        try {
            const command = new ListHostedZonesCommand({});
            const result = await this.route53Client.send(command);

            if (result.HostedZones && result.HostedZones.length > 0) {
                result.HostedZones.map((zone) => {
                    this.hostedZonesDataMap.push({hostedZone: zone.Name, hostedZoneID: zone.Id})
                });
                console.log('List of domain names:', this.hostedZonesDataMap);
            } else {
                console.log('No hosted zones found.');
            }
        } catch (error) {
            console.error('Error listing hosted zones:', error);
        }
    };

    private createSubdomain = async () => {

        const hostedZoneId = 'Z03264163QIWB8NIPLV70'; // Замените на ID вашей зоны в Route 53
        // const hostedZoneId = 'online-it-school.com'; // Замените на ID вашей зоны в Route 53
        const subdomainName = 'lilia'; // Имя вашего поддомена
        const recordType = 'A'; // Тип записи (например, A, CNAME и т.д.)
        const recordValue = '192.168.1.1'; // Значение записи (например, IP-адрес)

        const changes: Change[] = [
            {
                Action: 'CREATE',
                ResourceRecordSet: {
                    Name: `${subdomainName}.online-it-school.com`, // Собираем полное имя поддомена
                    Type: recordType,
                    TTL: 300,
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
            console.log('Subdomain created successfully:', result);
        } catch (error) {
            console.error('Error creating subdomain:', error);
        }
    };


    public static init = Route53.instance.init;
    public static createSubdomain = Route53.instance.createSubdomain;

}

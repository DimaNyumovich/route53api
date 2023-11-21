import {
    Route53Client,
    ListHostedZonesCommand,
    ChangeResourceRecordSetsCommand,
    Change
} from '@aws-sdk/client-route-53';
import {HOSTED_ZONE_DATA} from "../../classes/all.typings";

// Настройки AWS
const region = 'Global';  // Замените на ваш регион AWS
const credentials = {
    accessKeyId: 'AKIA5KPY734MLMV255KI',
    secretAccessKey: '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'
};

// Создаем объект для работы с Route 53
const route53Client = new Route53Client({region, credentials});


export class Route53 {

    private static instance: Route53 = new Route53();
    private hostedZonesDataMap: HOSTED_ZONE_DATA[] = []


    constructor() {

    }

    private init =async () => {
        await this.getAllDomainNames()

        await this.createSubdomain()
    }

    private getAllDomainNames = async () => {
        try {
            const command = new ListHostedZonesCommand({});
            const result = await route53Client.send(command);

            if (result.HostedZones && result.HostedZones.length > 0) {
                const domainNames = result.HostedZones.map((zone) => {
                 this.hostedZonesDataMap.push({hostedZone: zone.Name, hostedZoneID: zone.Id})
                });
                console.log('List of domain names:', domainNames);
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
            const result = await route53Client.send(command);
            console.log('Subdomain created successfully:', result);
        } catch (error) {
            console.error('Error creating subdomain:', error);
        }
    };


    public static init = Route53.instance.init;
    public static createSubdomain = Route53.instance.createSubdomain;

}

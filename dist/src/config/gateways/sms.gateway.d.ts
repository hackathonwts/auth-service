export declare class SmsGateway {
    private readonly client;
    sendSMS(phone: string, message: string): Promise<import("twilio/lib/rest/api/v2010/account/message").MessageInstance>;
    sendBulkSms(phones: string[], message: string): Promise<PromiseSettledResult<import("twilio/lib/rest/api/v2010/account/message").MessageInstance>[]>;
    broadcast(message: string): Promise<void>;
}

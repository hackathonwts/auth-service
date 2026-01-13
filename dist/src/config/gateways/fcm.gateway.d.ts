import * as admin from 'firebase-admin';
export declare class FcmGateway {
    sendToUser(token: string, title: string, message: string, thumbnailUrl?: string): Promise<string>;
    sendMulticast(tokens: string[], title: string, message: string): Promise<admin.messaging.BatchResponse>;
    broadcast(title: string, message: string): Promise<string>;
}

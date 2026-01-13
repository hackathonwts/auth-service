import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FcmGateway {
  async sendToUser(token: string, title: string, message: string, thumbnailUrl?: string) {
    return admin.messaging().send({
      token,
      notification: {
        title,
        body: message,
        imageUrl: thumbnailUrl,
      },
    });
  }

  async sendMulticast(tokens: string[], title: string, message: string): Promise<admin.messaging.BatchResponse> {
    const payload = {
      tokens,
      notification: {
        title,
        body: message,
      },
    };

    return admin.messaging().sendEachForMulticast(payload);
  }

  async broadcast(title: string, message: string) {
    return admin.messaging().send({
      topic: 'all-users',
      notification: {
        title,
        body: message,
      },
    });
  }
}

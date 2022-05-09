import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';
@Injectable()
export class PushService {
  constructor() {
    const adminConfig: ServiceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    };

    admin.initializeApp({
      credential: admin.credential.cert(adminConfig),
    });
  }

  async sendPush(token: string, payload: any) {
    try {
      const pushResult = await admin.messaging().sendToDevice(token, payload);
      console.log('pushResult', pushResult);
    } catch (error) {
      console.log('error from push', error);
    }
  }
}

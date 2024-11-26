import { Injectable, Logger } from '@nestjs/common';
import { chunk } from 'lodash';
import * as shell from 'shelljs';
import { mapLimit } from 'async';
import * as firebase from 'firebase-admin';

export interface ISendFirebaseMessages {
  token: string;
  title?: string;
  message: string;
  data?: any;
}
@Injectable()
export class FirebaseService {
  logger = new Logger('FirebaseService');
  constructor() {}
  public async sendFirebaseMessages(firebaseMessages: ISendFirebaseMessages[], dryRun?: boolean): Promise<any> {
    const batchedFirebaseMessages = chunk(firebaseMessages, 500);

    const batchResponses = await mapLimit<ISendFirebaseMessages[]>(
      batchedFirebaseMessages,
      3,
      async (groupedFirebaseMessages: ISendFirebaseMessages[]): Promise<any> => {
        try {
          const tokenMessages: firebase.messaging.TokenMessage[] = groupedFirebaseMessages.map(({ message, title, token, data }) => ({
            notification: { body: message, title },
            token,
            android: {
              notification: {
                body: message,
                title,
                sound: 'default'
              }
            },
            apns: {
              payload: {
                aps: {
                  'content-available': 1,
                  sound: 'default'
                },
                ...data
              }
            },
            fcmOptions: {}
          }));
          console.log('start sending ', tokenMessages.length, 'messages');
          const result = await this.sendAll(tokenMessages, dryRun);
          console.log('result', result.responses.map(r => console.log(r)));
          return result;
        } catch (error) {
          return {
            responses: groupedFirebaseMessages.map(() => ({
              success: false,
              error
            })),
            successCount: 0,
            failureCount: groupedFirebaseMessages.length
          };
        }
      }
    );

    return batchResponses.reduce(
      ({ responses, successCount, failureCount }, currentResponse) => {
        return {
          responses: responses.concat(currentResponse.responses),
          successCount: successCount + currentResponse.successCount,
          failureCount: failureCount + currentResponse.failureCount
        };
      },
      {
        responses: [],
        successCount: 0,
        failureCount: 0
      } as unknown
    );
  }

  public async sendAll(messages: firebase.messaging.Message[], dryRun?: boolean): Promise<firebase.messaging.BatchResponse> {
    // if (process.env.NODE_ENV === 'local') {
    //   for (const { notification, token } of messages) {
    //     shell.exec(
    //       `echo '{ "aps": { "alert": ${JSON.stringify(
    //         notification
    //       )}, "token": "${token}" } }' | xcrun simctl push booted com.company.appname -`
    //     );
    //   }
    // }
    // for (const message of messages) {
    //   console.log('message', message);
    return await firebase.messaging().sendEach(messages, dryRun);
    // }
  }
}

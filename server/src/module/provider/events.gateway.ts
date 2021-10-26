import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server } from 'socket.io';

@WebSocketGateway(8083, {
  transports: ['websocket'],
  cors: false,
  allowEIO3: true,
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  emitMessage(@MessageBody() data: any) {
    this.server.emit('order', data);
    // return from([1, 2, 3]).pipe(map(item => ({ event: 'events', data: item })));
  }

  // @SubscribeMessage('order')
  // findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
  //   return from([1, 2, 3]).pipe(map(item => ({ event: 'events', data: item })));
  // }

  // @SubscribeMessage('identity')
  // async identity(@MessageBody() data: number): Promise<number> {
  //   return data;
  // }
}

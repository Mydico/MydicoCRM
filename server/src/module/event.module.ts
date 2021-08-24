import { Module } from '@nestjs/common';
import { EventsGateway } from './provider/events.gateway';

@Module({
  providers: [EventsGateway],
})
export class EventsModule {}
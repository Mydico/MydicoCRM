import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransportController } from '../web/rest/transport.controller';
import { TransportRepository } from '../repository/transport.repository';
import { TransportService } from '../service/transport.service';

@Module({
    imports: [TypeOrmModule.forFeature([TransportRepository])],
    controllers: [TransportController],
    providers: [TransportService],
    exports: [TransportService],
})
export class TransportModule {}

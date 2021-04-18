import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerTokenController } from '../web/rest/customer-token.controller';
import { CustomerTokenRepository } from '../repository/customer-token.repository';
import { CustomerTokenService } from '../service/customer-token.service';

@Module({
    imports: [TypeOrmModule.forFeature([CustomerTokenRepository])],
    controllers: [CustomerTokenController],
    providers: [CustomerTokenService],
    exports: [CustomerTokenService],
})
export class CustomerTokenModule {}

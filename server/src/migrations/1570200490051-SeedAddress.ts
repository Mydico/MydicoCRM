import { MigrationInterface, QueryRunner } from 'typeorm';
import Customer from '../domain/customer.entity';
import faker from 'faker';
import city from './fixtures/city.json';
import district from './fixtures/district.json';
import wards from './fixtures/wards.json';

import City from '../domain/city.entity';
import District from '../domain/district.entity';
import Wards from '../domain/wards.entity';

export class SeedAddress1570200490051 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        const conn = queryRunner.connection;
        const cityArr = city.map(item => ({
            name: item.label,
            code: item.value,
            isDel: false,
        }));

        const districtArr = district.map(item => ({
            name: item.label,
            code: item.value,
            city: item.parent_code,
            isDel: false,
        }));

        const wardArr = wards.map(item => ({
            name: item.label,
            code: item.value,
            district: item.parent_code,
            isDel: false,
        }));

        await conn
            .createQueryBuilder()
            .insert()
            .into(City)
            .values(cityArr)
            .execute();
        await conn
            .createQueryBuilder()
            .insert()
            .into(District)
            .values(districtArr)
            .execute();
        await conn
            .createQueryBuilder()
            .insert()
            .into(Wards)
            .values(wardArr)
            .execute();
    }

    // eslint-disable-next-line
  public async down(queryRunner: QueryRunner): Promise<any> {}
}

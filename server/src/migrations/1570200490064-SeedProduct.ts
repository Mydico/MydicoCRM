import { MigrationInterface, QueryRunner } from 'typeorm';
export class SeedProduct1570200490064 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const conn = queryRunner.connection;


  }

  // eslint-disable-next-line
  public async down(queryRunner: QueryRunner): Promise<any> {}
}

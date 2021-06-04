import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConnectionOptions } from 'typeorm/connection/ConnectionOptions';

const commonConf = {
  SYNCRONIZE: false,
  ENTITIES: [__dirname + '/domain/*.entity{.ts,.js}'],
  MIGRATIONS: [__dirname + '/migrations/*{.ts,.js}'],
  CLI: {
    migrationsDir: 'src/migrations'
  },
  MIGRATIONS_RUN: true
};

let ormconfig: TypeOrmModuleOptions = {
  name: 'default',
  type: 'sqlite',
  database: '../target/sqlite-dev-db.sql',
  logging: true,
  synchronize: true,
  entities: commonConf.ENTITIES,
  migrations: commonConf.MIGRATIONS,
  cli: commonConf.CLI,
  migrationsRun: commonConf.MIGRATIONS_RUN
};
const roleBDConfig: ConnectionOptions = {
  database: 'MydicoCRM',
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'Dunghd@123'
};
if (process.env.NODE_ENV === 'prod') {
  ormconfig = {
    name: 'default',
    type: 'mysql',
    database: 'MydicoCRM',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'Dunghd@123',
    logging: true,
    synchronize: commonConf.SYNCRONIZE,
    entities: commonConf.ENTITIES,
    migrations: commonConf.MIGRATIONS,
    cli: commonConf.CLI,
    migrationsRun: commonConf.MIGRATIONS_RUN
  };
}

if (process.env.NODE_ENV === 'dev') {
  ormconfig = {
    type: 'mysql',
    database: 'MydicoCRM',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'Dunghd@123',
    logging: true,
    synchronize: true,
    autoLoadEntities: true,
    entities: commonConf.ENTITIES,
    migrations: commonConf.MIGRATIONS,
    cli: commonConf.CLI,
    verboseRetryLog: false,
    migrationsRun: commonConf.MIGRATIONS_RUN
  };
}

export { ormconfig, roleBDConfig };

import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConnectionOptions } from 'typeorm/connection/ConnectionOptions';

const commonConf = {
    dropSchema: true,
    synchronize: true,
    ENTITIES: [__dirname + '/domain/*.entity{.ts,.js}'],
    MIGRATIONS: [__dirname + '/migrations/**/*{.ts,.js}'],
    CLI: {
        migrationsDir: 'src/migrations',
    },
    MIGRATIONS_RUN: true,
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
    migrationsRun: commonConf.MIGRATIONS_RUN,
};
const roleBDConfig: ConnectionOptions = {
    type: 'mysql',
    database: process.env.DATABASE_NAME,
    url: process.env.DATABASE_URL,
    host: 'localhost',
    port: 3306,
    synchronize: true,
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
};
if (process.env.NODE_ENV === 'prod') {
    ormconfig = {
        name: 'default',
        type: 'mysql',
        database: 'MydicoCRM',
        url: process.env.DATABASE_URL,
        logging: false,
        synchronize: commonConf.synchronize,
        entities: commonConf.ENTITIES,
        migrations: commonConf.MIGRATIONS,
        cli: commonConf.CLI,
        username: process.env.USERNAME,
        password: process.env.PASSWORD,
        migrationsRun: commonConf.MIGRATIONS_RUN,
        extra: {
            charset: 'utf8mb4_unicode_ci',
        },
    };
}

if (process.env.NODE_ENV === 'dev') {
    ormconfig = {
        name: 'default',
        type: 'mysql',
        database: 'MydicoCRM',
        url: process.env.DATABASE_URL,
        logging: true,
        synchronize: commonConf.synchronize,
        username: process.env.USERNAME,
        password: process.env.PASSWORD,
        entities: commonConf.ENTITIES,
        migrations: commonConf.MIGRATIONS,
        cli: commonConf.CLI,
        migrationsRun: commonConf.MIGRATIONS_RUN,
        extra: {
            charset: 'utf8mb4_unicode_ci',
        },
    };
}

export { ormconfig, roleBDConfig };

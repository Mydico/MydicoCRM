import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConnectionOptions } from 'typeorm/connection/ConnectionOptions';

const commonConf = {
    SYNCRONIZE: false,
    ENTITIES: [__dirname + '/domain/*.entity{.ts,.js}'],
    MIGRATIONS: [__dirname + '/migrations/*{.ts,.js}'],
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
let roleBDConfig: ConnectionOptions = {
    database: 'MydicoCRM',
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'Dunghd@123',
};
if (process.env.NODE_ENV === 'dev') {
    roleBDConfig = {
        database: 'MydicoCRM',
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: 'Dunghd@123',
    };
}
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
        extra : {
            connectionLimit: 20
        },
        migrationsRun: commonConf.MIGRATIONS_RUN,
        cache: {
            type: 'ioredis',
            options: {
                host: 'localhost',
                port: 6379,
            },
        },
    };
}

if (process.env.NODE_ENV === 'dev') {
    ormconfig = {
        name: 'default',
        type: 'mysql',
        database: 'MydicoCRM',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: 'Dunghd@123',
        logging: true,
        synchronize: true,
        entities: commonConf.ENTITIES,
        migrations: commonConf.MIGRATIONS,
        cli: commonConf.CLI,
        verboseRetryLog: false,
        migrationsRun: commonConf.MIGRATIONS_RUN,
        extra : {
            connectionLimit: 20
        },
        cache: {
            type: 'ioredis',
            alwaysEnabled: true,
            options: {
                host: '127.0.0.1',
                port: 6379,
            },
        },
    };
}

export { ormconfig, roleBDConfig };

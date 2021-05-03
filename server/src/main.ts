require('dotenv').config({ path: '.env' });
import { NestFactory } from '@nestjs/core';
import cloudConfigClient from 'cloud-config-client';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger';
import { config } from './config';
import { Logger, ValidationPipe, BadRequestException } from '@nestjs/common';
import * as express from 'express';
import * as path from 'path';
import * as fs from 'fs';
import helmet from 'helmet';
import { mkdirSync } from 'fs';
import { actionDesc, blackList, contentException, resourceDesc } from './utils/constants/permission-desc';
import { permissionDescriptionNormalize } from './utils/helper/permission-normalization';
import { PermissionGroupStatus } from './domain/enumeration/permission-group-status';
import Permission from './domain/permission.entity';
import { PermissionService } from './service/permission.service';
import { PermissionTypeService } from './service/permission-type.service';
import listEndpoints from 'express-list-endpoints';
import PermissionType from './domain/permission-type.entity';
import { PermissionStatus } from './domain/enumeration/permission-status';

const logger: Logger = new Logger('Main');
const port = process.env.NODE_SERVER_PORT || config.get('server.port');
const useJHipsterRegistry = config.get('eureka.client.enabled');

async function bootstrap(): Promise<void> {
    loadCloudConfig();
    registerAsEurekaService();

    const appOptions = { cors: true };
    const app = await NestFactory.create(AppModule, appOptions);
    app.use(
        helmet({
            contentSecurityPolicy: false,
        })
    );
    app.enableCors({
        exposedHeaders: 'X-Total-Count',
    });
    app.useGlobalPipes(
        new ValidationPipe({
            exceptionFactory: (): BadRequestException => new BadRequestException('Validation error'),
        })
    );

    const staticClientPath = path.join(__dirname, '../dist/classes/static');
    // const staticFilePath = path.join(__dirname, '../uploads');
    if (fs.existsSync(staticClientPath)) {
        app.use(express.static(staticClientPath));
        logger.log(`Serving static client resources on ${staticClientPath}`);
    } else {
        logger.log('No client it has been found');
    }
    // if (fs.existsSync(staticFilePath)) {
    //     app.use('/images', express.static(staticFilePath));
    //     logger.log(`Serving static file resources on ${staticFilePath}`);
    // } else {mkdirSync(staticFilePath);}
    setupSwagger(app);

    await app.listen(port);
    logger.log(`Application listening on port ${port}`);
    const permissionServices = app.get(PermissionService);
    const permissionTypeServices = app.get(PermissionTypeService);
    await permissionServices.clear();
    await permissionTypeServices.clear();
    const server = app.getHttpServer();
    const router = server._events.request._router;
    const endpointList = listEndpoints(router);
    const permissionList: Permission[] = [];
    const permissionTypeList: PermissionType[] = [];

    endpointList.forEach(element => {
        const length = element.path.split('/').length;
        const splitedEndpoint = element.path.split('/').splice(2, length - 1);
        let type = '';
        if (splitedEndpoint.length > 0) {
            type = splitedEndpoint[0];
        }

        let desc = permissionDescriptionNormalize(splitedEndpoint, element);
        const perType: PermissionType = {
            name: type,
            description: `Quản lý ${desc}`,
            status:
        blackList.filter(value => type.includes(value)).length > 0 || type === 'reports'
            ? PermissionGroupStatus.DISABLED
            : PermissionGroupStatus.ACTIVE,
        };
        element.methods.forEach(method => {
            if (method == 'DELETE') {
                desc = desc.replace('chi tiết', '');
            }
            const foundedException = contentException.filter(item => item.method === method && item.type === type);
            const per: Permission = {
                action: method,
                resource: element.path,
                type,
                typeName: `Quản lý ${resourceDesc[type] || ''}`,
                status: blackList.filter(value => element.path.includes(value)).length > 0 ? PermissionStatus.NONEPUBLIC : PermissionStatus.PUBLIC,
                description: `${foundedException.length > 0 ? foundedException[0].replaceContent : actionDesc[method]} ${desc}`,
            };

            permissionList.push(per);
        });
        permissionTypeList.push(perType);
    });
    await permissionServices.saveMany(permissionList);
    await permissionTypeServices.saveMany(
        Array.from(new Set(permissionTypeList.map(a => a.name))).map(name => permissionTypeList.find(a => a.name === name))
    );
}

async function loadCloudConfig(): Promise<void> {
    if (useJHipsterRegistry) {
        const endpoint = config.get('cloud.config.uri') || 'http://admin:admin@localhost:8761/config';
        logger.log(`Loading cloud config from ${endpoint}`);

        const cloudConfig = await cloudConfigClient.load({
            context: process.env,
            endpoint,
            name: config.get('cloud.config.name'),
            profiles: config.get('cloud.config.profile') || ['prod'],
            // auth: {
            //   user: config.get('jhipster.registry.username') || 'admin',
            //   pass: config.get('jhipster.registry.password') || 'admin'
            // }
        });
        config.addAll(cloudConfig.properties);
    }
}

function registerAsEurekaService(): void {
    if (useJHipsterRegistry) {
        logger.log(`Registering with eureka ${config.get('cloud.config.uri')}`);
        const Eureka = require('eureka-js-client').Eureka;
        const eurekaUrl = require('url').parse(config.get('cloud.config.uri'));
        const client = new Eureka({
            instance: {
                app: config.get('eureka.instance.appname'),
                instanceId: config.get('eureka.instance.instanceId'),
                hostName: config.get('ipAddress') || 'localhost',
                ipAddr: config.get('ipAddress') || '127.0.0.1',
                status: 'UP',
                port: {
                    '$': port,
                    '@enabled': 'true',
                },
                vipAddress: config.get('ipAddress') || 'localhost',
                homePageUrl: `http://${config.get('ipAddress')}:${port}/`,
                dataCenterInfo: {
                    '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
                    'name': 'MyOwn',
                },
            },
            eureka: {
                // eureka server host / port
                host: eurekaUrl.hostname || '127.0.0.1',
                port: eurekaUrl.port || 8761,
                servicePath: '/eureka/apps',
            },
            requestMiddleware: (requestOpts, done): any => {
                requestOpts.auth = {
                    user: config.get('jhipster.registry.username') || 'admin',
                    password: config.get('jhipster.registry.password') || 'admin',
                };
                done(requestOpts);
            },
        });
        client.logger.level('debug');
        client.start(error => logger.log(error || 'Eureka registration complete'));
    }
}

bootstrap();

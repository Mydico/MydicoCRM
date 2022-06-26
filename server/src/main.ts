require('dotenv').config({ path: '.env' });
const OS = require('os');
process.env.UV_THREADPOOL_SIZE = OS.cpus().length;
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
import {
  actionDesc,
  blackList,
  blackListPermission,
  contentException,
  removeExceptional,
  resourceDesc
} from './utils/constants/permission-desc';
import { permissionDescriptionNormalize } from './utils/helper/permission-normalization';
import { PermissionGroupStatus } from './domain/enumeration/permission-group-status';
import Permission from './domain/permission.entity';
import { PermissionService } from './service/permission.service';
import { PermissionTypeService } from './service/permission-type.service';
import PermissionType from './domain/permission-type.entity';
import { PermissionStatus } from './domain/enumeration/permission-status';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import compression from 'fastify-compress';
import { contentParser } from 'fastify-multer';
import * as admin from 'firebase-admin';
import * as firebaseConfig from './mydicocrm.json';

const logger: Logger = new Logger('Main');
const port = process.env.NODE_SERVER_PORT || config.get('server.port');
const portWs = process.env.NODE_SERVER_PORT || config.get('server.ws.port');

const useJHipsterRegistry = config.get('eureka.client.enabled');

// const httpsOptions = {
//   key: fs.readFileSync(path.resolve(__dirname, './secrets/private-key.pem')),
//   cert: fs.readFileSync(path.resolve(__dirname, './secrets/public-certificate.pem')),
// };
const firebase_params = {
  type: firebaseConfig.type,
  projectId: firebaseConfig.project_id,
  privateKeyId: firebaseConfig.private_key_id,
  privateKey: firebaseConfig.private_key,
  clientEmail: firebaseConfig.client_email,
  clientId: firebaseConfig.client_id,
  authUri: firebaseConfig.auth_uri,
  tokenUri: firebaseConfig.token_uri,
  authProviderX509CertUrl: firebaseConfig.auth_provider_x509_cert_url,
  clientC509CertUrl: firebaseConfig.client_x509_cert_url
};

async function bootstrap(): Promise<void> {
  // loadCloudConfig();
  // registerAsEurekaService();

  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(
    {
      // https: httpsOptions
    }
  ));
  const fastifyInstance = app.getHttpAdapter().getInstance();
  fastifyInstance.decorate('routes', []);
  fastifyInstance.addHook('onRoute', routeOptions => {
    const { method, schema, url, logLevel, prefix, bodyLimit, handler } = routeOptions;
    if (
      !url.includes('json') &&
      !url.includes('png') &&
      !url.includes('html') &&
      !url.includes('js') &&
      !url.includes('svg') &&
      !url.includes('css') &&
      !url.includes('txt') &&
      !url.includes('gif') &&
      !url.includes('ico') &&
      !url.includes('jpg') &&
      !url.includes('swagger') &&
      !url.includes('docs') &&
      !url.includes('webapp') &&
      !url.includes('*')
    ) {
      const _method = Array.isArray(method) ? method : [method];
      const route = { methods: _method, path: url };
      fastifyInstance.routes.push(route);
    }
  });
  app.use(
    helmet({
      contentSecurityPolicy: false
    })
  );
  app.enableCors({
    exposedHeaders: 'X-Total-Count'
  });
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors): BadRequestException => new BadRequestException(errors)
    })
  );
  app.register(contentParser);
  app.register(compression, { encodings: ['gzip', 'deflate'] });
//   app.register(require('fastify-multipart'), {
//     limits: {
//       fieldNameSize: 100, // Max field name size in bytes
//       fieldSize: 100, // Max field value size in bytes
//       fields: 10, // Max number of non-file fields
//       fileSize: 1000000, // For multipart forms, the max file size in bytes
//       files: 1, // Max number of file fields
//       headerPairs: 2000 // Max number of header key=>value pairs
//     }
//   });
  // Initialize the firebase admin app
  admin.initializeApp({
    credential: admin.credential.cert(firebase_params),
  });

  const staticClientPath = path.join(__dirname, '../dist/classes/static');
  const staticFilePath = path.join(__dirname, '../uploads');
  if (fs.existsSync(staticClientPath)) {
    app.use(express.static(staticClientPath, { cacheControl: true }));
    logger.log(`Serving static client resources on ${staticClientPath}`);
  } else {
    logger.log('No client it has been found');
  }
  
  if (fs.existsSync(staticFilePath)) {
    app.use('/images', express.static(staticFilePath));
    logger.log(`Serving static file resources on ${staticFilePath}`);
  } else {
    mkdirSync(staticFilePath);
  }
  setupSwagger(app);
  // const sslapp = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter({
  //   https: httpsOptions
  // }));
  // await sslapp.listen(portWs, (err) => {
  //   logger.error(`${err}`);
  // })
  await app.listen(port, (err) => {
    logger.error(`${err}`);
  })

  logger.log(`Application listening on port ${port}`);

  // const permissionServices = app.get(PermissionService);
  // const permissionTypeServices = app.get(PermissionTypeService);
  // await permissionServices.clear();
  // await permissionTypeServices.clear();
  // const permissionList: Permission[] = [];
  // const permissionTypeList: PermissionType[] = [];

  // fastifyInstance.routes.forEach(element => {
  //     const length = element.path.split('/').length;
  //     const splitedEndpoint = element.path.split('/').splice(2, length - 1);
  //     let type = '';
  //     if (splitedEndpoint.length > 0) {
  //         type = splitedEndpoint[0];
  //     }
  //     if (type) {
  //         const desc = permissionDescriptionNormalize(splitedEndpoint, false);
  //         const perType: PermissionType = {
  //             name: type,
  //             description: `Quản lý ${permissionDescriptionNormalize(splitedEndpoint, true)}`,
  //             status:
  //       blackList.filter(value => type.includes(value)).length > 0 || type === 'reports'
  //           ? PermissionGroupStatus.DISABLED
  //           : PermissionGroupStatus.ACTIVE,
  //         };
  //         element.methods.forEach(method => {
  //             const foundedException = splitedEndpoint.filter(item => removeExceptional.includes(item));
  //             const per: Permission = {
  //                 action: method,
  //                 resource: element.path,
  //                 type,
  //                 typeName: `Quản lý ${resourceDesc[type] || ''}`,
  //                 status:
  //         blackList.filter(value => element.path.includes(value)).length > 0 ||
  //         blackListPermission.filter(value => element.path === value.url && method === value.method).length > 0
  //             ? PermissionStatus.NONEPUBLIC
  //             : PermissionStatus.PUBLIC,
  //                 description: `${foundedException.length > 0 ? '' : actionDesc[method]} ${desc}`,
  //             };
  //             permissionList.push(per);
  //             permissionTypeList.push(perType);
  //         });
  //     }
  // });
  // await permissionServices.saveMany(permissionList);
  // await permissionTypeServices.saveMany(
  //     Array.from(new Set(permissionTypeList.map(a => a.name))).map(name => permissionTypeList.find(a => a.name === name))
  // );
}

async function loadCloudConfig(): Promise<void> {
  if (useJHipsterRegistry) {
    const endpoint = config.get('cloud.config.uri') || 'http://admin:admin@localhost:8761/config';
    logger.log(`Loading cloud config from ${endpoint}`);

    const cloudConfig = await cloudConfigClient.load({
      context: process.env,
      endpoint,
      name: config.get('cloud.config.name'),
      profiles: config.get('cloud.config.profile') || ['prod']
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
          $: port,
          '@enabled': 'true'
        },
        vipAddress: config.get('ipAddress') || 'localhost',
        homePageUrl: `http://${config.get('ipAddress')}:${port}/`,
        dataCenterInfo: {
          '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
          name: 'MyOwn'
        }
      },
      eureka: {
        // eureka server host / port
        host: eurekaUrl.hostname || '127.0.0.1',
        port: eurekaUrl.port || 8761,
        servicePath: '/eureka/apps'
      },
      requestMiddleware: (requestOpts, done): any => {
        requestOpts.auth = {
          user: config.get('jhipster.registry.username') || 'admin',
          password: config.get('jhipster.registry.password') || 'admin'
        };
        done(requestOpts);
      }
    });
    client.logger.level('debug');
    client.start(error => logger.log(error || 'Eureka registration complete'));
  }
}

bootstrap();

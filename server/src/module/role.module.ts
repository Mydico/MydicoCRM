import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { Adapter, CachedEnforcer, Enforcer, newCachedEnforcer } from 'casbin';
import TypeORMAdapter from 'typeorm-adapter';
import { RoleService } from '../service/role.service';
import { ROLE_ENFORCER } from '../service/utils/role.constants';

@Global()
@Module({})
export class RoleModule {
  public static forRootAsync(dbConnectionOptions: any, casbinModelPath: string): DynamicModule {
    const casbinEnforcerProvider: Provider = {
      provide: ROLE_ENFORCER,
      useFactory: async () => {
        const adapter = await TypeORMAdapter.newAdapter(dbConnectionOptions);
        const enforcer = await newCachedEnforcer(casbinModelPath);
        await enforcer.initWithAdapter(casbinModelPath, (adapter as any) as Adapter);
        enforcer.enableAutoSave(true);
        return enforcer;
      }
    };
    return {
      exports: [casbinEnforcerProvider, RoleService],
      module: RoleModule,
      providers: [casbinEnforcerProvider, RoleService]
    };
  }
}

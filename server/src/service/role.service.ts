import { Inject, Injectable } from '@nestjs/common';
import { Enforcer, getDefaultFileSystem, setDefaultFileSystem } from 'casbin';
import { ROLE_ENFORCER } from './utils/role.constants';
import fs from 'fs';
@Injectable()
export class RoleService {
  // tslint:disable-next-line:no-empty
  constructor(@Inject(ROLE_ENFORCER) private readonly enforcer: Enforcer) {
    // const defaultFileSystem = getDefaultFileSystem();
    // console.log(defaultFileSystem);
  }

  public async reloadPolicy() {
    await this.enforcer.loadPolicy();
  }

  public async addPolicy(...params: string[]) {
    await this.enforcer.addPolicy(...params);
  }

  public async addPolicies(params: string[][]) {
    try {
      const isAdded = await this.enforcer.addPolicies(params);
      return {
        error: false,
        message: `is addded Policies: ${isAdded}`
      };
    } catch (e) {
      return {
        error: true,
        message: e.message
      };
    }
  }

  public async addGroupPolicy(...params: string[]) {
    await this.enforcer.addGroupingPolicy(...params);
  }

  public async removePolicy(...params: string[]) {
    await this.enforcer.removePolicy(...params);
  }

  public async removeGroupingPolicies(params: string[][]) {
    await this.enforcer.removeGroupingPolicies(params);
  }

  public async filterGroupingPolicies(index, groupPolicy) {
    const groupPolicyFounded = await this.enforcer.getFilteredGroupingPolicy(index, groupPolicy);
    return groupPolicyFounded;
  }

  public async filterPolicies(index, groupPolicy) {
    const groupPolicyFounded = await this.enforcer.getFilteredPolicy(index, groupPolicy);
    return groupPolicyFounded;
  }

  public async addGroupingPolicies(params: string[][]) {
    await this.enforcer.addGroupingPolicies(params);
  }

  public async removePolicies(gPermissionId: string) {
    await this.enforcer.removeFilteredPolicy(0, gPermissionId);
  }

  public async getPermissions(login: string) {
    const groupPolicy = await this.enforcer.getFilteredNamedGroupingPolicy('g', 1, login);
    const groupNestedPolicy = await Promise.all(
      groupPolicy.map(async gPer => await this.enforcer.getFilteredNamedGroupingPolicy('g', 1, gPer[0]))
    );
    const groupNestedPolicyReduced = groupNestedPolicy.reduce((prev, sum) => [...sum, ...prev], []);
    const combinedArr = [...groupPolicy, ...groupNestedPolicyReduced];
    const policy = await Promise.all(
      combinedArr.map(async groupPermission => await this.enforcer.getFilteredPolicy(0, groupPermission[0]))
    );
    let arrPermission = [];
    if (Array.isArray(policy)) {
      const arrPolicy = policy.reduce((prev, sum) => [...sum, ...prev], []);
      arrPermission = arrPolicy.map(policy => ({
        method: policy[2],
        entity: policy[1]
      }));
    }
    return Array.from(
      new Set(arrPermission.map(({ method, entity }) => arrPermission.find(a => a.method === method && a.entity === entity)))
    );
  }

  public async getGroupPermissionHasAssigned(groupPolicy: string) {
    const result = await this.enforcer.getFilteredGroupingPolicy(0, groupPolicy);
    return result;
  }

  public async removePoliciesWithParams(index: number, dependenciesPath: string) {
    try {
      const isRemoved = await this.enforcer.removeFilteredPolicy(index, dependenciesPath);
      return {
        error: false,
        message: `is removed Policies: ${isRemoved}`
      };
    } catch (e) {
      return {
        error: true,
        message: e.message
      };
    }
  }

  public async getPolicyForUser(userId: string) {
    return await this.enforcer.getPermissionsForUser(userId);
  }

  public async getPolicyForGroupPermission(gPermissionId: string) {
    return await this.enforcer.getFilteredPolicy(0, gPermissionId);
  }

  // TODO: edit this in adapter to make it query from database
  // the operation will look like `await this.enforcer.getAdapter().enforce()`
  public async checkPermission(...params: string[]) {
    return await this.enforcer.enforce(...params);
  }
}

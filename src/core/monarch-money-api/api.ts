
import {
  CommonBudgetDataQuery,
  GetJointPlanningDataQuery,
  CommonForceRefreshAccountsQuery,
  GetAccounts,
  ManageGetCategoryGroups
} from './query/query';

import {
  Account,
  AccountTypes,
  CategoryGroups,
  CommonBudgetData,
  JointPlanningData,
} from './model';

import { ApiBase } from './api-base';

export interface MonarchMoneyApi {
  getBudgetData(startDate: Date, endDate: Date): Promise<CommonBudgetData>;
  getPlanningData(startDate: Date, endDate: Date): Promise<JointPlanningData>;
  getAccounts(types: AccountTypes[] | null): Promise<Account[]>;
  getCategoryGroups(): Promise<CategoryGroups>;
  forceRefreshAccounts(): Promise<any>;
}

export class MonarchMoneyApiImpl extends ApiBase implements MonarchMoneyApi {

  async getBudgetData(startDate: Date, endDate: Date): Promise<CommonBudgetData> {

    const cacheKey = startDate;

    const result = await this.executeQuery<any>(
      'Common_BudgetDataQuery',
      {
        date: startDate.toISOString().slice(0, 10),
        endOfMonth: endDate.toISOString().slice(0, 10),
        cacheKey: cacheKey,
        useLegacyGoals: false,
        useV2Goals: true
      },
      CommonBudgetDataQuery
    );

    return result.data;
  }

  async getPlanningData(startDate: Date, endDate: Date): Promise<JointPlanningData> {

    const result = await this.executeQuery<any>(
      'GetJointPlanningData',
      {
        startDate: startDate.toISOString().slice(0, 10),
        endDate: endDate.toISOString().slice(0, 10),
        useLegacyGoals: false,
        useV2Goals: true
      },
      GetJointPlanningDataQuery
    );

    return result.data;
  }

  async getAccounts(types: AccountTypes[] | null): Promise<Account[]> {

    const result = await this.executeQuery<any>(
      'GetAccounts',
      {},
      GetAccounts
    );

    const accounts = result.data.accounts as Account[];

    if (types !== null) {
      return accounts.filter(x => types.includes(x.type.name as AccountTypes));
    }

    return result.data.accounts;
  }

  async getCategoryGroups(): Promise<CategoryGroups> {
    const result = await this.executeQuery<{ data: CategoryGroups }>(
      'ManageGetCategoryGroups',
      {},
      ManageGetCategoryGroups
    );

    return result.data;
  }

  async forceRefreshAccounts(): Promise<any> {

    const result = await this.executeQuery<any>(
      'Common_ForceRefreshAccountsQuery',
      {},
      CommonForceRefreshAccountsQuery
    );

    return result.data;
  }
}

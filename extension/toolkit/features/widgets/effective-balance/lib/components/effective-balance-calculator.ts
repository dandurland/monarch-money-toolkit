import type { AccountsData } from '@extension/monarch';

export interface EffectiveBalanceData {
  creditTotal: number;
  depositoryTotal: number;
}

export class EffectiveBalanceCalculator {
  getEffectiveBalance(data: AccountsData, accountIdsFilter: string[]): EffectiveBalanceData | null {
    if (!data) {
      return null;
    }

    let depositoryTotal = 0;
    let creditTotal = 0;

    data?.accounts?.forEach(account => {
      if (
        account.type.name === 'depository' &&
        (accountIdsFilter.length === 0 || accountIdsFilter.includes(account.id))
      ) {
        depositoryTotal += account.currentBalance;
      } else if (
        account.type.name === 'credit' &&
        (accountIdsFilter.length === 0 || accountIdsFilter.includes(account.id))
      ) {
        creditTotal += -account.currentBalance;
      }
    });

    return {
      creditTotal,
      depositoryTotal,
    };
  }
}

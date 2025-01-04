export enum RolloverType {
  monthly = 'monthly',
}

export enum CategoryGroupType {
  expense = 'expense',
  income = 'income',
  transfer = 'transfer',
}

export interface Category {
  readonly id: string;
  name: string;
  icon: string;
  isSystemCategory?: boolean;
  systemCategory?: string;
  isDisabled?: boolean;
  group?: CategoryGroup;
  rolloverPeriod?: RolloverPeriod;
}

export interface CategoryGroup {
  readonly id: string;
  type: CategoryGroupType;
  name: string;
  groupLevelBudgetingEnabled: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rolloverPeriod?: any;
  categories?: Category[];
}

export interface CategoryGroups {
  readonly categoryGroups: CategoryGroup[];
  readonly categories: Category[];
}

export interface RolloverPeriod {
  readonly id: string;
  type: RolloverType;
  startMonth: string;
  endMonth: string;
}

export type AccountTypes = 'depository' | 'credit';

export interface MonthlyAmounts {
  month: string;
  plannedCashFlowAmount: number;
  plannedSetAsideAmount: number;
  actualAmount: number;
  remainingAmount: number;
  previousMonthRolloverAmount?: number;
  rolloverType?: RolloverType;
}

export interface BudgetTotals {
  plannedAmount: number;
  actualAmount: number;
  remainingAmount: number;
  previousMonthRolloverAmount: number;
}

export interface TotalsByMonth {
  month: string;
  totalIncome: BudgetTotals;
  totalExpenses: BudgetTotals;
  totalFixedExpenses: BudgetTotals;
  totalNonMonthlyExpenses: BudgetTotals;
  totalFlexibleExpenses: BudgetTotals;
}

export interface MonthlyAmountsByCategory {
  category: Category;
  monthlyAmounts: MonthlyAmounts[];
}

export interface BudgetData {
  monthlyAmountsByCategory: MonthlyAmountsByCategory[];
  totalsByMonth: TotalsByMonth[];
}

export interface CommonBudgetData {
  budgetData: BudgetData;
}

/*export interface JointPlanningData {
  budgetData: BudgetData;
  categoryGroups: CategoryGroup[];
}*/

export interface AccountType {
  name: string;
}

export interface Account {
  id: string;
  displayName: string;
  icon: string;
  logoUrl: string;
  isAsset: boolean;
  displayBalance: number;
  currentBalance: number;
  type: AccountType;
}

export interface AccountTypeSummary {
  type: AccountType;
  accounts: Account[];
}

export interface Accounts {
  hasAccounts: boolean;
  accountTypeSummaries: AccountTypeSummary[];
}

export interface Attachment {
  id: string;
}

export interface Merchant {
  id: string;
  name: string;
  transactionCount: number;
  logoUrl: string;
  //recurringTransactionStream?: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  order: number;
}

export interface Transaction {
  id: string;
  amount: number;
  pending: true;
  date: string;
  hideFromReports: boolean;
  plaidName: string;
  notes: string;
  isRecurring: boolean;
  reviewStatus: string;
  needsReview: boolean;
  isSplitTransaction: boolean;
  dataProviderDescription: string;
  attachments: Attachment[];
  category: Category;
  merchant: Merchant;
  tags: Tag[];
  account: Account;
}

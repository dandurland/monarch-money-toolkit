
import { ApiBase } from "./api-base";
import { WebMoveMoneyMutation, CommonUpdateBudgetItemMutation } from "./query/query";

export enum TimeFrame {
  month
}

export interface IMonarchMoneyMutationApi {
  moveMoneyMutation(fromCategoryId: string, toCategoryId: string, amount: number, startDate: Date, timeFrame: TimeFrame): Promise<any>;
  updateBudgetItemMutation(categoryId: string, amount: number, startDate: Date, timeFrame: TimeFrame, applyToFuture: boolean): Promise<any>;
}

//@injectable()
export class MonarchMoneyMutationApi extends ApiBase implements IMonarchMoneyMutationApi {

  async moveMoneyMutation(fromCategoryId: string, toCategoryId: string, amount: number, startDate: Date, timeFrame: TimeFrame): Promise<any> {

    const variables = {
      input: {
        amount: amount,
        fromCategoryId: fromCategoryId,
        startDate: startDate.toISOString().slice(0, 10),
        timeframe: TimeFrame[timeFrame],
        toCategoryId: toCategoryId
      }
    }

    const result = await this.executeQuery<any>(
      'Web_MoveMoneyMutation',
      variables,
      WebMoveMoneyMutation
    );

    return result;
  }

  async updateBudgetItemMutation(categoryId: string, amount: number, startDate: Date, timeFrame: TimeFrame, applyToFuture: boolean): Promise<any> {
    const variables = {
      input: {
        amount: amount,
        categoryId: categoryId,
        startDate: startDate.toISOString().slice(0, 10),
        timeframe: TimeFrame[timeFrame],
        applyToFuture: applyToFuture
      }
    }

    const result = await this.executeQuery<any>(
      'Common_UpdateBudgetItem',
      variables,
      CommonUpdateBudgetItemMutation
    );

    return result;
  }
}
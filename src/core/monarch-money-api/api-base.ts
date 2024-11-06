
import { getMonarchAuthToken } from "toolkit/core/utilities/monarchSettings";

export abstract class ApiBase {

  protected graphql = 'https://api.monarchmoney.com/graphql';

  protected async createGraphQuery(data: any): Promise<any> {
    return {
      mode: 'cors',
      method: 'POST',
      headers: {
        accept: '*/*',
        authorization: `Token ${await getMonarchAuthToken()}`,
        'content-type': 'application/json',
        origin: 'https://app.monarchmoney.com',
      },
      body: JSON.stringify(data),
    };
  }

  protected async executeQuery<T>(operationName: string, variables: any, query: string): Promise<T> {

    try {
      const response = await fetch(this.graphql, await this.createGraphQuery({
        operationName: operationName,
        variables: variables,
        query: query,
      }));

      const result = await response.json();
      return result;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
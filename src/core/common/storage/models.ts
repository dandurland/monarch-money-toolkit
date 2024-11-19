export enum AuthStatus {
    NoToken = 'noToken',
    Success = 'success',
    Failure = 'failure',
  }

  export interface AuthInfo {
    token: string,
    lastAuth: Date, 
    status: AuthStatus
  }
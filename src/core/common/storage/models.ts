export enum AuthStatus {
    Pending = 'pending',
    NotLoggedIn = 'notLoggedIn',
    Success = 'success',
    Failure = 'failure',
  }

  export interface AuthInfo {
    token: string,
    lastAuth: Date, 
    status: AuthStatus
  }
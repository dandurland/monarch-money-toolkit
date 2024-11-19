import { ExtensionStorage } from "toolkit/core/common/storage";
import { AuthInfo, AuthStatus } from "toolkit/core/common/storage/models";

const AUTH_EXPIRATION = 1000 * 60 * 60 * 24 * 7; //7 days
const AUTH_INFO_KEY = 'auth-info';

export class AuthProvider {

  private storage = new ExtensionStorage();

  async getAuthInfo() : Promise<AuthInfo> {
    return this.storage.getItem(AUTH_INFO_KEY);
  }

  async updateAuthInfo(currentToken : string) : Promise<AuthStatus> {
    
    const authInfo = await this.storage.getItem(AUTH_INFO_KEY);
    const lastAuth = new Date(authInfo?.lastAuth ?? 0);

    if (authInfo?.token === currentToken
      && authInfo?.status === AuthStatus.Success
      && lastAuth >= new Date(Date.now() - AUTH_EXPIRATION)) {
      return AuthStatus.Success;
    }
 
    try {
      
      if (currentToken) {
        await this.storage.setItem(AUTH_INFO_KEY,
          {
            token: currentToken,
            lastAuth: Date.now(),
            status: AuthStatus.Success
          });

          return AuthStatus.Success;
      } 

      await this.storage.setItem(AUTH_INFO_KEY,
        {
          token: null,
          lastAuth: new Date(0),
          status: AuthStatus.NoToken
        });

        return AuthStatus.NoToken;
      
    } catch (e) {
      await this.storage.setItem(AUTH_INFO_KEY,
        {
          token: null,
          lastAuth: new Date(0),
          status: AuthStatus.Failure
        });

        return AuthStatus.Failure;
    }
  }
}

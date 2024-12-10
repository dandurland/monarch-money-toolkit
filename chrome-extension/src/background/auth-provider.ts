import { extensionSettingsStorage, AuthStatus } from '@extension/storage';

const AUTH_EXPIRATION = 1000 * 60 * 60 * 24 * 7; //7 days

export class AuthProvider {
  async updateAuthInfo(currentToken: string): Promise<AuthStatus> {
    const { monarchSettings } = await extensionSettingsStorage.get();
    const lastAuth = new Date(monarchSettings?.lastAuth ?? 0);

    if (
      monarchSettings?.token === currentToken &&
      monarchSettings?.status === AuthStatus.Success &&
      lastAuth >= new Date(Date.now() - AUTH_EXPIRATION)
    ) {
      return AuthStatus.Success;
    }

    try {
      if (currentToken) {
        await extensionSettingsStorage.patch({
          monarchSettings: {
            token: currentToken,
            lastAuth: Date.now(),
            status: AuthStatus.Success,
          },
        });

        return AuthStatus.Success;
      }

      await extensionSettingsStorage.patch({
        monarchSettings: {
          token: null,
          lastAuth: 0,
          status: AuthStatus.NoToken,
        },
      });

      return AuthStatus.NoToken;
    } catch (e) {
      await extensionSettingsStorage.patch({
        monarchSettings: {
          token: null,
          lastAuth: 0,
          status: AuthStatus.Failure,
        },
      });

      return AuthStatus.Failure;
    }
  }
}

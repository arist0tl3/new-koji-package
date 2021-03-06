/**
 * Note the method-specific note about requestGrants below
 */
import { KojiBridge } from '../bridge';
import { client } from '../@decorators/client';

export enum AuthGrantCapability {
  PUSH_NOTIFICATIONS = 'push_notifications',
  USERNAME = 'username',
}

export class Identity extends KojiBridge {
  /**
   * Get a token for the current user.
   * @returns {Promise} A user string token that can be exchanged on the server to identify the user. Returns null if the user is not logged in.
   */
  @client
  async getToken(): Promise<UserToken> {
    const { token } = await this.postToPlatform({
      name: '@@koji/auth/getToken',
      data: {
        grants: [],
        allowAnonymous: true,
      },
    }, 'KojiAuth.TokenCreated');

    return token;
  }

  async checkGrants(grants: AuthGrantCapability[] = []): Promise<boolean> {
    const { hasGrants } = await this.postToPlatform({
      name: '@@koji/auth/checkGrant',
      data: {
        grants,
      },
    }, 'KojiAuth.GrantsResolved');

    return hasGrants;
  }

  async requestGrants(grants: AuthGrantCapability[] = [], usageDescription?: string): Promise<UserToken> {
    const { hasGrants } = await this.postToPlatform({
      name: '@@koji/auth/getToken',
      data: {
        grants,
        usageDescription,
      },
    }, 'KojiAuth.TokenCreated'); // Would be great to have a method-specific message here

    return hasGrants;
  }
}

export const identity = new Identity();

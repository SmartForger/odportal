/**
 * @description Faciliates determining if the logged-in user has roles defined in an SSO client. Cannot be tested because it is tied to Keycloak.
 * @author Steven M. Redman
 */

import {AuthService} from '../services/auth.service';
import {ServiceLocator} from '../service-locator';
import {environment as env} from '../../environments/environment';

export class AppPermissionsBroker {

    private clientId: string;
    private authSvc: AuthService;

    constructor(clientId: string) {
        this.clientId = clientId;
        //When testing, the injector is undefined
        if (!env.testing) {
            this.authSvc = ServiceLocator.injector.get<AuthService>(AuthService);
        }
    }

    hasPermission(roleName: string): boolean {
        return this.authSvc.hasPermission(roleName, this.clientId);
    }

}
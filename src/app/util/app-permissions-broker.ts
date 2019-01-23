import {AuthService} from '../services/auth.service';
import {ServiceLocator} from '../service-locator';

export class AppPermissionsBroker {

    private clientId: string;
    private authSvc: AuthService;

    constructor(clientId: string) {
        this.clientId = clientId;
        this.authSvc = ServiceLocator.injector.get<AuthService>(AuthService);
    }

    hasPermission(roleName: string): boolean {
        return this.authSvc.hasPermission(roleName, this.clientId);
    }

}
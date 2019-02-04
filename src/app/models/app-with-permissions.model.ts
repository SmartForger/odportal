import {App} from './app.model';
import {Role} from './role.model';

export interface AppWithPermissions {

    app: App;
    permissions?: Array<Role>;

}
import {App} from '../../models/app.model';
import {Role} from '../../models/role.model';

export interface AppWithPermissions {

    app: App;
    permissions?: Array<Role>;

}
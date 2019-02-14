import {Role} from './role.model';

export interface RoleWithPermissions {

    role: Role;
    permissions?: Array<Role>;

}
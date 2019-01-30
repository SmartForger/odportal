export interface RoleRepresentation {

    name: string;
    id?: string;
    description: string;
    realmRoles: Array<string>;
    accountRoles: Array<string>;

}
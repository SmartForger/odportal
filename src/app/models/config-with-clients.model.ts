import {GlobalConfig} from './global-config.model';
import {Client} from './client.model';

export interface ConfigWithClients {

    config: GlobalConfig;
    appClients: Array<Client>;
    adminRoleId?: string;

}
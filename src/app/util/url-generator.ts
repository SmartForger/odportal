import {App} from '../models/app.model';

export class UrlGenerator {

    static generateAppResourceUrl(baseUrl: string, app: App, resource: string): string {
        let url: string = `apps/${app.vendorId}/${app.clientName}/${app.version}/${resource}`;
        url = url.replace(/\/\//g, "/");
        url = baseUrl + url;
        return url;
    }

}
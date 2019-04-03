/**
 * @description Utility class containing methods for generating various types of URLs
 * @author Steven M. Redman
 */

import {App} from '../models/app.model';

export class UrlGenerator {

    static generateAppResourceUrl(baseUrl: string, app: App, resource: string): string {
        let url: string = `apps/${app.vendorId}/${app.clientName}/${app.version}/${resource}`;
        url = url.replace(/(\/){2,}/g, "/");
        url = baseUrl + url;
        return url;
    }

}
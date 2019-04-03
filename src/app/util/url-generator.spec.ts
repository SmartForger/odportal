import {} from 'jasmine';

import {UrlGenerator} from '../util/url-generator';
import {App} from '../models/app.model';

describe('UrlGenerator', () => {

    it('should generate a properly formatted App resource URL', () => {
        const app: App = {
            appTitle: "Fake App",
            native: false,
            vendorId: "fake-vendor-id",
            clientId: "fake-client-id",
            version: "1.0.0",
            appBootstrap: "//fake-module.js",
            enabled: true,
            clientName: "fake-client-name"
        };
        let url: string = UrlGenerator.generateAppResourceUrl("https://mock-base-url/", app, app.appBootstrap);
        expect(url).toBe(`https://mock-base-url/apps/${app.vendorId}/${app.clientName}/${app.version}/fake-module.js`);
    });

});
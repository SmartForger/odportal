import * as uuid from 'uuid';
import {Subscription} from 'rxjs';
import {App} from '../../models/app.model';
import {UrlGenerator} from '../../util/url-generator';

export abstract class Renderer {

    containerId: string;

    protected script: any;
    protected customElem: any;
    protected isInitialized: boolean;
    protected userSessionSub: Subscription;

    constructor() {
        this.containerId = uuid.v4();
        this.isInitialized = false;
    }

    protected abstract attachHttpRequestListener(): void;

    protected abstract load(): void;

    protected abstract subscribeToUserSession(): void;

    protected destroy(): void {
        if (this.script) {
            this.script.remove();
        }
        if (this.customElem) {
            this.customElem.remove();
        }
    }

    protected setAttributeValue(name: string, value: string): void {
        if (this.customElem) {
            this.customElem.setAttribute(name, value);
        }
    }

    protected buildScriptTag(baseUrl: string, app: App, bootstrap: string): any {
        const scriptSrc: string = UrlGenerator.generateAppResourceUrl(baseUrl, app, bootstrap);
        let script = document.createElement('script');
        script.type = 'text/javascript';
        script.id = uuid.v4();
        script.src = scriptSrc;
        return script;
    }

    protected buildCustomElement(tag: string): any {
        let customEl = document.createElement(tag);
        customEl.id = uuid.v4();
        customEl.style.height = '100%';
        return customEl;
    }

}
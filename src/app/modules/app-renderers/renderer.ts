import * as uuid from 'uuid';
import {Input} from '@angular/core';
import {Subscription} from 'rxjs';
import {ApiRequest} from '../../models/api-request.model';

export abstract class Renderer {

    containerId: string;
    started: boolean;

    protected script: any;
    protected customElem: any;
    protected isInitialized: boolean;
    protected userSessionSub: Subscription;
    protected readonly HTTP_REQUEST_EVENT: string;

    @Input() previewMode: boolean;

    constructor() {
        this.containerId = uuid.v4();
        this.previewMode = false;
        this.started = false;
        this.isInitialized = false;
        this.HTTP_REQUEST_EVENT = "onHttpRequest";
    }

    start(): void {
        this.load();
        this.started = true;
    }

    stop(): void {
        this.destroy();
        this.started = false;
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
        this.started = false;
    }

    protected buildScriptTag(
        baseUri: string, 
        vendorId: string, 
        clientName: string, 
        version: string, 
        bootstrap: string): any {
        let script = document.createElement('script');
        script.type = 'text/javascript';
        script.id = uuid.v4();
        script.src = `${baseUri}apps/${vendorId}/${clientName}/${version}/${bootstrap}`;
        return script;
    }

    protected buildCustomElement(tag: string, userState: string): any {
        let customEl = document.createElement(tag);
        customEl.id = uuid.v4();
        customEl.setAttribute('user-state', userState);
        return customEl;
    }

}
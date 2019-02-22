import * as uuid from 'uuid';
import {Input} from '@angular/core';

export abstract class Renderer {

    containerId: string;
    started: boolean;

    protected script: any;
    protected customElem: any;
    protected isInitialized: boolean;

    @Input() previewMode: boolean;

    constructor() {
        this.containerId = uuid.v4();
        this.previewMode = false;
        this.started = false;
        this.isInitialized = false;
    }

    start(): void {
        this.load();
        this.started = true;
    }

    stop(): void {
        this.destroy();
        this.started = false;
    }

    protected abstract load(): void;

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

    protected buildCustomElement(tag: string): any {
        let customEl = document.createElement(tag);
        customEl.id = uuid.v4();
        return customEl;
    }

}
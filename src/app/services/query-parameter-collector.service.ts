import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class QueryParameterCollectorService {

    private queryMap: Map<string, string>;

    constructor() {
        this.queryMap = new Map<string, string>();
    }

    deleteParameter(key: string): boolean {
        if(this.queryMap.has(key)){
            this.queryMap.delete(key);
            return true;
        }
        else{
            return false;
        }
    }
    
    getParameter(key: string): string {
        return this.queryMap.get(key);
    }

    hasParameter(key: string): boolean {
        return this.queryMap.has(key);
    }

    output(): void {
        console.log(this.queryMap);
    }

    setParameter(key: string, value: string) {
        this.queryMap.set(key, value);
    }
}

import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
    HttpHandler,
    HttpEvent
} from '@angular/common/http';
import { Observable, Subscription, observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AjaxProgressService } from '../ajax-progress/ajax-progress.service';
import { AuthService } from '../services/auth.service';
import { GlobalConfig } from '../models/global-config.model';

@Injectable()
export class AjaxInterceptor implements HttpInterceptor {

    private forceZeroSubscription: Subscription;
    private routes: Set<string>;
    private totalRequests: number;
    private whitelist: RegExp;

    constructor(private ajaxProgSvc: AjaxProgressService, private authSvc: AuthService) {
        this.totalRequests = 0;
        this.forceZeroSubscription = ajaxProgSvc.subscribeToForceZeroRequests().subscribe(() => {
            this.totalRequests = 0;
            this.ajaxProgSvc.hide();
        });
        this.routes = new Set<string>();
        this.whitelist = null;
        this.authSvc.observeGlobalConfigUpdates().subscribe((config: GlobalConfig) => {
            if(config !== null){
                if(config.speedtestServiceConnection){
                    this.routes.add(config.speedtestServiceConnection);
                }
                if(config.mattermostProxyServiceConnection){
                    this.routes.add(config.mattermostProxyServiceConnection);
                }
                this.whitelist = new RegExp(Array.from(this.routes).join('|'), 'i');
            }
        });
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let showAjax = this.whitelist === null || !this.whitelist.test(req.url);

        if(showAjax){
            this.ajaxProgSvc.show(req.url);
            ++this.totalRequests;
        }
        return next.handle(req)
            .pipe(
                tap(
                    event => {
                        if (event instanceof HttpResponse) {
                            this.requestCompleted(showAjax);
                        }
                    },
                    error => {
                        this.ajaxProgSvc.hide();
                        this.requestCompleted(showAjax);
                    })
            );
    }

    private requestCompleted(showAjax: boolean): void {
        if(showAjax){
            if(this.totalRequests > 0){
                --this.totalRequests;
            }
            if (this.totalRequests === 0) {
                this.ajaxProgSvc.hide();
            }
        }
    }

}
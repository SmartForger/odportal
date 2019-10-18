import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
    HttpHandler,
    HttpEvent
} from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AjaxProgressService } from '../ajax-progress/ajax-progress.service';

@Injectable()
export class AjaxInterceptor implements HttpInterceptor {

    private totalRequests: number;
    private forceZeroSubscription: Subscription;
    constructor(private ajaxProgSvc: AjaxProgressService) {
        this.totalRequests = 0;
        this.forceZeroSubscription = ajaxProgSvc.subscribeToForceZeroRequests().subscribe(() => {
            this.totalRequests = 0;
            this.ajaxProgSvc.hide();
        });
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.ajaxProgSvc.show(req.url);
        ++this.totalRequests;
        return next.handle(req)
            .pipe(
                tap(
                    event => {
                        if (event instanceof HttpResponse) {
                            this.requestCompleted();
                        }
                    },
                    error => {
                        this.ajaxProgSvc.hide();
                        this.requestCompleted();
                    })
            );
    }

    private requestCompleted(): void {
        if(this.totalRequests > 0){
            --this.totalRequests;
        }
        if (this.totalRequests === 0) {
            this.ajaxProgSvc.hide();
        }
    }

}
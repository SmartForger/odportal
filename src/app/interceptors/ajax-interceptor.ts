import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
    HttpHandler,
    HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {AjaxProgressService} from '../ajax-progress/ajax-progress.service';

@Injectable()
export class AjaxInterceptor implements HttpInterceptor {

    private totalRequests: number;

    constructor(private ajaxProgSvc: AjaxProgressService) {
        this.totalRequests = 0;
        console.log("constructing: " + this.totalRequests);
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.ajaxProgSvc.show = true;
        ++this.totalRequests;
        console.log("request added: " + this.totalRequests);
        return next.handle(req)
            .pipe(
                tap(
                    event => {
                        if (event instanceof HttpResponse) {
                            this.requestCompleted();
                        }
                    },
                    error => {
                        this.ajaxProgSvc.show = false;
                        console.log(error.message);
                        this.requestCompleted();
                    })
            );
    }

    private requestCompleted(): void {
        --this.totalRequests;
        console.log("remaining requests: " + this.totalRequests);
        if (this.totalRequests === 0) {
            this.ajaxProgSvc.show = false;
        }
    }

}
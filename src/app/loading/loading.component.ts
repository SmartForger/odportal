import { Component, OnInit, OnDestroy } from '@angular/core';
import {Subscription} from 'rxjs';
import {NavigationStart, NavigationEnd, Router} from '@angular/router';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit, OnDestroy {

  private routeChangeSubject: Subscription;
  isLoading: boolean;

  constructor(private router: Router) { 
    this.isLoading = false;
  }

  ngOnInit() {
    this.subscribeToRouteEvents();
  }

  ngOnDestroy() {
    this.routeChangeSubject.unsubscribe();
  }

  private subscribeToRouteEvents(): void {
    this.routeChangeSubject = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.isLoading = true;
      }
      else if (event instanceof NavigationEnd) {
        this.isLoading = false;
      }
    });
  }

}

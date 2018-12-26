import { Component, OnInit, OnDestroy } from '@angular/core';
import {AjaxProgressService} from './ajax-progress.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-ajax-progress',
  templateUrl: './ajax-progress.component.html',
  styleUrls: ['./ajax-progress.component.scss']
})
export class AjaxProgressComponent implements OnInit, OnDestroy {

  sub: Subscription;
  show: boolean;

  constructor(private svc: AjaxProgressService) { 
    this.show = false;
  }

  ngOnInit() {
    this.subscribeToShow();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  private subscribeToShow(): void {
    this.sub = this.svc.showSubject.subscribe((show: boolean) => {
      this.show = show;
    });
  }

}

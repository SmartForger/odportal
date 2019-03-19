import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AppsService} from '../../../services/apps.service';
import {App} from '../../../models/app.model';
import {Widget} from '../../../models/widget.model';

@Component({
  selector: 'app-sandbox',
  templateUrl: './sandbox.component.html',
  styleUrls: ['./sandbox.component.scss']
})

export class SandboxComponent implements OnInit {

  app: App;

  constructor(
    private route: ActivatedRoute, 
    private appsSvc: AppsService) { }

  ngOnInit() {
    this.fetchApp();
  }

  private fetchApp(): void {
    this.appsSvc.fetch(this.route.snapshot.params['id']).subscribe(
      (app: App) => {
        this.app = app;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

}

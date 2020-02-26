import { Component, OnInit, Input } from '@angular/core';
import { App } from "src/app/models/app.model";
import { UrlGenerator } from "../../../util/url-generator";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: 'app-microapp-icon',
  templateUrl: './microapp-icon.component.html',
  styleUrls: ['./microapp-icon.component.scss']
})
export class MicroappIconComponent implements OnInit {
  @Input() app: App;
  @Input() size: string;

  constructor(private authSvc: AuthService) {
    this.app = {
      appTitle: "",
      enabled: false,
      native: false,
      clientId: "",
      clientName: ""
    };
    this.size = "default";
  }

  ngOnInit() {
  }

  generateResourceURL(app: App): string {
    return UrlGenerator.generateAppResourceUrl(
      this.authSvc.globalConfig.appsServiceConnection,
      app,
      app.appIcon
    );
  }
}

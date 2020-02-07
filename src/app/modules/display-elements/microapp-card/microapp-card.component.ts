import { Component, OnInit, Input } from "@angular/core";
import { App } from "src/app/models/app.model";
import { UrlGenerator } from "../../../util/url-generator";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-microapp-card",
  templateUrl: "./microapp-card.component.html",
  styleUrls: ["./microapp-card.component.scss"]
})
export class MicroappCardComponent implements OnInit {
  @Input() app: App;
  @Input() vendors: Object;

  constructor(private authSvc: AuthService) {
    this.app = {
      appTitle: "",
      enabled: false,
      native: false,
      clientId: "",
      clientName: ""
    };
    this.vendors = {};
  }

  ngOnInit() {}

  generateResourceURL(app: App): string {
    return UrlGenerator.generateAppResourceUrl(
      this.authSvc.globalConfig.appsServiceConnection,
      app,
      app.appIcon
    );
  }
}

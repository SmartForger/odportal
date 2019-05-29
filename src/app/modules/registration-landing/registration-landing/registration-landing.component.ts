import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-registration-landing",
  templateUrl: "./registration-landing.component.html",
  styleUrls: ["./registration-landing.component.scss"]
})
export class RegistrationLandingComponent implements OnInit {
  constructor(private authSvc: AuthService) {}

  ngOnInit() {}

  login() {
    this.authSvc.login();
  }
}

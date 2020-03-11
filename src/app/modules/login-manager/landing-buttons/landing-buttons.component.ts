import { Component, OnInit } from "@angular/core";
import { BasePanelComponent } from "../base-panel.component";
import { EnvironmentsServiceService } from "src/app/services/environments-service.service";

@Component({
  selector: "app-landing-buttons",
  templateUrl: "./landing-buttons.component.html",
  styleUrls: ["./landing-buttons.component.scss"]
})
export class LandingButtonsComponent extends BasePanelComponent
  implements OnInit {
  readonly colors = {
    "#04874D": "Green",
    "#CF7000": "Orange",
    "#B40000": "Red",
    "#0665BC": "Blue",
    "#711B81": "Purple"
  };
  readonly icons = {
    sim_card: "Smart card",
    how_to_reg: "User Login",
    person_add: "User registration"
  };

  constructor(protected envConfigSvc: EnvironmentsServiceService) {
    super(envConfigSvc);
  }

  ngOnInit() {
    if (!this.config.landingButtons || this.config.landingButtons.length !== 3) {
      this.config.landingButtons = [
        {
          type: "loginCAC",
          text: "Login with CAC",
          icon: "sim_card",
          color: "#711B81",
          link: "/"
        },
        {
          type: "loginUser",
          text: "Login with user",
          icon: "how_to_reg",
          color: "#04874D",
          link: "/"
        },
        {
          type: "register",
          text: "Register new user",
          icon: "person_add",
          color: "#0665BC",
          link: "/registration/overview"
        }
      ];
    }
  }

  deleteBtn(ev, btn) {
    ev.stopPropagation();
    this.environment.landingButtons = this.environment.landingButtons.filter(
      _btn => _btn !== btn
    );
  }

  get colorsArray() {
    return Object.keys(this.colors);
  }

  get iconsArray() {
    return Object.keys(this.icons);
  }
}

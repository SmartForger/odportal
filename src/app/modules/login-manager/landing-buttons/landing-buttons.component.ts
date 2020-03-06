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
  buttons = [];

  readonly colors = {
    "#04874D": "Green",
    "#CF7000": "Orange",
    "#B40000": "Red"
  };
  readonly icons = {
    sim_card: "Smart card",
    how_to_reg: "User Login",
    person_add: "User registration"
  };

  constructor(protected envConfigSvc: EnvironmentsServiceService) {
    super(envConfigSvc);
  }

  ngOnInit() {}

  addButton() {
    this.buttons.push({
      icon: "sim_card",
      text: "Button",
      color: "#04874D",
      link: "/"
    });
  }

  deleteBtn(ev, btn) {
    ev.stopPropagation();
    console.log('remove button');
    this.buttons = this.buttons.filter(_btn => _btn !== btn);
  }

  get colorsArray() {
    return Object.keys(this.colors);
  }

  get iconsArray() {
    return Object.keys(this.icons);
  }
}

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
    person_add: "User registration",
    help: "Support",
    language: "External",
    lock: "Secure"
  };
  readonly types = {
    "loginCAC": "Login with CAC",
    "loginUser": "Login with User",
    "linkInternal": "Internal Link",
    "linkExternal": "External Link"
  }

  constructor(protected envConfigSvc: EnvironmentsServiceService) {
    super(envConfigSvc);
  }

  ngOnInit() {
    if (!this.config.landingButtons) {
      this.config.landingButtons = [];
    }
  }

  deleteBtn(ev, btn) {
    ev.stopPropagation();
    this.environment.landingButtons = this.environment.landingButtons.filter(
      _btn => _btn !== btn
    );
  }

  toggleVisibility(ev, btn) {
    ev.stopPropagation();
    btn.visible = !btn.visible;
  }

  addButton() {
    this.environment.landingButtons.push({
      type: "loginCAC",
      text: "Button",
      icon: "sim_card",
      color: "#04874D",
      link: "/",
      visible: true
    },);
  }

  get colorsArray() {
    return Object.keys(this.colors);
  }

  get iconsArray() {
    return Object.keys(this.icons);
  }

  get typesArray() {
    return Object.keys(this.types);
  }
}

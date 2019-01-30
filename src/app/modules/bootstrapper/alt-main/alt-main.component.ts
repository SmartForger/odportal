import { Component, OnInit, ViewChild } from '@angular/core';
import {GlobalConfig} from '../../../models/global-config.model';
import {AltFinalizeComponent} from '../alt-finalize/alt-finalize.component';

declare var $: any;

@Component({
  selector: 'app-alt-main',
  templateUrl: './alt-main.component.html',
  styleUrls: ['./alt-main.component.scss']
})
export class AltMainComponent implements OnInit {

  @ViewChild(AltFinalizeComponent) finalizeComp: AltFinalizeComponent;

  constructor() { }

  ngOnInit() {
  }

  setRealmConfig(config: GlobalConfig): void {
    this.finalizeComp.realmConfig = config;
    console.log(config);
    $('#CoreServicesTab').tab('show');
  }

  setCoreServicesConfig(config: GlobalConfig): void {
    this.finalizeComp.coreServicesConfig = config;
    console.log(config);
    $('#FinalizeTab').tab('show');
  }

}

import { Input, EventEmitter, Output } from "@angular/core";
import { cloneDeep, isEmpty } from "lodash";

import { EnvConfig } from "src/app/models/EnvConfig.model";

export class BasePanelComponent {
  config: EnvConfig;
  originalConfig: EnvConfig;

  get environment() {
    return this.config;
  }
  @Input()
  set environment(config: EnvConfig) {
    if (!config) {
      return;
    }

    this.originalConfig = config;
    this.reset();
  }

  @Output() update: EventEmitter<any>;

  uploads: any = {};

  constructor() {
    this.update = new EventEmitter();
  }

  reset() {
    this.config = cloneDeep(this.originalConfig);
    this.uploads = {};
  }

  get modified() {
    return (
      !isEmpty(this.uploads) ||
      JSON.stringify(this.config) !== JSON.stringify(this.originalConfig)
    );
  }
}

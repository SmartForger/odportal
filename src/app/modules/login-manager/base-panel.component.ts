import { Input, EventEmitter, Output } from "@angular/core";
import { cloneDeep, isEmpty } from "lodash";

import { EnvConfig } from "src/app/models/EnvConfig.model";
import { EnvironmentsServiceService } from "src/app/services/environments-service.service";
import { map } from "rxjs/operators";
import { of } from "rxjs";

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

  constructor(protected envConfigSvc: EnvironmentsServiceService) {
    this.update = new EventEmitter();
  }

  reset() {
    this.config = cloneDeep(this.originalConfig);
    this.uploads = {};
  }

  handleFileUploads(keys) {
    const files = [];
    keys.forEach(key => {
      if (this.uploads[key]) {
        files.push({
          file: this.uploads[key],
          name: key + "." + this.getExt(this.uploads[key])
        });
      }
    });

    if (files.length === 0) {
      this.update.emit(this.config);
      return;
    }

    this.envConfigSvc.upload("files", files).subscribe((result: any) => {
      const fnames = Object.keys(result);
      fnames.forEach(fname => {
        const k = fname.split(".")[0];
        this.config[k] =
          this.envConfigSvc.getBasePath() + "uploads/" + result[fname];
      });

      this.update.emit(this.config);
    });
  }

  handleUpdate() {
    this.handleFileUploads([]);
  }

  get modified() {
    return (
      !isEmpty(this.uploads) ||
      JSON.stringify(this.config) !== JSON.stringify(this.originalConfig)
    );
  }

  private getExt(file: File) {
    return file.name.split(".")[1] || "";
  }
}

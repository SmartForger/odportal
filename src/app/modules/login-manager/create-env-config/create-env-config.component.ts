import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { PlatformModalType } from 'src/app/models/platform-modal.model';
import { EnvConfig } from 'src/app/models/EnvConfig.model';

@Component({
  selector: 'app-create-env-config',
  templateUrl: './create-env-config.component.html',
  styleUrls: ['./create-env-config.component.scss']
})
export class CreateEnvConfigComponent implements OnInit {
  config: EnvConfig = {
    name: "",
    ssoUrl: "",
    boundUrl: "",
    classification: "none"
  };

  readonly classifications = {
    "none": {
      label: "NONE",
      color: "#B5B5B5"
    },
    "unclassified": {
      label: "UNCLASSIFIED",
      color: "#3B8553"
    },
    "secret": {
      label: "SECRET",
      color: "#A52115"
    },
    "topsecret": {
      label: "TOP SECRET",
      color: "#C37429"
    }
  }

  constructor(
    private dlgRef: MatDialogRef<CreateEnvConfigComponent>
  ) {
    this.dlgRef.addPanelClass("platform-modal");
    this.dlgRef.addPanelClass(PlatformModalType.PRIMARY);
  }

  ngOnInit() {
  }

  createEnv() {
    this.dlgRef.close(this.config);
  }

  get classificationsArray() {
    return Object.keys(this.classifications);
  }
}

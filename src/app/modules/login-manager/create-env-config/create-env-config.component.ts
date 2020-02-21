import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { PlatformModalType } from 'src/app/models/platform-modal.model';

@Component({
  selector: 'app-create-env-config',
  templateUrl: './create-env-config.component.html',
  styleUrls: ['./create-env-config.component.scss']
})
export class CreateEnvConfigComponent implements OnInit {
  config: any = {
    environment: "",
    ssoUrl: "",
    rcsUrl: "",
    classification: "unclassified"
  };

  readonly classifications = {
    "unclassified": {
      label: "UNCLASSIFIED",
      color: "#04874D"
    },
    "secret": {
      label: "SECRET",
      color: "#CF7000"
    },
    "topsecret": {
      label: "TOP SECRET",
      color: "#B40000"
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

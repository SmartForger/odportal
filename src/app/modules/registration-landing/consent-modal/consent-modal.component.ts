import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { EnvConfig } from 'src/app/models/EnvConfig.model';

@Component({
  selector: 'app-consent-modal',
  templateUrl: './consent-modal.component.html',
  styleUrls: ['./consent-modal.component.scss']
})
export class ConsentModalComponent implements OnInit {

  constructor(
    private dlgRef: MatDialogRef<ConsentModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EnvConfig
  ) {
    this.dlgRef.addPanelClass('consent-modal');
  }

  ngOnInit() {
  }

  disagree() {
    localStorage.setItem('content_confirmed', "false");
    this.dlgRef.close('disagree');
  }

  agree() {
    const ts = new Date().getTime();
    localStorage.setItem('consent_confirmed', "true");
    localStorage.setItem('consent_closed', `${ts}`);
    this.dlgRef.close('agree');
  }
}

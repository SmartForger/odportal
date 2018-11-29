import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {FormControl, FormBuilder, Validators} from '@angular/forms';
import {CustomForm} from '../../../base-classes/custom-form';
import {UpdateConfig} from '../../../models/update-config.model';
import {ConnectionStatus} from '../../../util/constants';

@Component({
  selector: 'app-installer',
  templateUrl: './installer.component.html',
  styleUrls: ['./installer.component.scss']
})

export class InstallerComponent extends CustomForm implements OnInit {

  updateConfig: UpdateConfig;
  vendorsStatus: ConnectionStatus;
  rolesStatus: ConnectionStatus;
  usersStatus: ConnectionStatus;
  appsStatus: ConnectionStatus;
  widgetsStatus: ConnectionStatus;
  servicesStatus: ConnectionStatus;
  readonly connStatus;

  @Output() isRunning: EventEmitter<boolean>;

  constructor(private formBuilder: FormBuilder) { 
    super();
    this.isRunning = new EventEmitter<boolean>();
    this.vendorsStatus = ConnectionStatus.Pending;
    this.rolesStatus = ConnectionStatus.Pending;
    this.usersStatus = ConnectionStatus.Pending;
    this.appsStatus = ConnectionStatus.Pending;
    this.widgetsStatus = ConnectionStatus.Pending;
    this.servicesStatus = ConnectionStatus.Pending;
    this.connStatus = ConnectionStatus;
  }

  ngOnInit() {
    this.buildForm();
  }

  protected buildForm(): void {
    this.form = this.formBuilder.group({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

  submitForm(): void {
    this.isRunning.emit(true);
  }

}

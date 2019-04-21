import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';

import { RoleMapperComponent } from './role-mapper.component';
import {MatIconModule} from '@angular/material/icon';
import {MatChipsModule} from '@angular/material/chips';
import {MatDialogModule} from '@angular/material/dialog';
import {RolesService} from '../../../services/roles.service';
import {ClientsService} from '../../../services/clients.service';
import {AppsService} from '../../../services/apps.service';
import {RoleWithPermissions} from '../../../models/role-with-permissions.model';
import {Role} from '../../../models/role.model';
import {App} from '../../../models/app.model';

fdescribe('RoleMapperComponent', () => {
  let component: RoleMapperComponent;
  let fixture: ComponentFixture<RoleMapperComponent>;
  let rolesSvc: RolesService;
  let clientsSvc: ClientsService;
  let appsSvc: AppsService;

  const fakeRoles: Array<Role> = new Array<Role>(
    {
      id: "role-one-id",
      name: "Role One",
      description: "",
      containerId: null,
      composite: true,
      clientRole: false
    },
    {
      id: "role-two-id",
      name: "Role Two",
      description: "",
      containerId: null,
      composite: true,
      clientRole: false
    }
  );

  const fakeApp: App = {
    docId: "fake-app-id",
    appTitle: "Fake App",
    enabled: true,
    native: true,
    clientId: "fake-client-id",
    clientName: "fake-client-name",
    roles: [
      "role-one-id"
    ],
    externalPermissions: [
      {
        clientName: "test-client-name",
        clientId: "test-client",
        readPermission: "Read"
      }
    ]
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        RoleMapperComponent 
      ],
      imports: [
        MatIconModule,
        MatChipsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        MatDialogModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleMapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
});

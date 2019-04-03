import { TestBed, async } from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';

import { ClientsService } from './clients.service';
import {AuthService} from './auth.service';
import {Client} from '../models/client.model';
import {Role} from '../models/role.model';
import {KeyValue} from '../models/key-value.model';

describe('ClientsService', () => {
  let backend: HttpTestingController;
  let service: ClientsService;
  let authSvc: AuthService;

  const fakeClient: Client = {
    id: "fake-client-id",
    clientId: "fake-clientId",
    name: "fake client"
  };

  const fakeRole: Role = {
    id: "fake-role-id",
    name: "fake role",
    description: "fake role desc",
    containerId: "fake-client-id",
    composite: false,
    clientRole: true
  };

  const fakeClientId = "fake-client-id";

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        AuthService
      ]
    });

    backend = TestBed.get(HttpTestingController);
    service = TestBed.get(ClientsService);
    authSvc = TestBed.get(AuthService);
  });

  it('should be created', () => {
    const service: ClientsService = TestBed.get(ClientsService);
    expect(service).toBeTruthy();
  });

  it('should list all SSO clients', async(() => {
    service.list().subscribe(
      (clients: Array<Client>) => {
        expect(clients.length).toBe(1);
        expect(clients[0]).toEqual(fakeClient);
      }
    );
    const mockReq = backend.expectOne(`${authSvc.globalConfig.ssoConnection}auth/admin/realms/${authSvc.globalConfig.realm}/clients`);
    expect(mockReq.request.method).toBe('GET');
    mockReq.flush([fakeClient]);
    backend.verify();
  }));

  it('should list all roles for a client', async(() => {
    service.listRoles(fakeClientId).subscribe(
      (roles: Array<Role>) => {
        expect(roles.length).toBe(1);
        expect(roles[0]).toEqual(fakeRole);
      }
    );
    const mockReq = backend.expectOne(`${authSvc.globalConfig.ssoConnection}auth/admin/realms/${authSvc.globalConfig.realm}/clients/${fakeClientId}/roles`);
    expect(mockReq.request.method).toBe('GET');
    mockReq.flush([fakeRole]);
    backend.verify();
  }));

  it('should generate an array of KeyValue objects for each SSO client', async(() => {
    service.generateKeyValues().subscribe(
      (clients: Array<KeyValue>) => {
        expect(clients.length).toBe(1);
        expect(clients[0].display).toEqual(fakeClient.clientId);
        expect(clients[0].value).toEqual(fakeClient.id);
      }
    );
    const mockReq = backend.expectOne(`${authSvc.globalConfig.ssoConnection}auth/admin/realms/${authSvc.globalConfig.realm}/clients`);
    expect(mockReq.request.method).toBe('GET');
    mockReq.flush([fakeClient]);
    backend.verify();
  }));


});

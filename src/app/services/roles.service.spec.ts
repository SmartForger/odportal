import { TestBed, async } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { RolesService } from './roles.service';
import { Role } from '../models/role.model';
import { AuthService } from './auth.service';
import { UserProfile } from '../models/user-profile.model';
import { KeyValue } from '../models/key-value.model';

describe('RolesService', () => {
  let service: RolesService;
  let backend: HttpTestingController;
  let authSvc: AuthService;

  const fakeClientId: string = "fake-container-id";

  const fakeRole: Role = {
    id: "fake-role-id",
    name: "fake role",
    description: "fake role desc",
    composite: true,
    containerId: null,
    clientRole: false
  };

  const fakeComposites: Array<Role> = new Array<Role>(
    {
      id: "fake-comp-od",
      name: "fake composite role",
      description: "fake composite role desc",
      composite: false,
      containerId: fakeClientId,
      clientRole: true
    },
    {
      id: "fake-comp-od2",
      name: "fake composite role2",
      description: "fake composite role desc2",
      composite: false,
      containerId: fakeClientId,
      clientRole: true
    }
  );

  const fakeUser: UserProfile = {
    id: "fake-user-id",
    firstName: "Fake",
    lastName: "User",
    email: "fakeUser@test.com",
    username: "fuser"
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });

    service = TestBed.get(RolesService);
    backend = TestBed.get(HttpTestingController);
    authSvc = TestBed.get(AuthService);
  });

  it('should be created', () => {
    const service: RolesService = TestBed.get(RolesService);
    expect(service).toBeTruthy();
  });

  it('should list all realm-level roles', async(() => {
    service.list().subscribe(
      (roles: Array<Role>) => {
        expect(roles.length).toBe(1);
        expect(roles[0]).toEqual(fakeRole);
      }
    );
    const mockReq = backend.expectOne(`${authSvc.globalConfig.ssoConnection}auth/admin/realms/${authSvc.globalConfig.realm}/roles`);
    expect(mockReq.request.method).toBe('GET');
    mockReq.flush([fakeRole]);
    backend.verify();
  }));

  it('should fetch a role by name', async(() => {
    service.fetchByName(fakeRole.name).subscribe(
      (role: Role) => {
        expect(role).toEqual(fakeRole);
      }
    );
    const mockReq = backend.expectOne(`${authSvc.globalConfig.ssoConnection}auth/admin/realms/${authSvc.globalConfig.realm}/roles/${fakeRole.name}`);
    expect(mockReq.request.method).toBe('GET');
    mockReq.flush(fakeRole);
    backend.verify();
  }));

  it('should list client composites', async(() => {
    service.listClientComposites(fakeRole.id, fakeClientId).subscribe(
      (roles: Array<Role>) => {
        expect(roles).toEqual(fakeComposites);
      }
    );
    const mockReq = backend.expectOne(`${authSvc.globalConfig.ssoConnection}auth/admin/realms/${authSvc.globalConfig.realm}/roles-by-id/${fakeRole.id}/composites/clients/${fakeClientId}`);
    expect(mockReq.request.method).toBe('GET');
    mockReq.flush(fakeComposites);
    backend.verify();
  }));

  it('should list realm-level composites', async(() => {
    service.listRealmComposites(fakeRole.id).subscribe(
      (roles: Array<Role>) => {
        expect(roles).toEqual(fakeComposites);
      }
    );
    const mockReq = backend.expectOne(`${authSvc.globalConfig.ssoConnection}auth/admin/realms/${authSvc.globalConfig.realm}/roles-by-id/${fakeRole.id}/composites/realm`);
    expect(mockReq.request.method).toBe('GET');
    mockReq.flush(fakeComposites);
    backend.verify();
  }));

  it('should list users who are assigned the specified role', async(() => {
    service.listUsers(fakeRole.name).subscribe(
      (users: Array<UserProfile>) => {
        expect(users.length).toBe(1);
        expect(users[0]).toEqual(fakeUser);
      }
    );
    const mockReq = backend.expectOne(`${authSvc.globalConfig.ssoConnection}auth/admin/realms/${authSvc.globalConfig.realm}/roles/${fakeRole.name}/users`);
    expect(mockReq.request.method).toBe('GET');
    mockReq.flush([fakeUser]);
    backend.verify();
  }));

  it('should generate KeyValue models for all realm-level roles, excluding references to the Pending role', async(() => {
    service.generateKeyValues().subscribe(
      (kv: Array<KeyValue>) => {
        expect(kv.length).toBe(1);
        expect(kv[0].display).toBe(fakeRole.name);
        expect(kv[0].value).toBe(fakeRole.name);
      }
    );
    const mockReq = backend.expectOne(`${authSvc.globalConfig.ssoConnection}auth/admin/realms/${authSvc.globalConfig.realm}/roles`);
    expect(mockReq.request.method).toBe('GET');
    mockReq.flush([
      fakeRole,
      {
        id: "pending",
        name: "Pending",
        description: "pending desc",
        composite: false,
        containerId: null,
        clientRole: false
      }
    ]);
    backend.verify();
  }));

  it('should create a new role', async(() => {
    service.create(fakeRole).subscribe(
      (res: any) => {
        expect(res.message).toBe("Success");
      }
    );
    const mockReq = backend.expectOne(`${authSvc.globalConfig.ssoConnection}auth/admin/realms/${authSvc.globalConfig.realm}/roles`);
    expect(mockReq.request.method).toBe('POST');
    mockReq.flush({
      message: "Success"
    });
    backend.verify();
  }));

  it('should update a role', async(() => {
    service.update(fakeRole).subscribe(
      (res: any) => {
        expect(res.message).toBe("Success");
      }
    );
    const mockReq = backend.expectOne(`${authSvc.globalConfig.ssoConnection}auth/admin/realms/${authSvc.globalConfig.realm}/roles-by-id/${fakeRole.id}`);
    expect(mockReq.request.method).toBe('PUT');
    mockReq.flush({
      message: "Success"
    });
    backend.verify();
  }));

  it('should delete a role', async(() => {
    service.delete(fakeRole.id).subscribe(
      (res: any) => {
        expect(res.message).toBe("Success");
      }
    );
    const mockReq = backend.expectOne(`${authSvc.globalConfig.ssoConnection}auth/admin/realms/${authSvc.globalConfig.realm}/roles-by-id/${fakeRole.id}`);
    expect(mockReq.request.method).toBe('DELETE');
    mockReq.flush({
      message: "Success"
    });
    backend.verify();
  }));

  it('should delete composites from the role', async(() => {
    service.deleteComposites(fakeRole.id, fakeComposites).subscribe(
      (res: any) => {
        expect(res.message).toBe("Success");
      }
    );
    const mockReq = backend.expectOne(`${authSvc.globalConfig.ssoConnection}auth/admin/realms/${authSvc.globalConfig.realm}/roles-by-id/${fakeRole.id}/composites`);
    expect(mockReq.request.method).toBe('DELETE');
    mockReq.flush({
      message: "Success"
    });
    backend.verify();
  }));

  it('should add composites to the role', async(() => {
    service.addComposites(fakeRole.id, fakeComposites).subscribe(
      (res: any) => {
        expect(res.message).toBe("Success");
      }
    );
    const mockReq = backend.expectOne(`${authSvc.globalConfig.ssoConnection}auth/admin/realms/${authSvc.globalConfig.realm}/roles-by-id/${fakeRole.id}/composites`);
    expect(mockReq.request.method).toBe('POST');
    mockReq.flush({
      message: "Success"
    });
    backend.verify();
  }));

});

import { TestBed, async } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { Role } from '../models/role.model';
import {UserProfileKeycloak} from '../models/user-profile.model';
import { UserRepresentation } from '../models/user-representation.model';
import { CredentialsRepresentation } from '../models/credentials-representation.model';

describe('UsersService', () => {
  let service: UsersService;
  let authSvc: AuthService;
  let backend: HttpTestingController;

  const fakeUserId = "fake-user-id";

  const fakeRole: Role = {
    id: "fake-role-id",
    name: "fake role",
    description: "fake role desc",
    composite: true,
    containerId: null,
    clientRole: false
  };

  const fakeUser: UserProfileKeycloak = {
    id: fakeUserId,
    firstName: "Fake",
    lastName: "User",
    email: "fakeuser@test.com",
    username: "fakeuser"
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        AuthService
      ]
    });

    service = TestBed.get(UsersService);
    authSvc = TestBed.get(AuthService);
    backend = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    const service: UsersService = TestBed.get(UsersService);
    expect(service).toBeTruthy();
  });

  it('should list composite realm-level roles mapped to a user', async(() => {
    service.listComposites(fakeUserId).subscribe(
      (roles: Array<Role>) => {
        expect(roles.length).toBe(1);
        expect(roles[0]).toEqual(fakeRole);
      }
    );
    const mockReq = backend.expectOne(`${authSvc.globalConfig.ssoConnection}auth/admin/realms/${authSvc.globalConfig.realm}/users/${fakeUserId}/role-mappings/realm/composite`);
    expect(mockReq.request.method).toBe('GET');
    mockReq.flush([fakeRole]);
    backend.verify();
  }));

  it('should list realm-level roles assigned to a user', async(() => {
    service.listAssignedRoles(fakeUserId).subscribe(
      (roles: Array<Role>) => {
        expect(roles.length).toBe(1);
        expect(roles[0]).toEqual(fakeRole);
      }
    );
    const mockReq = backend.expectOne(`${authSvc.globalConfig.ssoConnection}auth/admin/realms/${authSvc.globalConfig.realm}/users/${fakeUserId}/role-mappings/realm`);
    expect(mockReq.request.method).toBe('GET');
    mockReq.flush([fakeRole]);
    backend.verify();
  }));

  it('should list roles that are not assigned to a user but are available', async(() => {
    service.listAvailableRoles(fakeUserId).subscribe(
      (roles: Array<Role>) => {
        expect(roles.length).toBe(1);
        expect(roles[0]).toEqual(fakeRole);
      }
    );
    const mockReq = backend.expectOne(`${authSvc.globalConfig.ssoConnection}auth/admin/realms/${authSvc.globalConfig.realm}/users/${fakeUserId}/role-mappings/realm/available`);
    expect(mockReq.request.method).toBe('GET');
    mockReq.flush([fakeRole]);
    backend.verify();  
  }));

  it('should list composite client-level roles mapped to a user', async(() => {
    const fakeClientId: string = "fake-client-id";
    service.listClientComposites(fakeUserId, fakeClientId).subscribe(
      (roles: Array<Role>) => {
        expect(roles.length).toBe(1);
        expect(roles[0]).toEqual(fakeRole);
      }
    );  
    const mockReq = backend.expectOne(`${authSvc.globalConfig.ssoConnection}auth/admin/realms/${authSvc.globalConfig.realm}/users/${fakeUserId}/role-mappings/clients/${fakeClientId}/composite`);
    expect(mockReq.request.method).toBe('GET');
    mockReq.flush([fakeRole]);
    backend.verify();  
  }));

  it('should list users according to search parameters', async(() => {
    service.listUsers({}).subscribe(
      (users: Array<UserProfileKeycloak>) => {
        expect(users.length).toBe(1);
        expect(users[0]).toEqual(fakeUser);
      }
    );
    const mockReq = backend.expectOne(`${authSvc.globalConfig.ssoConnection}auth/admin/realms/${authSvc.globalConfig.realm}/users`);
    expect(mockReq.request.method).toBe('GET');
    mockReq.flush([fakeUser]);
    backend.verify();
  }));

  it('should fetch a single user by id', async(() => {
    service.fetchById(fakeUserId).subscribe(
      (user: UserProfileKeycloak) => {
        expect(user).toEqual(fakeUser);
      }
    );
    const mockReq = backend.expectOne(`${authSvc.globalConfig.ssoConnection}auth/admin/realms/${authSvc.globalConfig.realm}/users/${fakeUserId}`);
    expect(mockReq.request.method).toBe('GET');
    mockReq.flush(fakeUser);
    backend.verify();
  }));

  it('should create a new user', async(() => {
    const fakeUserRep: UserRepresentation = {
      username: "fakeuser",
      firstName: "Fake",
      lastName: "User",
      email: "fakeuser@test.com",
      enabled: true
    };
    service.create(fakeUserRep).subscribe(
      (resp: any) => {
        expect(resp.message).toBe("Success");
      }
    );
    const mockReq = backend.expectOne(`${authSvc.globalConfig.ssoConnection}auth/admin/realms/${authSvc.globalConfig.realm}/users`);
    expect(mockReq.request.method).toBe('POST');
    mockReq.flush({
      message: "Success"
    });
    backend.verify();
  }));

  it('should update a user profile', async(() => {
    service.updateProfile(fakeUser).subscribe(
      (resp: any) => {
        expect(resp.message).toBe("Success");
      }
    );
    const mockReq = backend.expectOne(`${authSvc.globalConfig.ssoConnection}auth/admin/realms/${authSvc.globalConfig.realm}/users/${fakeUserId}`);
    expect(mockReq.request.method).toBe('PUT');
    mockReq.flush({
      message: "Success"
    });
    backend.verify();
  }));

  it('should update a user password', async(() => {
    const creds: CredentialsRepresentation = {
      type: "password",
      value: "newpassword",
      temporary: false
    };
    service.updatePassword(fakeUserId, creds).subscribe(
      (resp: any) => {
        expect(resp.message).toBe("Success");
      }
    );
    const mockReq = backend.expectOne(`${authSvc.globalConfig.ssoConnection}auth/admin/realms/${authSvc.globalConfig.realm}/users/${fakeUserId}/reset-password`);
    expect(mockReq.request.method).toBe('PUT');
    mockReq.flush({
      message: "Success"
    });
    backend.verify();
  }));  

  it('should delete a user', async(() => {
    service.delete(fakeUserId).subscribe(
      (resp: any) => {
        expect(resp.message).toBe("Success");
      }
    );
    const mockReq = backend.expectOne(`${authSvc.globalConfig.ssoConnection}auth/admin/realms/${authSvc.globalConfig.realm}/users/${fakeUserId}`);
    expect(mockReq.request.method).toBe('DELETE');
    mockReq.flush({
      message: "Success"
    });
    backend.verify();
  }));

  it('should delete realm-level role mappings from the user', async(() => {
    service.deleteComposites(fakeUserId, [fakeRole]).subscribe(
      (resp: any) => {
        expect(resp.message).toBe("Success");
      }
    );
    const mockReq = backend.expectOne(`${authSvc.globalConfig.ssoConnection}auth/admin/realms/${authSvc.globalConfig.realm}/users/${fakeUserId}/role-mappings/realm`);
    expect(mockReq.request.method).toBe('DELETE');
    mockReq.flush({
      message: "Success"
    });
    backend.verify();
  }));

  it('should add realm-level role mappings to the user', async(() => {
    service.addComposites(fakeUserId, [fakeRole]).subscribe(
      (resp: any) => {
        expect(resp.message).toBe("Success");
      }
    );
    const mockReq = backend.expectOne(`${authSvc.globalConfig.ssoConnection}auth/admin/realms/${authSvc.globalConfig.realm}/users/${fakeUserId}/role-mappings/realm`);
    expect(mockReq.request.method).toBe('POST');
    mockReq.flush({
      message: "Success"
    });
    backend.verify();
  }));

});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {By} from '@angular/platform-browser';

import { EditAppRoleMappingsComponent } from './edit-app-role-mappings.component';
import {MatChipsModule, MatChip} from '@angular/material/chips';
import {Role} from '../../../models/role.model';
import {RolesService} from '../../../services/roles.service';
import {ClientsService} from '../../../services/clients.service';
import {Observable} from 'rxjs';

describe('EditAppRoleMappingsComponent', () => {
  let component: EditAppRoleMappingsComponent;
  let fixture: ComponentFixture<EditAppRoleMappingsComponent>;
  let rolesSvc: RolesService;
  let clientsSvc: ClientsService;

  const fakeClientId: string = "fake-client-id";
  const fakeClientName: string = "fake-client";

  const fakeRealmRoles: Array<Role> = new Array<Role>(
    {
      id: "fake-role-id",
      name: "Fake Role",
      description: "Desc",
      containerId: null,
      composite: true,
      clientRole: false
    }
  );

  const fakeClientRoles: Array<Role> = new Array<Role>(
    {
      id: "fake-read",
      name: "Read",
      description: "Desc",
      containerId: fakeClientId,
      composite: false,
      clientRole: true
    },
    {
      id: "fake-create",
      name: "Create",
      description: "Desc",
      containerId: fakeClientId,
      composite: false,
      clientRole: true
    }
  );

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        EditAppRoleMappingsComponent 
      ],
      imports: [
        MatChipsModule,
        HttpClientTestingModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAppRoleMappingsComponent);
    component = fixture.componentInstance;
    rolesSvc = fixture.debugElement.injector.get(RolesService);
    clientsSvc = fixture.debugElement.injector.get(ClientsService);
    component.clientId = fakeClientId;
    component.clientName = fakeClientName;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should list app client roles for each realm role and highlight active composites in green and the non-active in red', async(() => {
    let realmRoleSpy = spyOn(rolesSvc, 'list').and.returnValue(new Observable(observer => {
      observer.next(fakeRealmRoles);
      observer.complete();
    }));
    let clientRoleSpy = spyOn(clientsSvc, 'listRoles').and.returnValue(new Observable(observer => {
      observer.next(fakeClientRoles);
      observer.complete();
    }));
    let clientCompSpy = spyOn(rolesSvc, 'listClientComposites').and.returnValue(new Observable(observer => {
      observer.next(new Array<Role>(fakeClientRoles[0]));
      observer.complete();
    }));
    component.ngOnInit();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(realmRoleSpy).toHaveBeenCalledTimes(1);
      expect(clientRoleSpy).toHaveBeenCalledTimes(1);
      expect(clientRoleSpy).toHaveBeenCalledWith(fakeClientId);
      expect(clientCompSpy).toHaveBeenCalledTimes(1);
      expect(clientCompSpy).toHaveBeenCalledWith(fakeRealmRoles[0].id, fakeClientId);
      expect(component.rwps.length).toBe(1);
      expect(component.rwps[0].permissions.length).toBe(2);
      expect(component.rwps[0].permissions[0].active).toBe(true);
      expect(component.rwps[0].permissions[1].active).toBe(false);
      let tds = fixture.debugElement.queryAll(By.css('td'));
      expect(tds[0].nativeElement.innerText).toBe(component.rwps[0].role.name);
      expect(tds[1].nativeElement.innerText).toBe(fakeClientName);
      let matChips = fixture.debugElement.queryAll(By.directive(MatChip));
      expect(matChips[0].nativeElement.classList.contains("bg-green")).toBe(true);
      expect(matChips[0].nativeElement.classList.contains("bg-red")).toBe(false);
      expect(matChips[0].nativeElement.innerText).toBe(fakeClientRoles[0].name);
      expect(matChips[1].nativeElement.classList.contains("bg-red")).toBe(true);
      expect(matChips[1].nativeElement.classList.contains("bg-green")).toBe(false);
      expect(matChips[1].nativeElement.innerText).toBe(fakeClientRoles[1].name);
    });
  }));

});

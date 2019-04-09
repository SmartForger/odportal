import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {By} from '@angular/platform-browser';

import { ClientRolesComponent } from './client-roles.component';
import {Role} from '../../../models/role.model';
import {ClientsService} from '../../../services/clients.service';
import {Observable} from 'rxjs';

describe('ClientRolesComponent', () => {
  let component: ClientRolesComponent;
  let fixture: ComponentFixture<ClientRolesComponent>;
  let clientsSvc: ClientsService;

  const fakeClientId: string = "fake-client-id";
  const fakeClientName: string = "fake client name";

  const fakeRoles: Array<Role> = new Array<Role>(
    {
      id: "fake-role-id",
      name: "Fake Role",
      description: "Desc",
      containerId: "fake-client-id",
      composite: false,
      clientRole: true
    }
  );

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        ClientRolesComponent 
      ],
      imports: [
        HttpClientTestingModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientRolesComponent);
    component = fixture.componentInstance;
    clientsSvc = fixture.debugElement.injector.get(ClientsService);
    component.clientId = fakeClientId;
    component.clientName = fakeClientName;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should list client roles', async(() => {
    expect(component.roles.length).toBe(0);
    let clientSpy = spyOn(clientsSvc, 'listRoles').and.returnValue(new Observable(observer => {
      observer.next(fakeRoles);
      observer.complete();
    }));
    component.ngOnInit();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(clientSpy).toHaveBeenCalledTimes(1);
      expect(clientSpy).toHaveBeenCalledWith(fakeClientId);
      let listItems = fixture.debugElement.queryAll(By.css('li'));
      expect(listItems.length).toBe(component.roles.length);
      expect(listItems[0].nativeElement.innerText).toBe("Fake Role");
    });
  }));

  it('should display the client name', () => {
    let h2 = fixture.debugElement.query(By.css('h2'));
    expect(h2.nativeElement.innerText).toBe(`${fakeClientName} Roles`);
  });
});

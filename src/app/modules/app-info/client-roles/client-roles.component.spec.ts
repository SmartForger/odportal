import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientRolesComponent } from './client-roles.component';

describe('ClientRolesComponent', () => {
  let component: ClientRolesComponent;
  let fixture: ComponentFixture<ClientRolesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientRolesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

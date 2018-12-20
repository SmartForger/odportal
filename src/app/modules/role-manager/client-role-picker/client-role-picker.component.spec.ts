import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientRolePickerComponent } from './client-role-picker.component';

describe('ClientRolePickerComponent', () => {
  let component: ClientRolePickerComponent;
  let fixture: ComponentFixture<ClientRolePickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientRolePickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientRolePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RealmRolePickerComponent } from './realm-role-picker.component';

describe('RealmRolePickerComponent', () => {
  let component: RealmRolePickerComponent;
  let fixture: ComponentFixture<RealmRolePickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RealmRolePickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RealmRolePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RealmRoleMapperComponent } from './realm-role-mapper.component';

describe('RealmRoleMapperComponent', () => {
  let component: RealmRoleMapperComponent;
  let fixture: ComponentFixture<RealmRoleMapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RealmRoleMapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RealmRoleMapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

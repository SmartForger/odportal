import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleBlockComponent } from './role-block.component';

describe('RoleBlockComponent', () => {
  let component: RoleBlockComponent;
  let fixture: ComponentFixture<RoleBlockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoleBlockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

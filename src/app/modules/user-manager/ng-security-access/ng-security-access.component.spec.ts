import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgSecurityAccessComponent } from './ng-security-access.component';

describe('NgSecurityAccessComponent', () => {
  let component: NgSecurityAccessComponent;
  let fixture: ComponentFixture<NgSecurityAccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgSecurityAccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgSecurityAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

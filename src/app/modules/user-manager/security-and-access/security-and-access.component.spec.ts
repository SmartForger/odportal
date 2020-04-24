import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityAndAccessComponent } from './security-and-access.component';

describe('SecurityAndAccessComponent', () => {
  let component: SecurityAndAccessComponent;
  let fixture: ComponentFixture<SecurityAndAccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecurityAndAccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityAndAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

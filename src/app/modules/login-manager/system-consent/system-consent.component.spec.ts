import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemConsentComponent } from './system-consent.component';

describe('SystemConsentComponent', () => {
  let component: SystemConsentComponent;
  let fixture: ComponentFixture<SystemConsentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemConsentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemConsentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

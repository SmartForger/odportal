import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SsoConfigFormComponent } from './sso-config-form.component';

describe('SsoConfigFormComponent', () => {
  let component: SsoConfigFormComponent;
  let fixture: ComponentFixture<SsoConfigFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SsoConfigFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SsoConfigFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

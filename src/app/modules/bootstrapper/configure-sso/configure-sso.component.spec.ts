import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureSsoComponent } from './configure-sso.component';

describe('ConfigureSsoComponent', () => {
  let component: ConfigureSsoComponent;
  let fixture: ComponentFixture<ConfigureSsoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigureSsoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigureSsoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

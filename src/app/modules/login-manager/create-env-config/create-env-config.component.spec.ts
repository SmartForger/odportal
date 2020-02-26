import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEnvConfigComponent } from './create-env-config.component';

describe('CreateEnvConfigComponent', () => {
  let component: CreateEnvConfigComponent;
  let fixture: ComponentFixture<CreateEnvConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateEnvConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEnvConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

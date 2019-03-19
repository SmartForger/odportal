import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SandboxApiCallListComponent } from './sandbox-api-call-list.component';

describe('SandboxApiCallListComponent', () => {
  let component: SandboxApiCallListComponent;
  let fixture: ComponentFixture<SandboxApiCallListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SandboxApiCallListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SandboxApiCallListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

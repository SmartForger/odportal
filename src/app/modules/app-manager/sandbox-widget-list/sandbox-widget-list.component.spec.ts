import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SandboxWidgetListComponent } from './sandbox-widget-list.component';

describe('SandboxWidgetListComponent', () => {
  let component: SandboxWidgetListComponent;
  let fixture: ComponentFixture<SandboxWidgetListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SandboxWidgetListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SandboxWidgetListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

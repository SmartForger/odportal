import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetWindowsComponent } from './widget-windows.component';

describe('WidgetWindowsComponent', () => {
  let component: WidgetWindowsComponent;
  let fixture: ComponentFixture<WidgetWindowsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetWindowsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetWindowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

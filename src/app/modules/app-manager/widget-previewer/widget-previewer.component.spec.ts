import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetPreviewerComponent } from './widget-previewer.component';

describe('WidgetPreviewerComponent', () => {
  let component: WidgetPreviewerComponent;
  let fixture: ComponentFixture<WidgetPreviewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetPreviewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetPreviewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

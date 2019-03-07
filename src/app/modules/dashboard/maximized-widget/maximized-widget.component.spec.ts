import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaximizedWidgetComponent } from './maximized-widget.component';

describe('MaximizedWidgetComponent', () => {
  let component: MaximizedWidgetComponent;
  let fixture: ComponentFixture<MaximizedWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaximizedWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaximizedWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetModalComponent } from './widget-modal.component';

describe('WidgetModalComponent', () => {
  let component: WidgetModalComponent;
  let fixture: ComponentFixture<WidgetModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

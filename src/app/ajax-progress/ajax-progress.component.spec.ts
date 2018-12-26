import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AjaxProgressComponent } from './ajax-progress.component';

describe('AjaxProgressComponent', () => {
  let component: AjaxProgressComponent;
  let fixture: ComponentFixture<AjaxProgressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AjaxProgressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AjaxProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

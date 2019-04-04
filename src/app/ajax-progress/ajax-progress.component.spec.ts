import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {By} from '@angular/platform-browser';

import { AjaxProgressComponent } from './ajax-progress.component';
import {MatProgressSpinnerModule, MatSpinner} from '@angular/material/progress-spinner';
import { AjaxProgressService } from './ajax-progress.service';

describe('AjaxProgressComponent', () => {
  let component: AjaxProgressComponent;
  let fixture: ComponentFixture<AjaxProgressComponent>;
  let ajaxProgressSvc: AjaxProgressService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        AjaxProgressComponent
      ],
      imports: [
        MatProgressSpinnerModule
      ],
      providers: [
        AjaxProgressService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AjaxProgressComponent);
    component = fixture.componentInstance;
    ajaxProgressSvc = fixture.debugElement.injector.get(AjaxProgressService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show and hide the progress spinner', async(() => {
    expect(component.show).toBe(false);
    let spy = spyOn(ajaxProgressSvc, 'observeShowProgress').and.callThrough();
    component.ngOnInit();
    ajaxProgressSvc.show("http://mock-api.com/");
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.show).toBe(true);
      expect(spy).toHaveBeenCalledTimes(1);
      let spinnerEl = fixture.debugElement.query(By.directive(MatSpinner));
      expect(spinnerEl).toBeTruthy();
      component.show = false;
      fixture.detectChanges();
      spinnerEl = fixture.debugElement.query(By.directive(MatSpinner));
      expect(spinnerEl).toBeNull();
    });
  }));
});

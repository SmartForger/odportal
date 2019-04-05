import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {By} from '@angular/platform-browser';

import { LoadingComponent } from './loading.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {Router, NavigationStart, NavigationEnd} from '@angular/router';
import {MatSpinner} from '@angular/material/progress-spinner';

class MockComponent {

}

describe('LoadingComponent', () => {
  let component: LoadingComponent;
  let fixture: ComponentFixture<LoadingComponent>;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        LoadingComponent 
      ],
      imports: [
        MatProgressSpinnerModule,
        RouterTestingModule.withRoutes([
          {
            path: 'portal',
            component: MockComponent
          }
        ])
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingComponent);
    component = fixture.componentInstance;
    router = fixture.debugElement.injector.get(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show loading spinner when changing routes and hide when navigation completes', async(() => {
    router.events.subscribe((event) => {
      fixture.detectChanges();
      let spinnerEl = fixture.debugElement.query(By.directive(MatSpinner));
      if (event instanceof NavigationStart) {
        expect(component.isLoading).toBe(true);
        expect(spinnerEl).toBeTruthy();
      }
      else if (event instanceof NavigationEnd) {
        expect(component.isLoading).toBe(false);
        expect(spinnerEl).toBeNull();
      }
    });
    router.navigateByUrl('/portal');
  }));
});

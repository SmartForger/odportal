import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedRequestsTabComponent } from './shared-requests-tab.component';

describe('CustomAttributesTabComponent', () => {
  let component: SharedRequestsTabComponent;
  let fixture: ComponentFixture<SharedRequestsTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedRequestsTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedRequestsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

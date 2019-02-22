import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAppInfoComponent } from './view-app-info.component';

describe('ViewAppInfoComponent', () => {
  let component: ViewAppInfoComponent;
  let fixture: ComponentFixture<ViewAppInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAppInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAppInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

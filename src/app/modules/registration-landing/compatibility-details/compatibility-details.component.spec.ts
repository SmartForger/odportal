import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompatibilityDetailsComponent } from './compatibility-details.component';

describe('CompatibilityDetailsComponent', () => {
  let component: CompatibilityDetailsComponent;
  let fixture: ComponentFixture<CompatibilityDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompatibilityDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompatibilityDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassificationBannerComponent } from './classification-banner.component';

describe('ClassificationBannerComponent', () => {
  let component: ClassificationBannerComponent;
  let fixture: ComponentFixture<ClassificationBannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassificationBannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassificationBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgAffiliationsComponent } from './ng-affiliations.component';

describe('NgAffiliationsComponent', () => {
  let component: NgAffiliationsComponent;
  let fixture: ComponentFixture<NgAffiliationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgAffiliationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgAffiliationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgPersonalInformationComponent } from './ng-personal-information.component';

describe('NgPersonalInformationComponent', () => {
  let component: NgPersonalInformationComponent;
  let fixture: ComponentFixture<NgPersonalInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgPersonalInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgPersonalInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

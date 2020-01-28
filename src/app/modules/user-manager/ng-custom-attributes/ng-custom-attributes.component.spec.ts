import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgCustomAttributesComponent } from './ng-custom-attributes.component';

describe('NgCustomAttributesComponent', () => {
  let component: NgCustomAttributesComponent;
  let fixture: ComponentFixture<NgCustomAttributesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgCustomAttributesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgCustomAttributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

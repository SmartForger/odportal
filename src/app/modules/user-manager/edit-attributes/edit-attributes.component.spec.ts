import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAttributesComponent } from './edit-attributes.component';

describe('EditAttributesComponent', () => {
  let component: EditAttributesComponent;
  let fixture: ComponentFixture<EditAttributesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAttributesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAttributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomAttributeFormComponent } from './custom-attribute-form.component';

describe('CustomAttributeFormComponent', () => {
  let component: CustomAttributeFormComponent;
  let fixture: ComponentFixture<CustomAttributeFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomAttributeFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomAttributeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

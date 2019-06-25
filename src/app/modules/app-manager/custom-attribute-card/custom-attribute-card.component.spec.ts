import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomAttributeCardComponent } from './custom-attribute-card.component';

describe('CustomAttributeCardComponent', () => {
  let component: CustomAttributeCardComponent;
  let fixture: ComponentFixture<CustomAttributeCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomAttributeCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomAttributeCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

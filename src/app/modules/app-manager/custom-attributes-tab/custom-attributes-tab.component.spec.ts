import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomAttributesTabComponent } from './custom-attributes-tab.component';

describe('CustomAttributesTabComponent', () => {
  let component: CustomAttributesTabComponent;
  let fixture: ComponentFixture<CustomAttributesTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomAttributesTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomAttributesTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

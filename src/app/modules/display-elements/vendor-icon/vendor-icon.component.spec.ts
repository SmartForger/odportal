import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorIconComponent } from './vendor-icon.component';

describe('VendorIconComponent', () => {
  let component: VendorIconComponent;
  let fixture: ComponentFixture<VendorIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLogoComponent } from './edit-logo.component';

describe('EditLogoComponent', () => {
  let component: EditLogoComponent;
  let fixture: ComponentFixture<EditLogoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditLogoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

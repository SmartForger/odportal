import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NativeAppInfoFormComponent } from './native-app-info-form.component';

describe('NativeAppInfoFormComponent', () => {
  let component: NativeAppInfoFormComponent;
  let fixture: ComponentFixture<NativeAppInfoFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NativeAppInfoFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NativeAppInfoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

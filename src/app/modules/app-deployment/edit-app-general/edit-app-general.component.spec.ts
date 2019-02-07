import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAppGeneralComponent } from './edit-app-general.component';

describe('EditAppGeneralComponent', () => {
  let component: EditAppGeneralComponent;
  let fixture: ComponentFixture<EditAppGeneralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAppGeneralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAppGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

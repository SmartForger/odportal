import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAppMainComponent } from './edit-app-main.component';

describe('EditAppMainComponent', () => {
  let component: EditAppMainComponent;
  let fixture: ComponentFixture<EditAppMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAppMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAppMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAppCommentsComponent } from './edit-app-comments.component';

describe('EditAppCommentsComponent', () => {
  let component: EditAppCommentsComponent;
  let fixture: ComponentFixture<EditAppCommentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAppCommentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAppCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

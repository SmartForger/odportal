import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAltEmailsComponent } from './edit-alt-emails.component';

describe('EditAltEmailsComponent', () => {
  let component: EditAltEmailsComponent;
  let fixture: ComponentFixture<EditAltEmailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAltEmailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAltEmailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

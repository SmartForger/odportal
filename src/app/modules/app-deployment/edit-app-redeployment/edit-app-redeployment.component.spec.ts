import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAppRedeploymentComponent } from './edit-app-redeployment.component';

describe('EditAppRedeploymentComponent', () => {
  let component: EditAppRedeploymentComponent;
  let fixture: ComponentFixture<EditAppRedeploymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAppRedeploymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAppRedeploymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

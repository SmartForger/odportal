import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgJiraSettingsComponent } from './ng-jira-settings.component';

describe('NgJiraSettingsComponent', () => {
  let component: NgJiraSettingsComponent;
  let fixture: ComponentFixture<NgJiraSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgJiraSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgJiraSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

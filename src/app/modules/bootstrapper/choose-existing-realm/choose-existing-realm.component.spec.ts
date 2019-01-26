import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseExistingRealmComponent } from './choose-existing-realm.component';

describe('ChooseExistingRealmComponent', () => {
  let component: ChooseExistingRealmComponent;
  let fixture: ComponentFixture<ChooseExistingRealmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseExistingRealmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseExistingRealmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

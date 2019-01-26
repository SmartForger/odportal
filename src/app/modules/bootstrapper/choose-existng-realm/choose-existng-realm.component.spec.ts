import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseExistngRealmComponent } from './choose-existng-realm.component';

describe('ChooseExistngRealmComponent', () => {
  let component: ChooseExistngRealmComponent;
  let fixture: ComponentFixture<ChooseExistngRealmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseExistngRealmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseExistngRealmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

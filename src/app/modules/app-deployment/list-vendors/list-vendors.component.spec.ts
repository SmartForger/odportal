import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {By} from '@angular/platform-browser';

import { ListVendorsComponent } from './list-vendors.component';
import { Vendor } from '../../../models/vendor.model';
import { VendorsService } from '../../../services/vendors.service';
import {BreadcrumbsService} from '../../display-elements/breadcrumbs.service';
import {Breadcrumb} from '../../display-elements/breadcrumb.model';
import { Observable } from 'rxjs';

describe('ListVendorsComponent', () => {
  let component: ListVendorsComponent;
  let fixture: ComponentFixture<ListVendorsComponent>;
  let vendorsSvc: VendorsService;
  let crumbsSvc: BreadcrumbsService;

  const fakeVendors: Array<Vendor> = new Array<Vendor>(
    {
      docId: "fake-vendor-id",
      name: "Fake Vendor",
      pocPhone: "555-555-5555",
      pocEmail: "fake@test.com",
      users: []
    }
  );

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ListVendorsComponent
      ],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListVendorsComponent);
    component = fixture.componentInstance;
    vendorsSvc = fixture.debugElement.injector.get(VendorsService);
    crumbsSvc = fixture.debugElement.injector.get(BreadcrumbsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should list vendors and generate breadcrumbs', async(() => {
    expect(component.vendors.length).toBe(0);
    let vendorsSpy = spyOn(vendorsSvc, 'listVendorsByUserId').and.returnValue(new Observable(observer => {
      observer.next(fakeVendors);
      observer.complete();
    }));
    let crumbsSpy = spyOn(crumbsSvc, 'update');
    component.ngOnInit();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.vendors.length).toBe(1);
      expect(vendorsSpy).toHaveBeenCalledTimes(1);
      let trs = fixture.debugElement.queryAll(By.css('tbody tr'));
      expect(trs.length).toBe(component.vendors.length);
      expect(crumbsSpy).toHaveBeenCalledTimes(1);
      expect(crumbsSpy).toHaveBeenCalledWith(new Array<Breadcrumb>(
        {
          title: "Dashboard",
          active: false,
          link: '/portal'
        },
        {
          title: "MicroApp Deployment",
          active: true,
          link: null
        }
      ));
    });
  }));
});

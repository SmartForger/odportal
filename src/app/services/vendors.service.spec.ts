import { TestBed, async } from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';

import { VendorsService } from './vendors.service';
import {AuthService} from './auth.service';
import {Vendor} from '../models/vendor.model';
import { HttpEventType } from '@angular/common/http';

describe('VendorsService', () => {

  let service: VendorsService;
  let authSvc: AuthService;
  let backend: HttpTestingController;

  const fakeUserId: string = "fake-user-id";
  const fakeVendorId: string = "fake-vendor-id";

  const fakeVendor: Vendor = {
    docId: fakeVendorId,
    name: "fake vendor",
    pocPhone: "555-555-5555",
    pocEmail: "fakevendor@test.com"
  };

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        AuthService
      ]
    });

    service = TestBed.get(VendorsService);
    authSvc = TestBed.get(AuthService);
    backend = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    const service: VendorsService = TestBed.get(VendorsService);
    expect(service).toBeTruthy();
  });

  it('should list vendors to which the user is assigned', async(() => {
    service.listVendorsByUserId(fakeUserId).subscribe(
      (vendors: Array<Vendor>) => {
        expect(vendors.length).toBe(1);
        expect(vendors[0]).toEqual(fakeVendor);
      }
    );
    const mockReq = backend.expectOne(`${authSvc.globalConfig.vendorsServiceConnection}api/v1/vendors/realm/${authSvc.globalConfig.realm}/user/${fakeUserId}`);
    expect(mockReq.request.method).toBe('GET');
    mockReq.flush([fakeVendor]);
    backend.verify();
  }));

  it('should list all vendors', async(() => {
    service.listVendors().subscribe(
      (vendors: Array<Vendor>) => {
        expect(vendors.length).toBe(1);
        expect(vendors[0]).toEqual(fakeVendor);
      }
    );
    const mockReq = backend.expectOne(`${authSvc.globalConfig.vendorsServiceConnection}api/v1/vendors/realm/${authSvc.globalConfig.realm}`);
    expect(mockReq.request.method).toBe('GET');
    mockReq.flush([fakeVendor]);
    backend.verify();
  }));

  it('should fetch a vendor by vendor id and user id', async(() => {
    service.fetchByUserAndVendorId(fakeUserId, fakeVendorId).subscribe(
      (vendor: Vendor) => {
        expect(vendor).toEqual(fakeVendor);
      }
    );
    const mockReq = backend.expectOne(`${authSvc.globalConfig.vendorsServiceConnection}api/v1/vendors/realm/${authSvc.globalConfig.realm}/vendor/${fakeVendorId}/user/${fakeUserId}`);
    expect(mockReq.request.method).toBe('GET');
    mockReq.flush(fakeVendor);
    backend.verify();
  }));

  it('should fetch a vendor by id', async(() => {
    service.fetchById(fakeVendorId).subscribe(
      (vendor: Vendor) => {
        expect(vendor).toEqual(fakeVendor);
      }
    );
    const mockReq = backend.expectOne(`${authSvc.globalConfig.vendorsServiceConnection}api/v1/vendors/realm/${authSvc.globalConfig.realm}/vendor/${fakeVendorId}`);
    expect(mockReq.request.method).toBe('GET');
    mockReq.flush(fakeVendor);
    backend.verify();
  }));

  it('should create and return the new vendor', async(() => {
    service.createVendor(fakeVendor).subscribe(
      (vendor: Vendor) => {
        expect(vendor).toEqual(fakeVendor);
      }
    );
    const mockReq = backend.expectOne(`${authSvc.globalConfig.vendorsServiceConnection}api/v1/vendors/realm/${authSvc.globalConfig.realm}`);
    expect(mockReq.request.method).toBe('POST');
    mockReq.flush(fakeVendor);
    backend.verify();
  }));  

  it('should update and return the updated vendor', async(() => {
    service.updateVendor(fakeVendor).subscribe(
      (vendor: Vendor) => {
        expect(vendor).toEqual(fakeVendor);
      }
    );
    const mockReq = backend.expectOne(`${authSvc.globalConfig.vendorsServiceConnection}api/v1/vendors/realm/${authSvc.globalConfig.realm}/vendor/${fakeVendorId}`);
    expect(mockReq.request.method).toBe('PUT');
    mockReq.flush(fakeVendor);
    backend.verify();
  }));

  it('should update the vendor logo and return the updated vendor', async(() => {
    let file: File = new File([], "fake-logo.png");
    service.updateVendorLogo(fakeVendorId, file).subscribe(
      (event) => {
        if (event.type === HttpEventType.Response) {
          expect(event.body).toEqual(fakeVendor);
        }
      }
    );
    const mockReq = backend.expectOne(`${authSvc.globalConfig.vendorsServiceConnection}api/v1/vendors/realm/${authSvc.globalConfig.realm}/vendor/${fakeVendorId}/logo`);
    expect(mockReq.request.method).toBe('POST');
    mockReq.flush(fakeVendor);
    backend.verify();
  }));

  it('should delete a vendor and return the deleted vendor', async(() => {
    service.deleteVendor(fakeVendorId).subscribe(
      (vendor: Vendor) => {
        expect(vendor).toEqual(fakeVendor);
      }
    );
    const mockReq = backend.expectOne(`${authSvc.globalConfig.vendorsServiceConnection}api/v1/vendors/realm/${authSvc.globalConfig.realm}/vendor/${fakeVendorId}`);
    expect(mockReq.request.method).toBe('DELETE');
    mockReq.flush(fakeVendor);
    backend.verify();
  }));

});

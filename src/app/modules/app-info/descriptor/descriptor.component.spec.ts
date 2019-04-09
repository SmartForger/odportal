import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { DescriptorComponent } from './descriptor.component';
import { MatIconModule, MatIcon } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { App } from '../../../models/app.model';
import { ExternalPermission } from '../../../models/external-permission.model';
import { ApiCallDescriptor } from '../../../models/api-call-descriptor.model';

describe('DescriptorComponent', () => {
  let component: DescriptorComponent;
  let fixture: ComponentFixture<DescriptorComponent>;

  let fakeApp: App = {
    docId: "fake-app-id",
    appTitle: "Fake App",
    enabled: true,
    native: false,
    clientId: "fake-client-id",
    clientName: "fake-client",
    externalPermissions: new Array<ExternalPermission>(
      {
        clientName: "client-name",
        clientId: "client-id",
        readPermission: "Read"
      }
    ),
    apiCalls: new Array<ApiCallDescriptor>(
      {
        verb: "GET",
        url: "https://mock-sso/random/path"
      },
      {
        verb: "POST",
        url: "https://mock-sso/random/path"
      },
      {
        verb: "POST",
        url: "http://fake-api.com/random/path"
      }
    )
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DescriptorComponent
      ],
      imports: [
        MatIconModule,
        MatCardModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DescriptorComponent);
    component = fixture.componentInstance;
    component.app = fakeApp;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show non-native app descriptors if the app is not native', async(() => {
    component.ngOnInit();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      let descEl = fixture.debugElement.query(By.css('.test-non-native-descriptor'));
      let epEl = fixture.debugElement.query(By.css('.test-ep'));
      let apiEl = fixture.debugElement.query(By.css('.test-api'));
      expect(descEl).toBeTruthy();
      expect(epEl).toBeTruthy();
      expect(apiEl).toBeTruthy();
      let nativeDescEl = fixture.debugElement.query(By.css('.test-native-descriptor'));
      expect(nativeDescEl).toBeNull();
    });
  }));

  it('should list all declared external permission if the app is not native', async() => {
    component.ngOnInit();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.app.externalPermissions.length).toBe(1);
      let trs = fixture.debugElement.queryAll(By.css('.test-ep tbody tr'));
      expect(trs.length).toBe(component.app.externalPermissions.length);
    });
  });

  it('should list all declared API calls if the app is not native and mark the calls that require trusted permissions', async(() => {
    component.ngOnInit();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.app.apiCalls.length).toBe(3);
      let trs = fixture.debugElement.queryAll(By.css('.test-api tbody tr'));
      expect(trs.length).toBe(component.app.apiCalls.length);
      expect(component.app.apiCalls[0].requiresTrusted).toBe(false);
      let trustedIcon = trs[0].query(By.directive(MatIcon));
      expect(trustedIcon).toBeNull();
      expect(component.app.apiCalls[1].requiresTrusted).toBe(true);
      trustedIcon = trs[1].query(By.directive(MatIcon));
      expect(trustedIcon).toBeTruthy();
      expect(component.app.apiCalls[2].requiresTrusted).toBe(false);
      trustedIcon = trs[2].query(By.directive(MatIcon));
      expect(trustedIcon).toBeNull();
    });
  }));

  it('should show native app descriptors if the app is native', async(() => {
    component.app.native = true;
    component.ngOnInit();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      let descEl = fixture.debugElement.query(By.css('.test-non-native-descriptor'));
      let epEl = fixture.debugElement.query(By.css('.test-ep'));
      let apiEl = fixture.debugElement.query(By.css('.test-api'));
      expect(descEl).toBeNull();
      expect(epEl).toBeNull();
      expect(apiEl).toBeNull();
      let nativeDescEl = fixture.debugElement.query(By.css('.test-native-descriptor'));
      expect(nativeDescEl).toBeTruthy();
    });
  }));
});

import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { AuthService } from "./auth.service";
import { ApiSearchCriteria } from "../models/api-search-criteria.model";
import { EnvConfig } from "../models/EnvConfig.model";

@Injectable({
  providedIn: "root"
})
export class EnvironmentsServiceService {
  constructor(private http: HttpClient, private authSvc: AuthService) {}

  getList(search: ApiSearchCriteria) {
    return this.http.get(this.createBaseAPIUrl(), {
      params: search.asHttpParams(),
      headers: this.authSvc.getAuthorizationHeader()
    });
  }

  create(config: EnvConfig) {
    return this.http.post(this.createBaseAPIUrl(), config, {
      headers: this.authSvc.getAuthorizationHeader()
    });
  }

  get(id: string) {
    return this.http.get(`${this.createBaseAPIUrl()}/${id}`, {
      headers: this.authSvc.getAuthorizationHeader()
    });
  }

  update(config: EnvConfig) {
    return this.http.put(`${this.createBaseAPIUrl()}/${config.docId}`, config, {
      headers: this.authSvc.getAuthorizationHeader()
    });
  }

  delete(id: string) {
    return this.http.delete(`${this.createBaseAPIUrl()}/${id}`, {
      headers: this.authSvc.getAuthorizationHeader()
    });
  }

  upload(field: string, files: any[]) {
    let formData: FormData = new FormData();
    files.forEach(obj => {
      formData.append(field, obj.file, obj.name);
    });

    return this.http.post(`${this.createBaseAPIUrl()}/upload`, formData, {
      headers: {
        Accept: "application/json"
      }
    });
  }

  getBasePath(): string {
    return this.authSvc.globalConfig.appsServiceConnection.replace(
      "/apps-service",
      "/env-config-service"
    );
  }

  getLandingConfig(boundUrl: string) {
    let headers = new HttpHeaders();
    headers = headers.append("x-bound-url", boundUrl);

    return this.http.get(`${this.getBasePath()}api/v1/landing`, {
      headers
    });
  }

  setKeycloakForgotPassword(enable: boolean) {
    return this.http.post(
      `${this.getBasePath()}api/v1/realms/${this.authSvc.globalConfig.realm}/allowResetPassword`,
      {
        isAllowed: enable
      }
    );
  }

  private createBaseAPIUrl(): string {
    return `${this.getBasePath()}api/v1/realms/${
      this.authSvc.globalConfig.realm
    }/env-configs`;
  }
}

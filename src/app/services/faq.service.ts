import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { AuthService } from "./auth.service";
import { ApiSearchCriteria } from "../models/api-search-criteria.model";
import { FAQModel } from "../models/faq.model";

@Injectable({
  providedIn: 'root'
})
export class FaqService {
  private faqClient: string = 'login-manager';

  constructor(private http: HttpClient, private authSvc: AuthService) { }

  setClient(client: string) {
    this.faqClient = client;
  }

  getFAQs() {
    return this.http.get(`${this.getBaseURL()}/faqs`, {
      headers: this.authSvc.getAuthorizationHeader()
    });
  }

  createFAQ(faq: FAQModel) {
    faq.category = 'login-manager';
    faq.publisherId = this.authSvc.userState.userId;
    faq.publisherName = `${this.authSvc.userState.userProfile.firstName} ${this.authSvc.userState.userProfile.lastName}`;

    return this.http.post(`${this.getBaseURL()}/faqs`, faq, {
      headers: this.authSvc.getAuthorizationHeader()
    });
  }

  updateFAQ(faq: FAQModel) {
    return this.http.put(`${this.getBaseURL()}/faqs/${faq.docId}`, faq, {
      headers: this.authSvc.getAuthorizationHeader()
    });
  }

  deleteFAQ(faqId: string) {
    return this.http.delete(`${this.getBaseURL()}/faqs/${faqId}`, {
      headers: this.authSvc.getAuthorizationHeader()
    });
  }

  private getBaseURL(): string {
    return `${this.authSvc.globalConfig.appsServiceConnection.replace(
      "/apps-service",
      "/faq-service"
    )}api/v1/realms/${this.authSvc.globalConfig.realm}/${this.faqClient}`;
  }
}

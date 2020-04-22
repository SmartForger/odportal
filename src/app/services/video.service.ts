import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { AuthService } from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  constructor(private http: HttpClient, private authSvc: AuthService) { }

  getVideos() {
    return this.http.get(`${this.getBaseURL()}/videos`, {
      headers: {
        authorization: `Bearer ${this.authSvc.getAccessToken()}`
      }
    });
  }

  uploadVideo(data) {
    const formData = new FormData();

    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('keywords', data.keywords);
    formData.append('creatorId', this.authSvc.userState.userId);
    formData.append('creatorName', this.authSvc.userState.userProfile.firstName + ' ' + this.authSvc.userState.userProfile.lastName);
    formData.append('video', data.video);

    return this.http.post(`${this.getBaseURL()}/videos/upload`, formData, {
      headers: {
        authorization: `Bearer ${this.authSvc.getAccessToken()}`
      }
    });
  }

  updateVideo(data) {
    const formData = new FormData();

    this.setFormData(formData, data, 'name');
    this.setFormData(formData, data, 'description');
    this.setFormData(formData, data, 'status');
    this.setFormData(formData, data, 'keywords');
    this.setFormData(formData, data, 'video');

    return this.http.put(`${this.getBaseURL()}/videos/${data.docId}`, formData, {
      headers: {
        authorization: `Bearer ${this.authSvc.getAccessToken()}`
      }
    });
  }

  deleteVideo(videoId) {
    return this.http.delete(`${this.getBaseURL()}/videos/${videoId}`, {
      headers: {
        authorization: `Bearer ${this.authSvc.getAccessToken()}`
      }
    });
  }

  getUploadPath(): string {
    return `${this.authSvc.globalConfig.appsServiceConnection.replace(
      "/apps-service",
      "/video-service"
    )}upload`;
  }

  private getBaseURL(): string {
    return `${this.authSvc.globalConfig.appsServiceConnection.replace(
      "/apps-service",
      "/video-service"
    )}api/v1/realms/${this.authSvc.globalConfig.realm}`;
  }

  private setFormData(formData, data, key) {
    if (data[key]) {
      formData.append(key, data[key]);
    }
  }
}

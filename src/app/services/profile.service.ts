import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({ providedIn: 'root' })
export class ProfileService {

  private baseUrl = environment.profileUrl;

  constructor(private http: HttpClient) {}

  getUserProfile() {
    return this.http.get<{medicalProfile: any, qrCode: any}>(`${this.baseUrl}/getUserProfile`)
  }
}

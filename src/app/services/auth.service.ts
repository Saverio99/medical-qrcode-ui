import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService{

  private baseUrl = environment.authUrl;

  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    return this.http.post(`${this.baseUrl}/login`, { username, password });
  }

  register(username: string, password: string) {
    return this.http.post(`${this.baseUrl}/register`, { username, password });
  }

  logout() {
    localStorage.removeItem("jwt");
  }

  getToken() {
    return localStorage.getItem('jwt');
  }

  isLoggedIn() {
    return this.getToken() !== null;
  }
}

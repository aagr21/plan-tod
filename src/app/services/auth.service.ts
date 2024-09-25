import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '@environments/environment.prod';
import { SignInRequest, SignInResponse } from '@models/interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  
  jwtHelperService = inject(JwtHelperService);
  http = inject(HttpClient);

  signIn(signInRequest: SignInRequest) {
    return this.http.post<SignInResponse>(
      `${environment.apiBaseUrl}/auth/sign-in`,
      signInRequest
    );
  }

  signOut() {
    this.removeToken();
  }

  getToken() {
    return localStorage.getItem('jwt_plan_tod');
  }

  saveToken(token: string) {
    localStorage.setItem('jwt_plan_tod', token);
  }

  removeToken() {
    localStorage.removeItem('jwt_plan_tod');
  }

  isTokenExpired() {
    return this.jwtHelperService.isTokenExpired();
  }

  decodeToken(token: string) {
    return this.jwtHelperService.decodeToken(token);
  }
}

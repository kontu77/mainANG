import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserDetailsResponse, EditProfileRequest, ChangePasswordRequest } from '../models/models';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private api = environment.apiUrl;

  getMe(): Observable<UserDetailsResponse> {
    return this.http.get<UserDetailsResponse>(`${this.api}/users/me`);
  }

  editProfile(data: EditProfileRequest): Observable<any> {
    return this.http.put(`${this.api}/users`, data);
  }

  changePassword(data: ChangePasswordRequest): Observable<any> {
    return this.http.put(`${this.api}/users/change-password`, data);
  }

  deleteProfile(): Observable<any> {
    return this.http.delete(`${this.api}/users/delete-profile`);
  }
}

import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { User, LoginResponse } from './user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  url = 'http://localhost:4001/auth';
  private http = inject(HttpClient);

  private _isLoggedIn = signal<boolean>(false);
  private _currentUser = signal<User | null>(null);

  isLoggedIn = this._isLoggedIn.asReadonly();
  currentUser = this._currentUser.asReadonly();

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.url}/login`, { email, password }).pipe(
      tap((response) => {
        this._currentUser.set(response.user);
        this._isLoggedIn.set(true);
        localStorage.setItem('token', response.token);
      }),
    );
  }

  register(firstName: string, lastName: string, email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.url}/register`, { firstName, lastName, email, password }).pipe(
      tap((response) => {
        this._currentUser.set(response.user);
        this._isLoggedIn.set(true);
        localStorage.setItem('token', response.token);
      }),
    );
  }

  logout(): void {
    this._currentUser.set(null);
    this._isLoggedIn.set(false);
    localStorage.removeItem('token');
  }
}
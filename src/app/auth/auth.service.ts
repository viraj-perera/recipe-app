import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject, throwError } from 'rxjs';
import { catchError, tap, timeout } from 'rxjs/operators';
import { User } from './user.model';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  user = new BehaviorSubject<User>(null);
  tokenExpirationTimer = null;

  constructor(private http: HttpClient, private router:Router) {}

  signUp(email: string, password: string) {

    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyD24CNmJSq3-Ojic4-rLbwvVxXf5Vk_OLU',
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap((resData) => {
          this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
        })
      );
  }

  handleAuthentication(
    email: string,
    userId: string,
    idToken: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(
      new Date().getTime() + +expiresIn * 1000
    );
    const userObj = new User(
      email,
      userId,
      idToken,
      expirationDate
    );
    this.user.next(userObj);
    localStorage.setItem('userData', JSON.stringify(userObj));
    this.enableAutoLogout(expiresIn * 1000);
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyD24CNmJSq3-Ojic4-rLbwvVxXf5Vk_OLU',
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(catchError(this.handleError), 
        tap((resData) => {
          this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
        })
      );
  }

  logout(){
    this.user.next(null);
    localStorage.removeItem('userData');
    this.router.navigate(['/auth']);
    if(this.tokenExpirationTimer){
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  enableAutoLogout(expirationTime){
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationTime);
  }

  autoLogin(){

    const userData:{
      email:string, 
      id: string,
      _token: string,
      _tokenExpirationDate: string
    } = JSON.parse(localStorage.getItem('userData'));

    if(!userData){
      console.log('userData null')
      return;
    }

    const loadedUser = new User(
      userData.email, 
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if(loadedUser.token){
      console.log('Autologin worked..')
      this.user.next(loadedUser);
      const expirationTime = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.enableAutoLogout(expirationTime);
    }
    
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred.';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email is already registered.';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email is not found';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'This password is incorrect.';
        break;
    }
    return throwError(errorMessage);
  }
}

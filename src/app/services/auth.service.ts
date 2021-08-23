import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, tap } from "rxjs/operators";
import { BehaviorSubject, throwError } from "rxjs";
import { User } from "../components/auth/user.model";
import { Router } from "@angular/router";

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) {}

  signup(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCu5_5fU98zRHKgdZ-hdwfYmkrVrv7y5yg",
        {
          email,
          password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handelError),
        tap((resData) =>
          this.handelAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          )
        )
      );
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCu5_5fU98zRHKgdZ-hdwfYmkrVrv7y5yg",
        {
          email,
          password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handelError),
        tap((resData) =>
          this.handelAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          )
        )
      );
  }

  logout() {
    this.user.next(null);
    this.router.navigate(["/auth"]);
    localStorage.removeItem("userData");
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  private handelError(errResponse: HttpErrorResponse) {
    let errorMessage = "An error accurred :(";
    if (!errResponse.error || !errResponse.error.error) {
      return throwError(errorMessage);
    }
    switch (errResponse.error.error.message) {
      case "EMAIL_EXISTS":
        errorMessage = "This Email Already Exists";
        break;
      case "INVALID_PASSWORD":
      case "EMAIL_NOT_FOUND":
        errorMessage = "Details Not Correct";
        break;
    }
    return throwError(errorMessage);
  }

  autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpireDate: string;
    } = JSON.parse(localStorage.getItem("userData"));
    if (!userData) {
      return;
    }
    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpireDate)
    );

    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration =
        new Date(userData._tokenExpireDate).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  autoLogout(expireDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expireDuration);
  }

  private handelAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ) {
    {
      const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000);
      const user = new User(email, userId, token, expirationDate);
      this.user.next(user);
      this.autoLogout(expiresIn * 1000);
      localStorage.setItem("userData", JSON.stringify(user));
    }
  }
}

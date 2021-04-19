import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment, SERVER_URL } from '../../environments/environment';
import { from, Observable, Subject } from 'rxjs';
import { tap, catchError, first } from 'rxjs/operators';
import { AuthResponse } from '../interfaces/auth-response';
import { User } from '../interfaces/user';
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserProviderService {

  private _currentUser: User;
  private setUserSubject = new Subject<User>()
  private _storage: Storage;

  get currentUser() {
    if (this._currentUser) {
      return this._currentUser;
    } else {
      this.logout();
    }
  }

  set currentUser(newCurrentUser: User) {
    this._currentUser = newCurrentUser;
    this.setUserSubject.next(newCurrentUser);
  }

  constructor(
    private http: HttpClient,
    private storage: Storage,
    private router: Router,
  ) {
    // this.init();
   }

  async init() {
    const storage = await this.storage.create()
    this._storage = storage
  }

  getSetUserSubject(): Subject<User> {
    return this.setUserSubject
  }

  getUserFromStorage(): Observable<User> { // This function goes around the storage module to return the user syncronously.
    return from(this._storage.get('USER'))
  }

  getJWTFromStorage(): Observable<string> {
    return from(this._storage.get('ACCESS_TOKEN'))
  }

  /**
   * This function calls the server and trys to check if the email and password
   * provided is a real user, if it is it returns the user
   *
   * @param {string} email
   * @param {string} password
   * @returns {Promise<User>}
   * @memberof UserProviderService
   */
  async login(email: string, password: string): Promise<User> {

    // Create body of request
    let body = {
      email: email,
      password: password
    }

    let _this = this;
    return new Promise(async function (resolve, reject) {

      try {

        // Ask the server to try and login the user
        let response = await _this.http.post<AuthResponse>(SERVER_URL + 'users/login', body).toPromise();

        // As long as a user was returned we want to store information
        if (response.user) {

          // Store the access token and how long until it expires on phone
          await _this._storage.set("ACCESS_TOKEN", response.access_token);
          await _this._storage.set("EXPIRES_IN", response.expires_in);
          await _this._storage.set("USER", response.user);

          // Set the current user to the returned value
          _this.currentUser = response.user;
          console.log(_this.currentUser);

          resolve(_this.currentUser);

        }
      } catch (error) {
        reject(error.error);
      }
    })
  }

  /**
   * Checks if the access token on the current device is expired or not
   *
   * @returns {Promise<User>}
   * @memberof UserProviderService
   */
  async verifyAccessToken(): Promise<User> {
    let _this = this;
    return new Promise(async function (resolve, reject) {
      try {

        // Calls the server to check if the token in the header is valid
        let response = await _this.http.post<User>(SERVER_URL + 'users/verifyAuth', {}).toPromise();
        if (response) {
          console.log('verified');
          _this.currentUser = await _this._storage.get('USER');
          resolve(response);
        } else {
          console.log('No user returned');
          reject('No user returned');
        }

      } catch (error) {
        reject(error);
      }
    })
  }

  /**
   * Calls the server to create a new user given the email and password
   *
   * @param {string} email
   * @param {string} password
   * @returns {Promise<User>}
   * @memberof UserProviderService
   */
  async register(email: string, password: string, firstname: string, lastname: string, phone: string): Promise<User> {

    // Create body of the request
    let body = {
      email: email,
      password: password,
      firstname: firstname,
      lastname: lastname,
      phone: phone
    }

    let _this = this;
    return new Promise(async function (resolve, reject) {
      try {

        // Call server to create the user
        let response = await _this.http.post<AuthResponse>(SERVER_URL + 'users/register', body).toPromise();
        if (response.user) {

          // Store the access token and expires in that was created on the server
          await _this._storage.set("ACCESS_TOKEN", response.access_token);
          await _this._storage.set("EXPIRES_IN", response.expires_in);
          await _this._storage.set("USER", response.user);
          _this.currentUser = response.user;
          resolve(_this.currentUser);

        }

      } catch (error) {
        reject(error.error);
      }
    })
  }

  /**
   * Simply deletes the access token on the local device
   *
   * @memberof UserProviderService
   */
  async logout() {
    await this._storage.set("ACCESS_TOKEN", '');
    await this._storage.clear();
    this.router.navigate(['/login']);
  }

  async updateUser(userid: number, email: string, firstname: string, lastname: string, phone: string): Promise<User> {
    let requestBody = {
      email: email,
      firstname: firstname,
      lastname: lastname,
      phone: phone
    }

    let _this = this;
    return new Promise(async function (resolve, reject) {

      try {

        // Ask the server to try and login the user
        let response = await _this.http.patch<User>(SERVER_URL + 'users/' + userid, requestBody).toPromise();
        _this.currentUser = response;
        this.setUserSubject.next(response);
        // As long as a user was returned we want to store information
        if (response) {

          resolve(response);

        }
      } catch (error) {
        reject(error.error);
      }
    })
  }

  clearProperties() {
    this.currentUser = null;
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment, SERVER_URL } from '../../environments/environment';
import { Observable } from 'rxjs';
import { tap, catchError, first } from 'rxjs/operators';
import { AuthResponse } from '../interfaces/auth-response';
import { User } from '../interfaces/user';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { Events } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UserProviderService {

  private _currentUser: User;

  get currentUser() {
    if (this._currentUser) {
      return this._currentUser;
    } else {
      this.logout();
    }
  }

  set currentUser(newCurrentUser: User) {
    this._currentUser = newCurrentUser;
    this.events.publish('setUser');
  }

  constructor(
    private http: HttpClient,
    private storage: Storage,
    private router: Router,
    private events: Events
  ) { }

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
          await _this.storage.set("ACCESS_TOKEN", response.access_token);
          await _this.storage.set("EXPIRES_IN", response.expires_in);
          await _this.storage.set("USER", response.user);

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
          _this.currentUser = await _this.storage.get('USER');
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
          await _this.storage.set("ACCESS_TOKEN", response.access_token);
          await _this.storage.set("EXPIRES_IN", response.expires_in);
          await _this.storage.set("USER", response.user);
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
    await this.storage.set("ACCESS_TOKEN", '');
    await this.storage.clear();
    this.currentUser = null;
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
        _this.events.publish('setUser');
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

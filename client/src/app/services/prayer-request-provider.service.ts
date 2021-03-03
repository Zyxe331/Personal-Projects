import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SERVER_URL } from '../../environments/environment';
import { UserProviderService } from '../services/user-provider.service';
import { PrayerRequest } from '../interfaces/prayer-request';
import { PrayerSchedule } from '../interfaces/prayer-schedule';
import { Tag } from 'src/app/interfaces/tag';
import { GlobalProviderService } from '../services/global-provider.service';
import { PrayerTag } from '../interfaces/prayer-tag';
import { Observable } from 'rxjs';
import { Time } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class PrayerRequestProviderService {

  constructor(
    private globalServices: GlobalProviderService,
    private http: HttpClient,
    private userServices: UserProviderService
  ) { }

  /**
   * Returns all prayer requests for the current user
   *
   * @returns {Promise<PrayerRequest[]>}
   * @memberof PrayerRequestProviderService
   */
  async getThisUsersPrayers(): Promise<PrayerRequest[]> {

    let userId = this.userServices.currentUser.Id;
    let _this = this;
    return new Promise(async function (resolve, reject) {
      try {

        // Ask the server to get all journals
        let prayers = await _this.http.get<PrayerRequest[]>(SERVER_URL + 'prayer-requests/' + userId, {}).toPromise();
        console.log(prayers);

        // Resolve the journals if they exist
        if (prayers) {

          resolve(prayers);

        }
      } catch (error) {
        reject(error.error);
      }
    })
  }

  async getThisPrayersTags(prayerId: number): Promise<PrayerTag[]> {

    let _this = this;
    return new Promise(async function (resolve, reject) {
      try {

        // Ask the server to get all tags for the prayer
        let tags = await _this.http.get<PrayerTag[]>(SERVER_URL + 'tags/' + prayerId).toPromise();

        // Resolve the tags if they exist
        if (tags) {

          resolve(tags);

        }
      } catch (error) {
        reject(error.error);
      }
    })
  }

  getThisPrayersTagsAsObservable(prayerId: number): Observable<PrayerTag[]> {
        // Ask the server to get all tags for the prayer
        return this.http.get<PrayerTag[]>(SERVER_URL + 'tags/' + prayerId)
  }

  /**
   * Sends information to the database in order to create a 
   * prayer request with the provided data
   *
   * @param {string} title
   * @param {string} body
   * @param {boolean} isprivate
   * @param {number} frequency
   * @param {number} sectionId
   * @returns {Promise<PrayerRequest>}
   * @memberof PrayerRequestProviderService
   */
  async addPrayer(title: string, body: string, isprivate: boolean, tagIds: number[], sectionId: number, frequency?: number, nDate?: string, nTime?: string ): Promise<PrayerRequest> {

    let requestBody = {
      title: title,
      body: body,
      isprivate: isprivate,
      userId: this.userServices.currentUser.Id,
      tagIds: tagIds,
      sectionId: sectionId,
      frequency: frequency,
      nDate: nDate,
      nTime: nTime
    }

    console.log(sectionId);

    let _this = this;
    return new Promise(async function (resolve, reject) {

      try {

        // Ask the server to try and login the user
        let response = await _this.http.post<PrayerRequest>(SERVER_URL + 'prayer-requests/', requestBody).toPromise();

        // As long as a user was returned we want to store information
        if (response) {

          resolve(response);

        }
      } catch (error) {
        reject(error.error);
      }
    })
  }

  addPrayerAsObservable(title: string, body: string, isprivate: boolean, tagIds: number[], sectionId: number, frequency?: number, nDate?: string, nTime?: string): Observable<PrayerRequest> {
    let requestBody = {
      title: title,
      body: body,
      isprivate: isprivate,
      userId: this.userServices.currentUser.Id,
      tagIds: tagIds,
      sectionId: sectionId,
      nDate: nDate,
      nTime: nTime,
      frequency: frequency
    }

    console.log(sectionId);
    return this.http.post<PrayerRequest>(SERVER_URL + 'prayer-requests/', requestBody)
  }

  /**
   * Sends prayer info to the database to update the prayer with 
   * the provided data
   *
   * @param {number} prayerid
   * @param {string} title
   * @param {string} body
   * @param {boolean} isprivate
   * @param {number} frequency
   * @param {string} nDate
   * @param {string} nTime
   * @returns {Promise<PrayerRequest>}
   * @memberof PrayerRequestProviderService
   */
  async updatePrayer(prayerid: number, title: string, body: string, isprivate: boolean, tagIds: number[], frequency?: number, nDate?: string, nTime?: string): Promise<PrayerRequest> {

    let requestBody = {
      title: title,
      body: body,
      isprivate: isprivate,
      tagIds: tagIds,
      nDate: nDate,
      nTime: nTime,
      frequency: frequency
    }

    let _this = this;
    return new Promise(async function (resolve, reject) {

      try {

        // Ask the server to try and login the user
        let response = await _this.http.patch<PrayerRequest>(SERVER_URL + 'prayer-requests/' + prayerid, requestBody).toPromise();

        // As long as a user was returned we want to store information
        if (response) {

          resolve(response);

        }
      } catch (error) {
        reject(error.error);
      }
    })
  }

  updatePrayerAsObservable(prayerid: number, title: string, body: string, isprivate: boolean, tagIds: number[], frequency?: number, nDate?: string, nTime?: string): Observable<PrayerRequest> {
    let requestBody = {
      title: title,
      body: body,
      isprivate: isprivate,
      nDate: nDate,
      nTime: nTime,
      frequency: frequency,
      tagIds: tagIds
    }
    return this.http.patch<PrayerRequest>(SERVER_URL + 'prayer-requests/' + prayerid, requestBody)
  }

  /**
   * Transforms a list of prayers' CreatedDate into well formatted strings
   *
   * @param {PrayerRequest[]} prayers
   * @returns {PrayerRequest[]}
   * @memberof PrayerRequestProviderService
   */
  setPrayersDates(prayers: PrayerRequest[]): PrayerRequest[] {
    for (let i = 0; i < prayers.length; i++) {
      this.setPrayerDates(prayers[i]);
    }

    return prayers;
  }

  /**
   * Transforms a single prayer's Created Date into well formatted strings
   *
   * @param {PrayerRequest} prayer
   * @returns {PrayerRequest}
   * @memberof PrayerRequestProviderService
   */
  setPrayerDates(prayer: PrayerRequest): PrayerRequest {
    prayer.ShortFormattedDate = this.globalServices.createShortFormattedDate(new Date(prayer.CreatedDate));
    prayer.LongFormattedDate = this.globalServices.createLongFormattedDate(new Date(prayer.CreatedDate));

    return prayer;
  }

}

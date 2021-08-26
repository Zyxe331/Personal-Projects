import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SERVER_URL } from '../../environments/environment';
import { UserProviderService } from '../services/user-provider.service';
import { GlobalProviderService } from '../services/global-provider.service';
import { Journal } from '../interfaces/journal';
import { Observable, ReplaySubject } from 'rxjs';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class JournalProviderService {
  private userJournals$: Subject<Journal[]> = new ReplaySubject<Journal[]>(1)

  constructor(
    private http: HttpClient, 
    private userServices: UserProviderService, 
    private globalServices: GlobalProviderService
    ) { }

  /**
   * Sends a journal object to the server to insert into database
   *
   * @param {string} title
   * @param {string} journalBody
   * @param {number} sectionId
   * @returns {Promise<Journal>}
   * @memberof JournalProviderService
   */
  async addJournal(title: string, journalBody: string, sectionId: number): Promise<Journal> {

    let requestBody = {
      title: title,
      body: journalBody,
      userId: this.userServices.currentUser.Id,
      sectionId: sectionId
    }

    let _this = this;
    return new Promise(async function (resolve, reject) {

      try {

        // Ask the server to try and login the user
        let response = await _this.http.post<Journal>(SERVER_URL + 'journals/', requestBody).toPromise();
        console.log('journal');
        console.log(response);
        // Fail if no journal is found
        if (!response) {
          throw "Journal failed to update"
        }

        resolve(response);

      } catch (error) {
        reject(error.error);
      }
    })
  }

  /**
   * Updates a journal with the provided title and body
   *
   * @param {string} id
   * @param {string} title
   * @param {string} journalBody
   * @returns {Promise<Journal>}
   * @memberof JournalProviderService
   */
  async updateJournal(id: number, title: string, journalBody: string): Promise<Journal> {

    let requestBody = {
      title: title,
      body: journalBody,
      userId: this.userServices.currentUser.Id,
      userRoleId: this.userServices.currentUser.Role_Id
    }

    let _this = this;
    return new Promise(async function (resolve, reject) {

      try {

        // Send journal update to the server
        let response = await _this.http.patch<Journal>(SERVER_URL + 'journals/' + id, requestBody).toPromise();

        // Fail if no journal is found
        if (!response) {
          throw "Journal failed to update"
        }

        resolve(response);

      } catch (error) {
        reject(error.error);
      }
    })
  }

  /**
   * Gets all journals related to the signed in user
   *
   * @returns {Promise<Journal[]>}
   * @memberof JournalProviderService
   */
  async getThisUsersJournals(): Promise<Journal[]> {

    let userId = this.userServices.currentUser.Id;
    let _this = this;
    return new Promise(async function (resolve, reject) {
      try {

        // Ask the server to get all journals
        let journals = await _this.http.get<Journal[]>(SERVER_URL + 'journals/' + userId, {}).toPromise();

        // Fail if no journals is found
        if (!journals) {
          throw "Journals failed to be found"
        }

        resolve(journals);

      } catch (error) {
        reject(error.error);
      }
    })
  }

  getThisUsersJournalsAsObservable(): Observable<void> {  // Triggers prayer list to be updated and sent to the journal subject.
    // Call this function when a new journal is added to the list.
    let userId = this.userServices.currentUser.Id
    return this.http.get<Journal[]>(SERVER_URL + 'journals/' + userId, {}).pipe(map((res: Journal[]) => {
      this.userJournals$.next(res)
    }))
  }

  fetchUsersJournals(): Observable<Journal[]> {
    return this.userJournals$.asObservable()
  }

  // getThisUsersJournalsAsObservable(userId: number) :Observable<Journal[]> {
  //   //let userId = this.userServices.currentUser.Id;
  //   return this.http.get<Journal[]>(SERVER_URL + 'journals/' + userId)
  // }

  /**
   * Sets fake date fields on journals that are better formatted on a list of journals
   *
   * @param {Journal[]} journals
   * @returns {Journal[]}
   * @memberof JournalProviderService
   */
  setJournalsDates(journals: Journal[]): Journal[] {

    for (let i = 0; i < journals.length; i++) {
      this.setJournalDates(journals[i]);
    }

    return journals;
  }

  /**
   * Sets fake date fields that are better formatted for a single journal
   *
   * @param {Journal} journal
   * @returns {Journal}
   * @memberof JournalProviderService
   */
  setJournalDates(journal: Journal): Journal {
    
    journal.ShortFormattedDate = this.globalServices.createShortFormattedDate(new Date(journal.CreatedDate));
    journal.LongFormattedDate = this.globalServices.createLongFormattedDate(new Date(journal.CreatedDate));

    return journal;
  }

}

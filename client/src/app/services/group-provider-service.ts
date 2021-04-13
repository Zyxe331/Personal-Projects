import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SERVER_URL } from '../../environments/environment';
import { UserProviderService } from '../services/user-provider.service';
import { GlobalProviderService } from '../services/global-provider.service';
import { Group } from '../interfaces/group';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class GroupProviderService {

    constructor(
        private http: HttpClient,
        private userServices: UserProviderService,
        private globalServices: GlobalProviderService
    ) { }



    /**
       * Returns all groups for the current user
       *
       * @returns {Promise<Group[]>}
       * @memberof GroupProviderService
       */

    getThisUsersGroups(): Promise<Group[]> {
       let userId = this.userServices.currentUser.Id;
       let _this = this;
       return new Promise(async function (resolve, reject) {
        try {
  
          // Ask the server to get all groups
          let groups = await _this.http.patch<Group[]>(SERVER_URL + 'chats/groups/' + 10, {}).toPromise();
          console.log("Await");
  
          // Fail if no groups is found
          if (!groups) {
            throw "Groups failed to be found"
          }
  
          resolve(groups);
  
        } catch (error) {
          reject(error.error);
        }
      })

    }

  /**
   * Sets fake date fields on groups that are better formatted on a list of groups
   *
   * @param {Group[]} groups
   * @returns {Group[]}
   * @memberof GroupProviderService
   */
   setGroupsDates(groups: Group[]): Group[] {

    for (let i = 0; i < groups.length; i++) {
      this.setGroupDates(groups[i]);
    }

    return groups;
  }

    /**
     * 
     * @param {Group} group
     * @returns {Group}
     * @memberof GroupProviderService
     * 
     */
    setGroupDates(group: Group): Group{
        group.ShortFormattedDate = this.globalServices.createShortFormattedDate(new Date(group.CreatedDate));
        group.LongFormattedDate = this.globalServices.createLongFormattedDate(new Date(group.CreatedDate));

        return group;
    }

}
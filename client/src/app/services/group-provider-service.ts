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

    getThisUsersGroups(): Observable<Group[]> {
       let userId = this.userServices.currentUser.Id;
       let _this = this;
       return _this.http.get<Group[]>(SERVER_URL + 'chats/' + userId, {})

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
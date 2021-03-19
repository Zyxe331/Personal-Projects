import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Group } from '../interfaces/group';
import { GroupInformation } from '../interfaces/group-information';
import { SERVER_URL } from '../../environments/environment';
import { UserProviderService } from '../services/user-provider.service';
import { UserGroup } from '../interfaces/user-group';
import { User } from '../interfaces/user';
import { Notification } from '../interfaces/notification';
import { GlobalProviderService } from './global-provider.service';
import { not } from '@angular/compiler/src/output/output_ast';
import { UserPlan } from '../interfaces/user-plan';
import { GroupedObservable, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChatProviderService {

  currentGroup: Group;
  userGroup: UserGroup;
  groupUsers: User[];
  userHasPlans: UserPlan[];
  currentUserNotifications: Notification[];
  currentUnreadNotifications: number;

  constructor(
    private http: HttpClient,
    private userServices: UserProviderService,
    private globalServices: GlobalProviderService
  ) { }

  /**
   * Querys all information for a group
   *
   * @returns {Promise<GroupInformation>}
   * @memberof ChatProviderService
   */
  async getCurrentGroupInformation(): Promise<GroupInformation> {

    let _this = this;
    return new Promise(async function (resolve, reject) {

      try {

        // Ask the server to try and get all prayer schedule possibilities
        let response = await _this.http.get<GroupInformation>(SERVER_URL + 'chats/' + _this.userServices.currentUser.Id).toPromise();

        // As long as something returned then resolved it
        if (response) {
          console.log('response');
          console.log(response);

          _this.userGroup = response.currentUserHasGroup;
          _this.currentGroup = response.currentGroup;
          _this.groupUsers = response.groupUsers;
          _this.userHasPlans = response.userHasPlans;

          resolve(response);

        }
      } catch (error) {
        reject(error.error);
      }
    })
  }

  /**
   * Querys all information for a group as an obervable
   *
   * @returns {Observable<GroupInformation>}
   * @memberof ChatProviderService
   */
   getCurrentGroupInformationAsObservable(): Observable<GroupInformation> {
        // Ask the server to try and get all prayer schedule possibilities
        return this.http.get<GroupInformation>(SERVER_URL + 'chats/' + this.userServices.getUserFromStorage().Id).pipe(map((res: GroupInformation) => {
          this.userGroup = res.currentUserHasGroup;
          this.currentGroup = res.currentGroup;
          this.groupUsers = res.groupUsers;
          this.userHasPlans = res.userHasPlans;
          return res
        }));
  }

  /**
   * Querys all notifications for this User
   *
   * @returns {Promise<Notification[]>}
   * @memberof ChatProviderService
   */
  async getUserNotifications(): Promise<Notification[]> {
    let _this = this;
    return new Promise(async function (resolve, reject) {

      try {

        // Ask the server to try and get all prayer schedule possibilities
        let response = await _this.http.get<Notification[]>(SERVER_URL + 'chats/notifications/' + _this.userServices.currentUser.Id).toPromise();

        // As long as something returned then resolved it
        if (response && response) {

          _this.currentUserNotifications = _this.setNotificationsDates(response);
          _this.currentUnreadNotifications = _this.currentUserNotifications.reduce((total, notification) => {
            if (!notification.Read) {
              return total + 1;
            } else {
              return total;
            }
          }, 0)

          resolve(response);

        }
      } catch (error) {
        reject(error.error);
      }
    })
  }

  /**
 * Sets fake date fields on journals that are better formatted on a list of journals
 *
 * @param {Journal[]} journals
 * @returns {Journal[]}
 * @memberof JournalProviderService
 */
  setNotificationsDates(notifications: Notification[]): Notification[] {

    for (let i = 0; i < notifications.length; i++) {
      this.setNotificationDates(notifications[i]);
    }

    return notifications;
  }

  /**
   * Sets fake date fields that are better formatted for a single journal
   *
   * @param {Journal} journal
   * @returns {Journal}
   * @memberof JournalProviderService
   */
  setNotificationDates(notification: Notification): Notification {

    notification.ShortFormattedDate = this.globalServices.createShortFormattedDate(new Date(notification.CreatedDate));
    notification.LongFormattedDate = this.globalServices.createLongFormattedDate(new Date(notification.CreatedDate));

    return notification;
  }

  async requestJoinGroup(groupNumber: number) {
    let _this = this;
    return new Promise(async function (resolve, reject) {

      try {

        let request = {
          userId: _this.userServices.currentUser.Id
        }

        // Ask the server to try and get all prayer schedule possibilities
        let response = await _this.http.post<Notification>(SERVER_URL + 'chats/joinGroup/' + groupNumber, request).toPromise();
        console.log('test');
        console.log(response);
        // As long as something returned then resolved it
        if (response) {

          resolve(response);

        }
      } catch (error) {
        reject(error.error);
      }
    })
  }

  async acceptUserIntoGroup(notificationId: number, requestingUserId: number, adminUserId: number, groupId: number) {
    let _this = this;
    return new Promise(async function (resolve, reject) {

      try {

        let request = {
          notificationId: notificationId,
          requestingUserId: requestingUserId,
          adminUserId: adminUserId,
          accepted: true
        }

        // Ask the server to try and get all prayer schedule possibilities
        let response = await _this.http.post<boolean>(SERVER_URL + 'chats/manageGroup/' + groupId, request).toPromise();

        // As long as something returned then resolved it
        if (response) {

          resolve(response);

        }
      } catch (error) {
        reject(error.error);
      }
    })
  }

  async rejectUserFromGroup(notificationId: number, requestingUserId: number, adminUserId: number, groupId: number) {
    let _this = this;
    return new Promise(async function (resolve, reject) {

      try {

        let request = {
          notificationId: notificationId,
          requestingUserId: requestingUserId,
          adminUserId: adminUserId,
          accepted: false
        }

        // Ask the server to try and get all prayer schedule possibilities
        let response = await _this.http.post<boolean>(SERVER_URL + 'chats/manageGroup/' + groupId, request).toPromise();

        // As long as something returned then resolved it
        if (response) {

          resolve(response);

        }
      } catch (error) {
        reject(error.error);
      }
    })
  }

  async readNotification(notificationId: number, notificationCompleted: boolean) {
    let _this = this;
    return new Promise(async function (resolve, reject) {
      try {

        let request = {
          completed: notificationCompleted,
          read: 1
        }
        // Ask the server to try and get all prayer schedule possibilities
        let response = await _this.http.post(SERVER_URL + 'chats/notifications/' + notificationId, request).toPromise();

        // As long as something returned then resolved it
        if (response) {

          resolve(response);

        }
      } catch (error) {
        reject(error.error);
      }
    })
  }

  async nudgeUser(currentUserId: number, userToNudgeId: number) {
    let _this = this;
    return new Promise(async function (resolve, reject) {

      try {

        let request = {
          currentUserId: currentUserId
        }

        // Ask the server to try and get all prayer schedule possibilities
        let response = await _this.http.post<boolean>(SERVER_URL + 'chats/nudge/' + userToNudgeId, request).toPromise();

        // As long as something returned then resolved it
        if (response) {

          resolve(response);

        }
      } catch (error) {
        reject(error.error);
      }
    })
  }

  async updateGroup(groupId: number, name: string): Promise<Group> {
    let _this = this;
    return new Promise(async function (resolve, reject) {

      try {

        let request = {
          name: name
        }

        let response = await _this.http.patch<Group>(SERVER_URL + 'chats/groups/' + groupId, request).toPromise();

        // As long as something returned then resolved it
        if (response) {

          resolve(response);

        }
      } catch (error) {
        reject(error.error);
      }
    })
  }

  async removeUser(groupId, userId) {
    let _this = this;
    return new Promise(async function (resolve, reject) {

      try {

        let request = {
          adminUserId: _this.userServices.currentUser.Id
        };
        console.log('new test')
        let response = await _this.http.patch(`${SERVER_URL}chats/groups/${groupId}/removeUser/${userId}`, request).toPromise();

        // As long as something returned then resolved it
        if (response) {

          resolve(response);

        }
      } catch (error) {
        console.log(error);
        reject(error.error);
      }
    })
  }

  async markNotificationsAsRead(unreadNotificationIds) {
    let _this = this;
    return new Promise(async function (resolve, reject) {
      try {

        let request = {
          notificationIds: unreadNotificationIds,
          read: 1
        }
        // Ask the server to try and get all prayer schedule possibilities
        let response = await _this.http.post(SERVER_URL + 'chats/notifications', request).toPromise();

        // As long as something returned then resolved it
        if (response) {

          resolve(response);

        }
      } catch (error) {
        reject(error.error);
      }
    })
  }

  clearProperties() {
    this.currentGroup = null;
    this.userGroup = null;
    this.groupUsers = null;
    this.userHasPlans = null;
    this.currentUserNotifications = null;
    this.currentUnreadNotifications = null;
  }
}

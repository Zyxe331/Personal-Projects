import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserPlan } from 'src/app/interfaces/user-plan';
import { PlanInformation } from 'src/app/interfaces/plan-information';
import { ContentCycle } from 'src/app/interfaces/content-cycle';
import { UserProviderService } from '../services/user-provider.service';
import { Section } from 'src/app/interfaces/section';
import { Plan } from 'src/app/interfaces/plan';
import { Tag } from 'src/app/interfaces/tag';
import { SERVER_URL } from '../../environments/environment';
import { Group } from '../interfaces/group';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ContentCycleProviderService {

  public allPlans: Plan[];
  public currentPlan: Plan;
  public userPlan: UserPlan;
  public currentSectionIndex: number;
  public orderedSections: Section[];
  public sectionTagsBySection: object;
  public sectionJournalsBySection: object;
  public sectionPrayersBySection: object;
  public sectionsByCycleId: object;

  constructor(
    private http: HttpClient,
    private userServices: UserProviderService
  ) { }

  /**
   * Gets all plans in the database
   *
   * @returns {Promise<Plan[]>}
   * @memberof ContentCycleProviderService
   */
  async getAllPlans(): Promise<Plan[]> {

    if (this.allPlans && this.allPlans.length > 0) {
      return this.allPlans;
    }

    let _this = this;
    return new Promise(async function (resolve, reject) {

      try {

        // Ask the server to try and get all prayer schedule possibilities
        let response = await _this.http.get<Plan[]>(SERVER_URL + 'content-cycles/').toPromise();

        // As long as something returned then resolved it
        if (response && response) {

          _this.allPlans = response;
          resolve(response);

        }
      } catch (error) {
        reject(error.error);
      }
    })
  }

  /**
   * Creates a connection between the selected plan and the current user
   *
   * @param {Plan} plan
   * @returns
   * @memberof ContentCycleProviderService
   */
  async subscribeToPlan(plan: Plan) {
    this.currentPlan = null;
    this.userPlan = null;

    let requestBody = {
      plan: plan,
      userId: this.userServices.currentUser.Id,
    }

    let _this = this;
    return new Promise(async function (resolve, reject) {

      try {

        // Ask the server to try and get all prayer schedule possibilities
        let response = await _this.http.post<UserPlan>(SERVER_URL + 'content-cycles/subscribe', requestBody).toPromise();
        console.log(response);

        // As long as something returned then resolved it
        if (response && response) {
          console.log(response);

          _this.userPlan = response;
          resolve(response);

        }
      } catch (error) {
        reject(error.error);
      }
    })
  }

  /**
   * This function returns all the plans for the current user. No information about their enrollment, just the plan information, and the group Id it belongs to.
   * @returns Observable<Plan[]>
   */
  getUsersPlans(): Observable<Plan[]> {
    return this.userServices.getUserFromStorage().pipe(switchMap(user => {
      return this.http.get<Plan[]>(SERVER_URL + 'content-cycles/' + user.Id)
    }))
  }

  /**
   * Gets all the information for the current users current plan
   *
   * @returns {Promise<Plan>}
   * @memberof ContentCycleProviderService
   */
  async getCurrentPlanInformation(): Promise<Plan> {

    let _this = this;
    return new Promise(async function (resolve, reject) {

      try {

        // Ask the server to try and get all prayer schedule possibilities
        let response = await _this.http.get<PlanInformation>(SERVER_URL + 'content-cycles/' + _this.userServices.currentUser.Id).toPromise();
        console.log(response);
        console.log('test');

        // As long as something returned then resolved it
        if (response) {
          console.log(response);

          _this.userPlan = response.currentUserHasPlan;
          _this.currentPlan = response.currentPlan;
          _this.orderedSections = response.allSections;
          _this.sectionTagsBySection = response.sectionTagsBySection;
          _this.sectionJournalsBySection = response.sectionJournalsBySection;
          _this.sectionPrayersBySection = response.sectionPrayersBySection
          _this.sectionsByCycleId = {};

          if (_this.userPlan) {
            for (let i = 0; i < _this.orderedSections.length; i++) {
              if (_this.orderedSections[i].ContentCycle_Id in _this.sectionsByCycleId) {
                _this.sectionsByCycleId[_this.orderedSections[i].ContentCycle_Id].push(_this.orderedSections[i]);
              } else {
                _this.sectionsByCycleId[_this.orderedSections[i].ContentCycle_Id] = [_this.orderedSections[i]];
              }
            }
            _this.currentSectionIndex = _this.orderedSections.findIndex(item => item.Id == _this.userPlan.Current_Section_Id);
          } else {
            //If the user does not have a plan, generate stand-in plan data
            _this.currentPlan = new Plan()
          }
          resolve(response.currentPlan);

        }

      } catch (error) {
        console.log('returned error')
        console.log(error);
        reject(error.error);
      }
    })
  }

  /**
   * Updates the User has Plan to reference the designated section as the 
   * last section the user looked at
   *
   * @param {number} sectionId
   * @returns
   * @memberof ContentCycleProviderService
   */
  async updateUserHasPlan(sectionId: number, timesCompleted: number): Promise<boolean> {
    let _this = this;
    return new Promise(async function (resolve, reject) {

      let request = {
        sectionId: sectionId,
        timesCompleted: timesCompleted
      }

      try {

        // Ask the server to try and get all prayer schedule possibilities
        let response = await _this.http.patch(SERVER_URL + 'content-cycles/user-has-plan/' + _this.userPlan.Id, request).toPromise();

        // As long as something returned then resolved it
        if (response) {

          resolve(true);

        }
      } catch (error) {
        reject(error.error);
      }
    })
  }

  clearProperties() {
    this.allPlans = null;
    this.currentPlan = null;
    this.userPlan = null;
    this.currentSectionIndex = null;
    this.orderedSections = null;
    this.sectionJournalsBySection = null;
    this.sectionPrayersBySection = null;
    this.sectionsByCycleId = null;
  }
}

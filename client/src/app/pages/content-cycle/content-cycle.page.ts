/**
 * content-cycle.page.ts
 * The content-cycle page is used to display base information of any content cycle(s) that the user is currently enrolled in.
 * 
 * A a user can choose to leave a content cycle on this page through the change-cycle-popover component that is located in the content-cycle component.
 * 
 * A user can also utilize the page to enter the last visited section of the specific content cycle they choose.
 */
import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { ChangeCyclePopoverComponent } from './change-cycle-popover/change-cycle-popover.component'
import { Router, NavigationExtras } from '@angular/router';
import { ContentCycleProviderService } from '../../services/content-cycle-provider.service';
import { ChatProviderService } from '../../services/chat-provider.service';
import { Plan } from 'src/app/interfaces/plan';
import { Group } from 'src/app/interfaces/group';
import { User } from 'src/app/interfaces/user';
import { UserPlan } from 'src/app/interfaces/user-plan';
import { GlobalProviderService } from 'src/app/services/global-provider.service';
import { GroupInformation } from 'src/app/interfaces/group-information';

@Component({
  selector: 'app-content-cycle',
  templateUrl: './content-cycle.page.html',
  styleUrls: ['./content-cycle.page.scss'],
})
export class ContentCyclePage implements OnInit {

  plans: Plan[];
  userHasPlans: UserPlan[];
  groups: Group[];
  groupInfos: GroupInformation[] = [];

  get showSpinner() {
    return this.globalService.showSpinner;
  }

  constructor(
    private router: Router,
    private contentCycleService: ContentCycleProviderService,
    private chatService: ChatProviderService,
    private globalService: GlobalProviderService,
    public popoverController: PopoverController
  ) { }

  ngOnInit() {
    this.contentCycleService.getUsersPlans().subscribe(plans => {
      this.plans = plans
    })

    this.contentCycleService.getUsersPlanInformation().subscribe(userHasPlans => {
      this.userHasPlans = userHasPlans
    })

    this.chatService.getUsersGroups().subscribe(groups => {
      this.groups = groups
      for(let group of groups) {
        this.chatService.getCurrentGroupInformationAsObservable(group.Id).subscribe(info => {
          this.groupInfos.push(info)
        })
      }
    })
  }

  /**
   * Standard ionic function that runs everytime we go to this page
   *
   * @memberof ContentCyclePage
   */
  async ionViewWillEnter() {
    await this.globalService.loadContent(this, this.getAndOrganizeData);
  }

  /**
   * Function that retrieves and organizes all plan and group information
   *
   * @param {*} thisPage
   * @returns Acts as "this" normally would but since we call it from the global class it has to use a variable
   * @memberof ContentCyclePage
   */
  async getAndOrganizeData(thisPage) {
  }

  UserHasPlanById(id): UserPlan {
    return this.userHasPlans.find(plan => plan.Plan_Id == id)
  }

  groupById(id): Group {
    return this.groups.find(group => group.Id == id)
  }

  groupInfoById(id): GroupInformation {
    return this.groupInfos.find(info => info.currentGroup.Id == id)
  }

  calcPlanProgress(planId) {
    let userHasPlan = this.userHasPlans.find(plan => plan.Plan_Id == planId)
    let plan = this.plans.find(plan => plan.Id == planId)
    let flattenedSections = [].concat(...plan.sections)
    let progress = (flattenedSections.findIndex(section => section.Id == userHasPlan.Current_Section_Id)) / (flattenedSections.length - 1);
    return progress
  }

  calcCycleProgress(planId) {
    let userHasPlan = this.userHasPlans.find(plan => plan.Plan_Id == planId)
    let plan = this.plans.find(plan => plan.Id == planId)
    let progress
    for(let cycle of plan.sections) {
      if(cycle.find(section => section.Id == userHasPlan.Current_Section_Id)) {
        return  (cycle.findIndex(section => section.Id == userHasPlan.Current_Section_Id)) / (cycle.length - 1)
      }
    }
    return progress

  }

  goToNextSection(plan) {
    let navigationExtras: NavigationExtras = {
      state: {
        plan: plan,
        userHasPlan: this.userHasPlans.find(userHasPlan => userHasPlan.Plan_Id == plan.Id)
      }
    }
    this.router.navigate(['/section/' + this.userHasPlans.find(userHasPlan => userHasPlan.Plan_Id == plan.Id).Current_Section_Id], navigationExtras);
  }

  //Trigger confirmation popup
  async presentPopover(ev: any, groupId) {
    const popover = await this.popoverController.create({
      component: ChangeCyclePopoverComponent,
      componentProps: {
        groupId: groupId
      },
      showBackdrop:true,
      cssClass: 'change-cycle-popup',
      event: ev,
      translucent: false
    });
    return await popover.present();
  }

//Allows the user to navigate to the "change-content-cycle" page, which is really just the page that allows you to enroll in another content cycle.
  goToChangeCycle() {
    this.router.navigate(['/change-content-cycle']);
  }

}

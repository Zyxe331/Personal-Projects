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

@Component({
  selector: 'app-content-cycle',
  templateUrl: './content-cycle.page.html',
  styleUrls: ['./content-cycle.page.scss'],
})
export class ContentCyclePage implements OnInit {

  plans: Plan[];
  groups: Group[];
  planProgress;
  cycleProgress;

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
      console.log(plans)
    })

    this.chatService.getUsersGroups().subscribe(groups => {
      this.groups = groups
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
    // removed since data should be retrived in angular lifecycle
    // thisPage.currentPlan = await thisPage.contentCycleService.getCurrentPlanInformation();
    // thisPage.userHasPlan = thisPage.contentCycleService.userPlan;
    // if (!thisPage.currentPlan) {
    //   return;
    // }

    // let currentGroupInformation = await thisPage.chatService.getCurrentGroupInformation();
    // thisPage.currentGroup = currentGroupInformation.currentGroup;
    // thisPage.currentGroupMembers = currentGroupInformation.groupUsers;

    // thisPage.planProgress = thisPage.contentCycleService.currentSectionIndex / thisPage.contentCycleService.orderedSections.length;
    // let currentSection = thisPage.contentCycleService.orderedSections[thisPage.contentCycleService.currentSectionIndex];
    // thisPage.cycleProgress = (currentSection.Order - 1) / (thisPage.contentCycleService.sectionsByCycleId[currentSection.ContentCycle_Id].length - 1);
  }

  groupById(id): Group {
    return this.groups.find(group => group.Id == id)
  }

  goToNextSection() {
    this.router.navigate(['/section/' + this.contentCycleService.currentSectionIndex]);
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

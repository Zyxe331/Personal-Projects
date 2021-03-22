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

  currentPlan: Plan;
  currentGroup: Group;
  userHasPlan: UserPlan;
  currentGroupMembers: User[] = [];
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

  async ngOnInit() {

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

    thisPage.currentPlan = await thisPage.contentCycleService.getCurrentPlanInformation();
    thisPage.userHasPlan = thisPage.contentCycleService.userPlan;
    if (!thisPage.currentPlan) {
      return;
    }

    let currentGroupInformation = await thisPage.chatService.getCurrentGroupInformation();
    thisPage.currentGroup = currentGroupInformation.currentGroup;
    thisPage.currentGroupMembers = currentGroupInformation.groupUsers;

    thisPage.planProgress = thisPage.contentCycleService.currentSectionIndex / thisPage.contentCycleService.orderedSections.length;
    let currentSection = thisPage.contentCycleService.orderedSections[thisPage.contentCycleService.currentSectionIndex];
    thisPage.cycleProgress = (currentSection.Order - 1) / (thisPage.contentCycleService.sectionsByCycleId[currentSection.ContentCycle_Id].length - 1);
  }

  goToNextSection() {
    this.router.navigate(['/section/' + this.contentCycleService.currentSectionIndex]);
  }

  //Trigger confirmation popup
  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: ChangeCyclePopoverComponent,
      componentProps: {
        groupId: this.currentGroup.Id
      },
      showBackdrop:true,
      cssClass: 'change-cycle-popup',
      event: ev,
      translucent: false
    });
    return await popover.present();
  }


  goToChangeCycle() {
    this.router.navigate(['/change-content-cycle']);
  }

}

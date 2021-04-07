/**
 * change-content-cycle.page.ts
 * The change-content-cycle page is used to display the list of content cycles that the user can enroll/subscribe in
 * as well as the ability to join an already existent content cycle via a group join number.
 * 
 * Routing is utilized when a user subscribes to a plan in order to assign the proper information to the content-cycle page.
 * If subscribing to the plan fails, an error toast will appear and the user will be directed to the content-cycle page.
 */
import { Component, OnInit } from '@angular/core';
import { Plan } from 'src/app/interfaces/plan';
import { Router } from '@angular/router';
import { ContentCycleProviderService } from '../../services/content-cycle-provider.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChatProviderService } from 'src/app/services/chat-provider.service';
import { ToastController } from '@ionic/angular';
import { GlobalProviderService } from 'src/app/services/global-provider.service';

@Component({
  selector: 'app-change-content-cycle',
  templateUrl: './change-content-cycle.page.html',
  styleUrls: ['./change-content-cycle.page.scss'],
})
export class ChangeContentCyclePage implements OnInit {

  plans: Plan[];
  joinGroupForm: FormGroup;
  showErrors: boolean = false;
  serverErrors: boolean = false;
  serverError: string;

  get showSpinner() {
    return this.globalService.showSpinner;
  }

  constructor(
    private cycleService: ContentCycleProviderService,
    private globalService: GlobalProviderService,
    private router: Router,
    public formBuilder: FormBuilder,
    private chatService: ChatProviderService,
  ) {
    // Creates the new journal form with validators
    this.joinGroupForm = formBuilder.group({
      groupNumber: ['', Validators.compose([Validators.required])],
    });
  }

  async ngOnInit() {
    
  }

  /**
   * Standard ionic function that runs everytime we go to this page
   *
   * @memberof ChangeContentCyclePage
   */
  async ionViewWillEnter() { 
    await this.globalService.loadContent(this, this.getAndOrganizeData);
  }

  /**
     * Function used to setup all data for this page asynchronously
     *
     * @param {*} thisPage Acts as "this" normally would but since we call it from the global class it has to use a variable
     * @memberof ChangeContentCyclePage
     */
  async getAndOrganizeData(thisPage) {
    thisPage.plans = await thisPage.cycleService.getAllPlans();
  }

  async subscribe(plan_index) {
    try {
      let thisUserPlan = await this.cycleService.subscribeToPlan(this.plans[plan_index]);
      this.globalService.sendSuccessToast('Woohoo! You have successfully started a new plan with a new group!');
      this.router.navigate(['/content-cycle']);
    } catch (e) {
      this.globalService.sendErrorToast('Something went wrong when subscribing to that plan. Please try again.');
      this.router.navigate(['/content-cycle']);
    }
  }

  async joinGroup() {
    // Check if there are title or body errors
    if (!this.joinGroupForm.controls.groupNumber.valid) {
      this.showErrors = true;
      return
    }

    try {

      // Send journal form values to the server to insert journal
      let groupNumber = this.joinGroupForm.value.groupNumber;
      await this.chatService.requestJoinGroup(groupNumber);
      this.globalService.sendSuccessToast(`You have successfully requested to join group ${groupNumber}! Please wait for the group admin to accept you.`);
      this.router.navigate(['/content-cycle']);

    } catch (error) {

      console.log(error);
      this.globalService.sendErrorToast('Something went wrong when requesting to join this group. Please try again.');

      // Display the server errors
      this.serverErrors = true;
      this.serverError = error;

    }
  }

}

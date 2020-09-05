import { Component, OnInit } from '@angular/core';
import { Group } from 'src/app/interfaces/group';
import { User } from 'src/app/interfaces/user';
import { ChatProviderService } from 'src/app/services/chat-provider.service';
import { UserProviderService } from 'src/app/services/user-provider.service';
import { ToastController, AlertController } from '@ionic/angular';
import { UserGroup } from 'src/app/interfaces/user-group';
import { ContentCycleProviderService } from 'src/app/services/content-cycle-provider.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalProviderService } from 'src/app/services/global-provider.service';

@Component({
  selector: 'app-group',
  templateUrl: './group.page.html',
  styleUrls: ['./group.page.scss'],
})
export class GroupPage implements OnInit {

  planBuffer: number = .025;
  currentGroup: Group;
  groupMembers: User[];
  completionObject: object = {};
  currentUserGroup: UserGroup;
  editMode: boolean = false;
  currentUserPlanProgress: number;
  updateGroupForm: FormGroup;
  showErrors: boolean = false;
  serverErrors: boolean = false;
  serverError: string;

  get showSpinner() {
    return this.globalServices.showSpinner;
  }

  constructor(
    private groupServices: ChatProviderService,
    private userServices: UserProviderService,
    private cycleServices: ContentCycleProviderService,
    private toastController: ToastController,
    public formBuilder: FormBuilder,
    private globalServices: GlobalProviderService,
    private alertController: AlertController
  ) {

  }

  ngOnInit() {
    
  }

  /**
   * Standard ionic function that runs everytime we go to this page 
   *
   * @memberof GroupPage
   */
  async ionViewWillEnter() {
    await this.globalServices.loadContent(this, this.getAndOrganizeData);
  }

  /**
   * Function used to setup all data for this page asynchronously
   *
   * @param {*} thisPage Acts as "this" normally would but since we call it from the global class it has to use a variable
   * @memberof GroupPage
   */
  async getAndOrganizeData(thisPage) { 
    await thisPage.groupServices.getCurrentGroupInformation();
    thisPage.currentGroup = thisPage.groupServices.currentGroup;
    thisPage.groupMembers = thisPage.groupServices.groupUsers;
    thisPage.currentUserGroup = thisPage.groupServices.userGroup;
    thisPage.currentUserPlanProgress = (thisPage.cycleServices.currentSectionIndex / thisPage.cycleServices.orderedSections.length) + thisPage.cycleServices.userPlan.Times_Completed;

    thisPage.groupMembers.forEach(member => member.StopNudge = false);
    thisPage.createGroupMembers();
    thisPage.updateGroupForm = thisPage.formBuilder.group({
      name: [thisPage.currentGroup.Name, Validators.compose([Validators.required])]
    });
  }

  async nudgeUser(nudgedUser) {
    try {
      await this.groupServices.nudgeUser(this.userServices.currentUser.Id, nudgedUser.Id);
      const toast = await this.toastController.create({
        color: 'success',
        message: `You have nudged ${nudgedUser.FirstName}!`,
        duration: 2000
      });
      toast.present();
      let nudgedUserIndex = this.groupMembers.findIndex(member => member.Id == nudgedUser.Id);
      this.groupMembers[nudgedUserIndex].StopNudge = true;
    } catch (e) {
      console.log(e);
    }
  }

  editGroup() {
    this.editMode = true;
  }

  cancel() {
    this.editMode = false;
  }

  async save() {

    // Check if there are title or body errors
    if (!this.updateGroupForm.controls.name.valid) {
      this.showErrors = true;
      return
    }

    try {

      // Send journal form values to the server to insert journal
      let formValues = this.updateGroupForm.value;
      let group = await this.groupServices.updateGroup(this.currentGroup.Id, formValues.name);
      this.globalServices.sendSuccessToast(`Awesome, you have successfully updated your group name to "${group.Name}"`);

      if (group) {
        this.editMode = false;
        this.currentGroup = group;
      }

    } catch (error) {

      console.log(error);
      this.globalServices.sendErrorToast(`Sorry, something went wrong when attempting to update your journal.`);

      // Display the server errors
      this.serverErrors = true;
      this.serverError = error;

    }

  }

  createGroupMembers() {

    let highRange = this.currentUserPlanProgress + this.planBuffer;
    let lowRange = this.currentUserPlanProgress - this.planBuffer;
    let dangerLowRange = this.currentUserPlanProgress - (this.planBuffer * 2);
    let numberOfSectionsInPlan = this.cycleServices.orderedSections.length;

    let _this = this;
    this.groupServices.userHasPlans.forEach(uhp => {
      let currentSectionIndex = _this.cycleServices.orderedSections.findIndex(item => item.Id == uhp.Current_Section_Id);
      let planProgress = currentSectionIndex / numberOfSectionsInPlan;
      let realPlanProgress = planProgress + uhp.Times_Completed;

      _this.completionObject[uhp.User_Id] = {
        planProgress: planProgress,
        timesCompleted: uhp.Times_Completed
      }
      if (realPlanProgress < dangerLowRange) {
        _this.completionObject[uhp.User_Id].color = 'danger';
      } else if (realPlanProgress < lowRange) {
        _this.completionObject[uhp.User_Id].color = 'warning';
      } else if (realPlanProgress < highRange) {
        _this.completionObject[uhp.User_Id].color = 'tertiary';
      } else {
        _this.completionObject[uhp.User_Id].color = 'success';
      }
    });

    console.log(this.completionObject);
  }

  async presentAlertRadio(member) {
    const alert = await this.alertController.create({
      header: `Remove '${member.FirstName} ${member.LastName}'`,
      message: `Are you sure you would like to remove ${member.FirstName} ${member.LastName} from the group?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        }, {
          text: 'Remove Member',
          handler: async () => {
            console.log('test');
            await this.removeUserFromGroup(member.Id);
          }
        }
      ]
    })

    await alert.present();

  }

  async removeUserFromGroup(userId) {
    try {
      await this.groupServices.removeUser(this.currentGroup.Id, userId);
      this.globalServices.loadContent(this, this.getAndOrganizeData);
    } catch (e) {
      console.log(e);
    }
  }
}

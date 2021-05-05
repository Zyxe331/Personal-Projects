import { Component, OnInit } from '@angular/core';
import { UserProviderService } from '../../services/user-provider.service'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { User } from 'src/app/interfaces/user';
import { Plan } from 'src/app/interfaces/plan';
import { ContentCycleProviderService } from 'src/app/services/content-cycle-provider.service';
import { GlobalProviderService } from 'src/app/services/global-provider.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  currentUser: User;
  plans: Plan[] = [];
  editMode: boolean = false;
  editProfileForm: FormGroup;
  showErrors: boolean = false;
  serverError = '';
  serverErrors = false;

  get showSpinner() {
    return this.globalServices.showSpinner;
  }

  constructor(
    private userService: UserProviderService,
    public formBuilder: FormBuilder,
    private contentCycleServce: ContentCycleProviderService,
    private globalServices: GlobalProviderService
  ) { 

    this.currentUser = this.userService.currentUser;

    // Create the register form with validations
    this.editProfileForm = formBuilder.group({
      email: [this.currentUser.Email, Validators.compose([Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"), Validators.required])],
      firstname: [this.currentUser.FirstName, Validators.compose([Validators.required])],
      lastname: [this.currentUser.LastName, Validators.compose([Validators.required])],
      phone: [this.currentUser.PhoneNumber, Validators.compose([])],
    });
  }

  /**
   * Standard ionic function that runs everytime we go to this page
   *
   * @memberof ProfilePage
   */
  async ionViewWillEnter() {
    await this.globalServices.loadContent(this, this.getAndOrganizeData);
  }

  /**
   * Function used to setup all data for this page asynchronously
   *
   * @param {*} thisPage Acts as "this" normally would but since we call it from the global class it has to use a variable
   * @memberof ProfilePage
   */
  async getAndOrganizeData(thisPage) {
  }

  ngOnInit() {
    this.contentCycleServce.getUsersPlans().subscribe(plans => {
      this.plans = plans
      console.log('plans: ')
      console.log(this.plans)
      if (this.plans.length == 0){
        this.plans.push(new Plan())
        this.plans[0].Id = 0
        this.plans[0].Title = "No Enrolled Plan"
        this.plans[0].CreatedDate = null
      }
      console.log(this.plans)
    })
  }

  toggleEdit(){
    if (this.editMode == false){ this.editMode = true;}
    else {this.editMode= false;}
  }

  async save() {

    this.serverError = '';
    this.serverErrors = false;

    // Check if there are title or body errors
    if (!this.editProfileForm.controls.email.valid || !this.editProfileForm.controls.firstname.valid || !this.editProfileForm.controls.lastname.valid || !this.editProfileForm.controls.phone.valid) {
      this.showErrors = true;
      return
    }

    try {

      // Send prayer form values to the server to insert journal
      let formValues = this.editProfileForm.value;
      let user = await this.userService.updateUser(this.currentUser.Id, formValues.email, formValues.firstname, formValues.lastname, formValues.phone);
      this.globalServices.sendSuccessToast(`You have successfully updated your profile!`)
      
      if (user) {
        this.currentUser = user;
        this.editMode = false;
      }

    } catch (error) {

      console.log(error);
      this.globalServices.sendErrorToast(`Sorry, something went wrong when attempting to update your profile.`);

      // Display the server errors
      this.serverErrors = true;
      this.serverError = error;

    }
  }

  cancel(){
    this.editMode = false;
  }
  
}

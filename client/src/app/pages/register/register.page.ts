import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserProviderService } from '../../services/user-provider.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  registerForm: FormGroup;
  emailErrors: boolean = false;
  passwordErrors: boolean = false;
  lastNameErrors: boolean = false;
  firstNameErrors: boolean = false;
  serverErrors: boolean = false;
  serverError: string;

  /**
   * Creates an instance of RegisterPage.
   * @param {UserProviderService} usersService
   * @param {FormBuilder} formBuilder
   * @param {Router} router
   * @memberof RegisterPage
   */
  constructor(public usersService: UserProviderService, public formBuilder: FormBuilder, private router: Router) {

    // Create the register form with validations
    this.registerForm = formBuilder.group({
      email: ['', Validators.compose([Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"), Validators.required])],
      password: ['', Validators.compose([Validators.required])],
      firstname: ['', Validators.compose([Validators.required])],
      lastname: ['', Validators.compose([Validators.required])],
      phone: ['', Validators.compose([])],
    });
  
  }

  ngOnInit() {
  }

  /**
   * Registers a new user by calling the server, 
   * also displays errors if there are any
   *
   * @memberof RegisterPage
   */
  async register() {

    // Clears all errors from the server
    this.resetServerErrors();

    // Checks if the forms are valid if not displays errors
    let formValues = this.registerForm.value;
    if (!this.registerForm.controls.email.valid || !this.registerForm.controls.password.valid) {
      this.emailErrors = true;
      this.passwordErrors = true;
      this.firstNameErrors = true;
      this.lastNameErrors = true;
      return
    }

    try {

      // Create the user and navigate to the home page
      let user = await this.usersService.register(formValues.email, formValues.password, formValues.firstname, formValues.lastname, formValues.phone);
      this.router.navigate(['/content-cycle']);

    } catch (error) {
      
      // Display and fill in the server error
      this.serverErrors = true;
      this.serverError = error;

    }
  }

  /**
   * Utility function to clear server errors
   *
   * @memberof RegisterPage
   */
  resetServerErrors() {
    this.serverError = '';
    this.serverErrors = false;
  }

  /**
   * This function handles clearing all input fields when the value changes
   *
   * @param {*} event
   * @memberof RegisterPage
   */
  genericInputChange(event) {
    let errorVariableName = event.srcElement.parentElement.id + 'Errors';
    this[errorVariableName] = false;
  }

}
